"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { FreeShippingMeter } from "./FreeShippingMeter";
import { Price } from "./Price";
import { useCart } from "@/lib/cart/CartContext";
import { COMMERCE } from "@/config/commerce";
import type { CartLine as CartLineType } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const { cart, isOpen, close, isBusy, error } = useCart();
  const lines = cart?.lines ?? [];
  const isEmpty = lines.length === 0;

  return (
    <Drawer open={isOpen} onClose={close} title={COMMERCE.copy.bag}>
      <header className="flex items-center justify-between border-b border-foreground/10 px-5 py-5">
        <h2 className="font-display text-display-sm">
          {COMMERCE.copy.bag}
          {cart && cart.totalQuantity > 0 && (
            <span className="ml-2 font-body text-sm text-foreground-muted">
              ({cart.totalQuantity})
            </span>
          )}
        </h2>
        <button
          onClick={close}
          aria-label="Close bag"
          className="-mr-2 flex h-11 w-11 items-center justify-center rounded-pill text-foreground-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      {isEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
          <p className="font-display text-display-sm">{COMMERCE.copy.bagEmptyTitle}</p>
          <p className="max-w-[24ch] font-body text-sm text-foreground-muted">
            {COMMERCE.copy.bagEmptyBody}
          </p>
          <Button href="/shop" variant="primary" size="md" onClick={close} className="mt-2">
            {COMMERCE.copy.bagEmptyCta}
          </Button>
        </div>
      ) : (
        <>
          <ul className="flex-1 divide-y divide-foreground/8 overflow-y-auto px-5">
            {lines.map((line) => (
              <CartLineRow key={line.id} line={line} onNavigate={close} />
            ))}
          </ul>

          <div className="border-t border-foreground/10">
            <FreeShippingMeter subtotal={cart?.subtotal.amount ?? 0} />

            <div className="flex items-baseline justify-between px-5 pb-1">
              <span className="font-body text-sm text-foreground-muted">
                {COMMERCE.copy.subtotal}
              </span>
              {cart && <Price amount={cart.subtotal} className="text-lg" />}
            </div>

            <p className="px-5 pb-3 font-body text-xs text-foreground-muted">
              {COMMERCE.copy.checkoutNote}
            </p>

            {error && (
              <p role="alert" className="px-5 pb-2 font-body text-sm text-primary">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-2 px-5 pb-6">
              <Button
                href={cart?.checkoutUrl ?? "#"}
                variant="primary"
                size="lg"
                className={cn("w-full", isBusy && "pointer-events-none opacity-60")}
              >
                {COMMERCE.copy.checkout}
              </Button>
              <button
                onClick={close}
                className="min-h-[44px] font-body text-sm text-foreground-muted underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {COMMERCE.copy.keepLooking}
              </button>
            </div>
          </div>
        </>
      )}
    </Drawer>
  );
}

function CartLineRow({
  line,
  onNavigate,
}: {
  line: CartLineType;
  onNavigate: () => void;
}) {
  const { update, remove, lastAddedLineId } = useCart();
  const justAdded = lastAddedLineId === line.id;

  return (
    <motion.li
      layout
      className="flex gap-4 py-5"
      animate={
        justAdded
          ? { backgroundColor: ["rgba(244,198,222,0.5)", "rgba(244,198,222,0)"] }
          : {}
      }
      transition={{ duration: 1.4 }}
    >
      <Link
        href={`/shop/${line.productHandle}`}
        onClick={onNavigate}
        className="relative h-24 w-20 shrink-0 overflow-hidden rounded-sm bg-surface"
      >
        {line.image && (
          <Image
            src={line.image.url}
            alt={line.image.altText}
            fill
            sizes="80px"
            className="object-cover"
          />
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex justify-between gap-3">
          <Link
            href={`/shop/${line.productHandle}`}
            onClick={onNavigate}
            className="font-body text-sm font-medium hover:text-accent"
          >
            {line.productTitle}
          </Link>
          <Price amount={line.lineTotal} className="shrink-0 text-sm" />
        </div>

        {line.variantTitle && line.variantTitle !== "Default Title" && (
          <p className="mt-0.5 font-body text-xs text-foreground-muted">
            {line.variantTitle}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center rounded-pill border border-foreground/15">
            <QtyButton
              label="Decrease quantity"
              onClick={() => update(line.id, line.quantity - 1)}
            >
              −
            </QtyButton>
            <span className="w-8 text-center font-body text-sm tabular-nums">
              {line.quantity}
            </span>
            <QtyButton
              label="Increase quantity"
              onClick={() => update(line.id, line.quantity + 1)}
            >
              +
            </QtyButton>
          </div>

          <button
            onClick={() => remove(line.id)}
            className="min-h-[44px] font-body text-xs text-foreground-muted underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {COMMERCE.copy.remove}
          </button>
        </div>
      </div>
    </motion.li>
  );
}

function QtyButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="flex h-11 w-10 items-center justify-center text-foreground-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {children}
    </button>
  );
}
