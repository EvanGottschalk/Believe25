/** Shared interfaces. */

/** Every section renders correctly both inline and as its own page. */
export interface SectionProps {
  /** True when rendered as a standalone route rather than on the landing page. */
  standalone?: boolean;
}

export interface Money {
  amount: number;
  currencyCode: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  available: boolean;
  /** null when the commerce provider isn't tracking stock for this variant. */
  quantityAvailable: number | null;
  price: Money;
  compareAtPrice: Money | null;
  selectedOptions: { name: string; value: string }[];
}

export interface ProductImage {
  url: string;
  altText: string;
  width: number;
  height: number;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  /** Collection handle, matching config/products.ts. */
  category: string;
  images: ProductImage[];
  options: { name: string; values: string[] }[];
  variants: ProductVariant[];
  priceRange: { min: Money; max: Money };
  available: boolean;
  /** Pulled from Shopify metafields; falls back to empty. */
  details: {
    materials: string;
    dimensions: string;
    care: string;
  };
  madeToOrder: boolean;
  tags: string[];
}

export interface CartLine {
  id: string;
  quantity: number;
  merchandiseId: string;
  productHandle: string;
  productTitle: string;
  variantTitle: string;
  image: ProductImage | null;
  unitPrice: Money;
  lineTotal: Money;
}

export interface Cart {
  id: string;
  lines: CartLine[];
  totalQuantity: number;
  subtotal: Money;
  checkoutUrl: string;
}

export type CartMutation =
  | { op: "add"; merchandiseId: string; quantity: number }
  | { op: "update"; lineId: string; quantity: number }
  | { op: "remove"; lineId: string };
