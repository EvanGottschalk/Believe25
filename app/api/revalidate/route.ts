import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { PRODUCT_TAG } from "@/lib/shopify/client";

/**
 * Shopify products/update webhook. Purges cached product data so a price or
 * stock change in the admin is live within seconds, without a deploy.
 *
 * Configure in Shopify: Settings -> Notifications -> Webhooks, pointing at
 * /api/revalidate?secret=<SHOPIFY_REVALIDATION_SECRET>.
 */
export async function POST(request: Request) {
  const secret = process.env.SHOPIFY_REVALIDATION_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Revalidation not configured" }, { status: 501 });
  }

  const url = new URL(request.url);
  const provided =
    url.searchParams.get("secret") ?? request.headers.get("x-revalidate-secret");

  if (provided !== secret) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  revalidateTag(PRODUCT_TAG);

  // Also purge the specific product when Shopify names one.
  try {
    const body = await request.json();
    if (body?.handle) revalidateTag(`product:${body.handle}`);
  } catch {
    // Webhook body is optional for our purposes — the broad purge already ran.
  }

  return NextResponse.json({ revalidated: true, at: Date.now() });
}
