"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Cart } from "@/lib/types";
import { COMMERCE } from "@/config/commerce";

const CART_ID_KEY = "believe25:cartId";

interface CartState {
  cart: Cart | null;
  isOpen: boolean;
  isBusy: boolean;
  error: string | null;
  lastAddedLineId: string | null;
  open: () => void;
  close: () => void;
  add: (merchandiseId: string, quantity?: number) => Promise<void>;
  update: (lineId: string, quantity: number) => Promise<void>;
  remove: (lineId: string) => Promise<void>;
}

const CartContext = createContext<CartState | null>(null);

function readStoredCartId(): string | null {
  try {
    return window.localStorage.getItem(CART_ID_KEY);
  } catch {
    // Private mode, blocked storage — the cart still works for this page view.
    return null;
  }
}

function writeStoredCartId(id: string): void {
  try {
    window.localStorage.setItem(CART_ID_KEY, id);
  } catch {
    /* non-fatal */
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAddedLineId, setLastAddedLineId] = useState<string | null>(null);
  const cartIdRef = useRef<string | null>(null);

  /** Single funnel for every mutation, so busy/error handling lives in one place. */
  const call = useCallback(
    async (body: Record<string, unknown>): Promise<Cart | null> => {
      setIsBusy(true);
      setError(null);
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...body, cartId: cartIdRef.current }),
        });
        if (!res.ok) throw new Error(await res.text());
        const next: Cart = await res.json();
        cartIdRef.current = next.id;
        writeStoredCartId(next.id);
        setCart(next);
        return next;
      } catch (err) {
        console.error("[cart]", err);
        setError("That didn't work. Try again?");
        return null;
      } finally {
        setIsBusy(false);
      }
    },
    [],
  );

  // Rehydrate an existing cart on mount.
  useEffect(() => {
    const stored = readStoredCartId();
    if (!stored) return;
    cartIdRef.current = stored;
    void call({ op: "get" });
  }, [call]);

  // Keep multiple tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== CART_ID_KEY || !e.newValue) return;
      cartIdRef.current = e.newValue;
      void call({ op: "get" });
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [call]);

  const add = useCallback(
    async (merchandiseId: string, quantity = 1) => {
      const before = cart?.lines.map((l) => l.id) ?? [];
      const next = await call({ op: "add", merchandiseId, quantity });
      if (next) {
        const added =
          next.lines.find((l) => !before.includes(l.id))?.id ??
          next.lines.find((l) => l.merchandiseId === merchandiseId)?.id ??
          null;
        setLastAddedLineId(added);
        if (COMMERCE.openDrawerOnAdd) setIsOpen(true);
      }
    },
    [call, cart],
  );

  const update = useCallback(
    async (lineId: string, quantity: number) => {
      // Optimistic: the stepper responds instantly, and the server response
      // overwrites it a moment later. Rolls back automatically on failure
      // because `call` replaces state only on success.
      setCart((prev) => {
        if (!prev) return prev;
        const lines = prev.lines.map((l) =>
          l.id === lineId
            ? {
                ...l,
                quantity,
                lineTotal: { ...l.lineTotal, amount: l.unitPrice.amount * quantity },
              }
            : l,
        );
        return {
          ...prev,
          lines,
          totalQuantity: lines.reduce((n, l) => n + l.quantity, 0),
          subtotal: {
            ...prev.subtotal,
            amount: lines.reduce((n, l) => n + l.lineTotal.amount, 0),
          },
        };
      });
      await call({ op: "update", lineId, quantity });
    },
    [call],
  );

  const remove = useCallback(
    async (lineId: string) => {
      setCart((prev) => {
        if (!prev) return prev;
        const lines = prev.lines.filter((l) => l.id !== lineId);
        return {
          ...prev,
          lines,
          totalQuantity: lines.reduce((n, l) => n + l.quantity, 0),
          subtotal: {
            ...prev.subtotal,
            amount: lines.reduce((n, l) => n + l.lineTotal.amount, 0),
          },
        };
      });
      await call({ op: "remove", lineId });
    },
    [call],
  );

  const value = useMemo<CartState>(
    () => ({
      cart,
      isOpen,
      isBusy,
      error,
      lastAddedLineId,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      update,
      remove,
    }),
    [cart, isOpen, isBusy, error, lastAddedLineId, add, update, remove],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
