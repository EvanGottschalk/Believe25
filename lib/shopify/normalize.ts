/** Maps raw Storefront API payloads onto the app's own types. */

import type { Cart, CartLine, Money, Product, ProductVariant } from "@/lib/types";
import { CATEGORY_HANDLES } from "@/config/products";

/* eslint-disable @typescript-eslint/no-explicit-any */

function money(raw: any): Money {
  return {
    amount: Number.parseFloat(raw?.amount ?? "0"),
    currencyCode: raw?.currencyCode ?? "USD",
  };
}

function optionalMoney(raw: any): Money | null {
  return raw ? money(raw) : null;
}

export function normalizeProduct(raw: any): Product {
  const variants: ProductVariant[] = (raw.variants?.nodes ?? []).map((v: any) => ({
    id: v.id,
    title: v.title,
    available: Boolean(v.availableForSale),
    quantityAvailable: typeof v.quantityAvailable === "number" ? v.quantityAvailable : null,
    price: money(v.price),
    compareAtPrice: optionalMoney(v.compareAtPrice),
    selectedOptions: v.selectedOptions ?? [],
  }));

  // A product can belong to several collections; the first that matches a
  // configured category wins, so an "All" or seasonal collection doesn't
  // hijack the product's category.
  const collectionHandles: string[] = (raw.collections?.nodes ?? []).map((c: any) => c.handle);
  const category = collectionHandles.find((h) => CATEGORY_HANDLES.includes(h)) ?? "";

  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    description: raw.description ?? "",
    category,
    images: (raw.images?.nodes ?? []).map((img: any) => ({
      url: img.url,
      altText: img.altText ?? raw.title,
      width: img.width ?? 1200,
      height: img.height ?? 1200,
    })),
    options: (raw.options ?? []).map((o: any) => ({ name: o.name, values: o.values })),
    variants,
    priceRange: {
      min: money(raw.priceRange?.minVariantPrice),
      max: money(raw.priceRange?.maxVariantPrice),
    },
    available: Boolean(raw.availableForSale),
    details: {
      materials: raw.materials?.value ?? "",
      dimensions: raw.dimensions?.value ?? "",
      care: raw.care?.value ?? "",
    },
    madeToOrder: raw.madeToOrder?.value === "true",
    tags: raw.tags ?? [],
  };
}

export function normalizeCart(raw: any): Cart {
  const lines: CartLine[] = (raw.lines?.nodes ?? []).map((line: any) => {
    const merch = line.merchandise ?? {};
    return {
      id: line.id,
      quantity: line.quantity,
      merchandiseId: merch.id,
      productHandle: merch.product?.handle ?? "",
      productTitle: merch.product?.title ?? "",
      variantTitle: merch.title ?? "",
      image: merch.image
        ? {
            url: merch.image.url,
            altText: merch.image.altText ?? merch.product?.title ?? "",
            width: merch.image.width ?? 400,
            height: merch.image.height ?? 400,
          }
        : null,
      unitPrice: money(merch.price),
      lineTotal: money(line.cost?.totalAmount),
    };
  });

  return {
    id: raw.id,
    lines,
    totalQuantity: raw.totalQuantity ?? 0,
    subtotal: money(raw.cost?.subtotalAmount),
    checkoutUrl: raw.checkoutUrl ?? "",
  };
}
