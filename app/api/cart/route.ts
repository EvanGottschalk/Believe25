import { NextResponse } from "next/server";
import {
  addToCart,
  createCart,
  getCart,
  removeCartLine,
  updateCartLine,
} from "@/lib/shopify/client";

/**
 * All Storefront API traffic goes through here so the access token stays
 * server-side. The client never holds anything but a cart id.
 */
export async function POST(request: Request) {
  let body: {
    op?: string;
    cartId?: string | null;
    merchandiseId?: string;
    lineId?: string;
    quantity?: number;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { op, cartId, merchandiseId, lineId, quantity } = body;

  try {
    switch (op) {
      case "get": {
        if (!cartId) return NextResponse.json(await createCart());
        const cart = await getCart(cartId);
        // A cart id that no longer resolves (expired, or a fixture cart lost to
        // a server restart) gets quietly replaced rather than erroring.
        return NextResponse.json(cart ?? (await createCart()));
      }

      case "add": {
        if (!merchandiseId) {
          return NextResponse.json({ error: "merchandiseId required" }, { status: 400 });
        }
        const qty = clampQuantity(quantity ?? 1);
        let id = cartId;
        if (!id || !(await getCart(id))) {
          id = (await createCart()).id;
        }
        return NextResponse.json(await addToCart(id, merchandiseId, qty));
      }

      case "update": {
        if (!cartId || !lineId) {
          return NextResponse.json({ error: "cartId and lineId required" }, { status: 400 });
        }
        return NextResponse.json(
          await updateCartLine(cartId, lineId, clampQuantity(quantity ?? 1)),
        );
      }

      case "remove": {
        if (!cartId || !lineId) {
          return NextResponse.json({ error: "cartId and lineId required" }, { status: 400 });
        }
        return NextResponse.json(await removeCartLine(cartId, lineId));
      }

      default:
        return NextResponse.json({ error: "Unknown op" }, { status: 400 });
    }
  } catch (err) {
    console.error("[api/cart]", err);
    return NextResponse.json({ error: "Cart operation failed" }, { status: 500 });
  }
}

function clampQuantity(n: number): number {
  if (!Number.isFinite(n)) return 1;
  return Math.max(0, Math.min(99, Math.floor(n)));
}
