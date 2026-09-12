import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { SHIPPING_RETURNS } from "@/config/legal";

export const metadata: Metadata = {
  title: SHIPPING_RETURNS.title,
  description: SHIPPING_RETURNS.intro,
  alternates: { canonical: "/shipping-returns" },
};

export default function Page() {
  return <LegalPage page={SHIPPING_RETURNS} />;
}
