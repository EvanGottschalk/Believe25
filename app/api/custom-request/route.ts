import { NextResponse } from "next/server";
import { FORMS } from "@/config/forms";
import { SITE } from "@/config/site";
import { isValidEmail } from "@/lib/utils";

/**
 * Receives a completed style questionnaire and forwards it to the configured
 * destination. No payment is taken and no account is required — see Plan §5.3.
 */

// In-memory rate limiting. Adequate for a single-instance deploy; swap for a
// shared store if this ever runs on more than one instance.
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const { max, windowMs } = FORMS.rateLimit;
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > max;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json({ error: FORMS.validation.rateLimited }, { status: 429 });
  }

  let body: {
    answers?: Record<string, string | string[]>;
    name?: string;
    email?: string;
    fromProduct?: string | null;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const answers = body.answers ?? {};

  if (!name) {
    return NextResponse.json({ error: FORMS.validation.required }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: FORMS.validation.invalidEmail }, { status: 400 });
  }

  // Validate against the configured questions rather than trusting the payload.
  const cleaned: Record<string, string> = {};
  for (const question of FORMS.quiz) {
    const value = answers[question.id];
    if (value === undefined) continue;

    if (question.type === "text") {
      if (typeof value !== "string") continue;
      const max = question.maxLength ?? 1000;
      if (value.length > max) {
        return NextResponse.json({ error: FORMS.validation.tooLong }, { status: 400 });
      }
      cleaned[question.id] = value.trim();
      continue;
    }

    const allowed = new Set(question.options?.map((o) => o.value) ?? []);
    const values = (Array.isArray(value) ? value : [value]).filter(
      (v): v is string => typeof v === "string" && allowed.has(v),
    );
    if (values.length > 0) cleaned[question.id] = values.join(", ");
  }

  const payload = {
    _subject: `New custom design request — ${name}`,
    name,
    email,
    fromProduct: body.fromProduct || "(none)",
    submittedAt: new Date().toISOString(),
    site: SITE.url,
    ...cleaned,
  };

  const endpoint = process.env.CUSTOM_FORM_ENDPOINT;

  if (!endpoint) {
    // Not configured yet (Tasks for Humans #9). Log it so nothing is lost in
    // development, and still report success — the visitor did their part.
    console.warn(
      "[custom-request] CUSTOM_FORM_ENDPOINT is not set. Request logged only:",
      JSON.stringify(payload, null, 2),
    );
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Endpoint responded ${res.status}`);
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    // Log the full request so a delivery failure never loses a customer.
    console.error("[custom-request] delivery failed:", err, JSON.stringify(payload));
    return NextResponse.json({ error: FORMS.validation.serverError }, { status: 502 });
  }
}
