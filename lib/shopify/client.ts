import "server-only";

import { COMMERCE } from "@/config/commerce";
import { CATEGORIES, FEATURED_PRODUCT_HANDLES, FEATURED_COUNT } from "@/config/products";
import type { Cart, Product } from "@/lib/types";
import {
  ADD_CART_LINES,
  CREATE_CART,
  GET_ALL_PRODUCTS,
  GET_CART,
  GET_PRODUCT_BY_HANDLE,
  REMOVE_CART_LINES,
  UPDATE_CART_LINES,
} from "./queries";
import { normalizeCart, normalizeProduct } from "./normalize";
import {
  FIXTURE_PRODUCTS,
  fixtureProductByHandle,
  fixtureVariantById,
} from "./fixtures";

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN?.trim();
const TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();

/**
 * Fixture mode. With no store configured the site runs against a mock catalog
 * so the storefront can be built and reviewed before Shopify exists.
 * See Plan §7, "Working without Shopify credentials".
 */
export const isFixtureMode = !DOMAIN || !TOKEN;

const endpoint = DOMAIN
  ? `https://${DOMAIN}/api/${COMMERCE.apiVersion}/graphql.json`
  : "";

/** Cache tag purged by the Shopify products/update webhook. */
export const PRODUCT_TAG = "products";

/* eslint-disable @typescript-eslint/no-explicit-any */

async function storefront<T>(
  query: string,
  variables: Record<string, unknown> = {},
  opts: { tags?: string[]; revalidate?: number | false } = {},
): Promise<T> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN!,
    },
    body: JSON.stringify({ query, variables }),
    next: {
      tags: opts.tags,
      revalidate: opts.revalidate,
    },
  });

  if (!res.ok) {
    throw new Error(`Storefront API ${res.status}: ${await res.text()}`);
  }

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(`Storefront API: ${json.errors.map((e: any) => e.message).join("; ")}`);
  }
  return json.data as T;
}

/* -------------------------------------------------------------------------- */
/* Catalog                                                                     */
/* -------------------------------------------------------------------------- */

export async function getAllProducts(): Promise<Product[]> {
  if (isFixtureMode) return FIXTURE_PRODUCTS;
  try {
    const data = await storefront<any>(
      GET_ALL_PRODUCTS,
      { first: 100 },
      { tags: [PRODUCT_TAG] },
    );
    return (data.products?.nodes ?? []).map(normalizeProduct);
  } catch (err) {
    console.error("[commerce] getAllProducts failed:", err);
    return [];
  }
}

export async function getProduct(handle: string): Promise<Product | null> {
  if (isFixtureMode) return fixtureProductByHandle(handle) ?? null;
  try {
    const data = await storefront<any>(
      GET_PRODUCT_BY_HANDLE,
      { handle },
      { tags: [PRODUCT_TAG, `product:${handle}`] },
    );
    return data.product ? normalizeProduct(data.product) : null;
  } catch (err) {
    console.error(`[commerce] getProduct(${handle}) failed:`, err);
    return null;
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.category === category);
}

/**
 * The landing page's curated row. Falls back to filling any shortfall with
 * bestsellers, so a handle that no longer exists degrades quietly rather than
 * leaving a gap in the grid.
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await getAllProducts();
  const byHandle = new Map(all.map((p) => [p.handle, p]));

  const picked: Product[] = [];
  for (const handle of FEATURED_PRODUCT_HANDLES) {
    const product = byHandle.get(handle);
    if (product) picked.push(product);
  }

  if (picked.length < FEATURED_COUNT) {
    const seen = new Set(picked.map((p) => p.handle));
    const filler = all
      .filter((p) => !seen.has(p.handle) && p.available)
      .sort((a, b) => Number(b.tags.includes("bestseller")) - Number(a.tags.includes("bestseller")));
    picked.push(...filler.slice(0, FEATURED_COUNT - picked.length));
  }

  return picked.slice(0, FEATURED_COUNT);
}

/** Categories in configured order, each with its live product count. */
export async function getCategoriesWithCounts() {
  const all = await getAllProducts();
  return [...CATEGORIES]
    .sort((a, b) => a.order - b.order)
    .map((c) => ({ ...c, count: all.filter((p) => p.category === c.handle).length }));
}

/* -------------------------------------------------------------------------- */
/* Cart                                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Fixture carts live in memory, keyed by id. Good enough to exercise every
 * cart interaction in development; replaced wholesale by the Shopify Cart API
 * the moment credentials are present.
 */
const fixtureCarts = new Map<string, Cart>();

function emptyFixtureCart(id: string): Cart {
  return {
    id,
    lines: [],
    totalQuantity: 0,
    subtotal: { amount: 0, currencyCode: COMMERCE.currency },
    checkoutUrl: `/cart/fixture-checkout?cart=${encodeURIComponent(id)}`,
  };
}

function recalcFixtureCart(cart: Cart): Cart {
  cart.totalQuantity = cart.lines.reduce((n, l) => n + l.quantity, 0);
  cart.subtotal = {
    amount: cart.lines.reduce((n, l) => n + l.lineTotal.amount, 0),
    currencyCode: COMMERCE.currency,
  };
  return cart;
}

export async function createCart(): Promise<Cart> {
  if (isFixtureMode) {
    const id = `fixture-cart-${Math.random().toString(36).slice(2, 10)}`;
    const cart = emptyFixtureCart(id);
    fixtureCarts.set(id, cart);
    return cart;
  }
  const data = await storefront<any>(CREATE_CART, { lines: [] }, { revalidate: false });
  return normalizeCart(data.cartCreate.cart);
}

export async function getCart(cartId: string): Promise<Cart | null> {
  if (isFixtureMode) return fixtureCarts.get(cartId) ?? null;
  try {
    const data = await storefront<any>(GET_CART, { id: cartId }, { revalidate: false });
    return data.cart ? normalizeCart(data.cart) : null;
  } catch (err) {
    console.error("[commerce] getCart failed:", err);
    return null;
  }
}

export async function addToCart(
  cartId: string,
  merchandiseId: string,
  quantity: number,
): Promise<Cart> {
  if (isFixtureMode) {
    const cart = fixtureCarts.get(cartId) ?? emptyFixtureCart(cartId);
    const found = fixtureVariantById(merchandiseId);
    if (!found) throw new Error("Unknown variant");
    const { product, variant } = found;

    const existing = cart.lines.find((l) => l.merchandiseId === merchandiseId);
    if (existing) {
      existing.quantity += quantity;
      existing.lineTotal = {
        amount: existing.unitPrice.amount * existing.quantity,
        currencyCode: COMMERCE.currency,
      };
    } else {
      cart.lines.push({
        id: `line-${Math.random().toString(36).slice(2, 10)}`,
        quantity,
        merchandiseId,
        productHandle: product.handle,
        productTitle: product.title,
        variantTitle: variant.title,
        image: product.images[0] ?? null,
        unitPrice: variant.price,
        lineTotal: {
          amount: variant.price.amount * quantity,
          currencyCode: COMMERCE.currency,
        },
      });
    }
    fixtureCarts.set(cartId, cart);
    return recalcFixtureCart(cart);
  }

  const data = await storefront<any>(
    ADD_CART_LINES,
    { cartId, lines: [{ merchandiseId, quantity }] },
    { revalidate: false },
  );
  return normalizeCart(data.cartLinesAdd.cart);
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<Cart> {
  if (quantity < 1) return removeCartLine(cartId, lineId);

  if (isFixtureMode) {
    const cart = fixtureCarts.get(cartId);
    if (!cart) throw new Error("Unknown cart");
    const line = cart.lines.find((l) => l.id === lineId);
    if (line) {
      line.quantity = quantity;
      line.lineTotal = {
        amount: line.unitPrice.amount * quantity,
        currencyCode: COMMERCE.currency,
      };
    }
    return recalcFixtureCart(cart);
  }

  const data = await storefront<any>(
    UPDATE_CART_LINES,
    { cartId, lines: [{ id: lineId, quantity }] },
    { revalidate: false },
  );
  return normalizeCart(data.cartLinesUpdate.cart);
}

export async function removeCartLine(cartId: string, lineId: string): Promise<Cart> {
  if (isFixtureMode) {
    const cart = fixtureCarts.get(cartId);
    if (!cart) throw new Error("Unknown cart");
    cart.lines = cart.lines.filter((l) => l.id !== lineId);
    return recalcFixtureCart(cart);
  }

  const data = await storefront<any>(
    REMOVE_CART_LINES,
    { cartId, lineIds: [lineId] },
    { revalidate: false },
  );
  return normalizeCart(data.cartLinesRemove.cart);
}
