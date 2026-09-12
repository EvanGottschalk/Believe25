import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { COMMERCE } from "@/config/commerce";
import type { Money } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(money: Money): string {
  return new Intl.NumberFormat(COMMERCE.locale, {
    style: "currency",
    currency: money.currencyCode,
    // Whole-dollar prices read cleaner without trailing zeros.
    minimumFractionDigits: Number.isInteger(money.amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(money.amount);
}

export function formatPriceRange(min: Money, max: Money): string {
  if (min.amount === max.amount) return formatMoney(min);
  return `${formatMoney(min)}–${formatMoney(max)}`;
}

/**
 * Deterministic branded gradient placeholder, as an inline SVG data URI.
 * Used wherever real photography hasn't landed yet, at the exact final aspect
 * ratio so the swap causes no layout shift.
 */
export function gradientPlaceholder(
  seed: string,
  width = 800,
  height = 800,
): string {
  const palette = [
    ["#F4C6DE", "#E3D4F0"],
    ["#E3D4F0", "#CBD9F5"],
    ["#FBF2F6", "#F4C6DE"],
    ["#F4C6DE", "#CBD9F5"],
    ["#E8D9E4", "#E3D4F0"],
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const [from, to] = palette[hash % palette.length];
  const angle = 25 + (hash % 5) * 20;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs><linearGradient id="g" gradientTransform="rotate(${angle})"><stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/></linearGradient></defs><rect width="${width}" height="${height}" fill="url(#g)"/><circle cx="${width * 0.5}" cy="${height * 0.5}" r="${Math.min(width, height) * 0.22}" fill="#FFFDFE" opacity="0.35"/></svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/** Scales a hero-tile placeholder to a wider aspect without distorting. */
export function isPlaceholder(src: string): boolean {
  return !src || src.startsWith("data:image/svg+xml");
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

/** Absolute URL for metadata. */
export function absoluteUrl(path: string, base: string): string {
  return new URL(path, base).toString();
}
