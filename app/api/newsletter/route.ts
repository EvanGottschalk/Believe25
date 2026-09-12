import { NextResponse } from "next/server";
import { isValidEmail } from "@/lib/utils";

type Provider = "klaviyo" | "mailchimp" | "convertkit";

export async function POST(request: Request) {
  let email: string;
  try {
    ({ email } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValidEmail(email ?? "")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const provider = process.env.NEWSLETTER_PROVIDER as Provider | undefined;
  const apiKey = process.env.NEWSLETTER_API_KEY;
  const listId = process.env.NEWSLETTER_LIST_ID;

  if (!provider || !apiKey || !listId) {
    // Not configured yet (Tasks for Humans #8).
    console.warn("[newsletter] Provider not configured. Signup logged only:", email);
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    await subscribe(provider, apiKey, listId, email.trim());
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[newsletter] subscribe failed:", err, email);
    return NextResponse.json({ error: "Subscription failed" }, { status: 502 });
  }
}

async function subscribe(
  provider: Provider,
  apiKey: string,
  listId: string,
  email: string,
): Promise<void> {
  let res: Response;

  switch (provider) {
    case "klaviyo":
      res = await fetch("https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs", {
        method: "POST",
        headers: {
          Authorization: `Klaviyo-API-Key ${apiKey}`,
          "Content-Type": "application/json",
          revision: "2024-10-15",
        },
        body: JSON.stringify({
          data: {
            type: "profile-subscription-bulk-create-job",
            attributes: {
              profiles: { data: [{ type: "profile", attributes: { email } }] },
            },
            relationships: { list: { data: { type: "list", id: listId } } },
          },
        }),
      });
      break;

    case "mailchimp": {
      // The datacenter suffix is part of the Mailchimp key, e.g. "…-us21".
      const dc = apiKey.split("-")[1];
      if (!dc) throw new Error("Malformed Mailchimp API key — expected a -dc suffix");
      res = await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email_address: email, status: "subscribed" }),
      });
      break;
    }

    case "convertkit":
      res = await fetch(`https://api.convertkit.com/v3/forms/${listId}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: apiKey, email }),
      });
      break;

    default:
      throw new Error(`Unknown newsletter provider: ${provider}`);
  }

  if (!res.ok) {
    throw new Error(`${provider} responded ${res.status}: ${await res.text()}`);
  }
}
