import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { TERMS } from "@/config/legal";

export const metadata: Metadata = {
  title: TERMS.title,
  description: TERMS.intro,
  alternates: { canonical: "/terms" },
};

export default function Page() {
  return <LegalPage page={TERMS} />;
}
