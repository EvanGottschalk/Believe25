import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { PRIVACY } from "@/config/legal";

export const metadata: Metadata = {
  title: PRIVACY.title,
  description: PRIVACY.intro,
  alternates: { canonical: "/privacy" },
};

export default function Page() {
  return <LegalPage page={PRIVACY} />;
}
