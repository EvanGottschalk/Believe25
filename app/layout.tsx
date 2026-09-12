import type { Metadata } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import "./globals.css";

import { TopMenu } from "@/components/layout/TopMenu";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/commerce/CartDrawer";
import { CartProvider } from "@/lib/cart/CartContext";
import { SITE } from "@/config/site";
import { MEDIA } from "@/config/media";

const display = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600"],
});

const body = Jost({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.businessName} — ${SITE.tagline}`,
    template: `%s · ${SITE.businessName}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    siteName: SITE.businessName,
    title: `${SITE.businessName} — ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
    locale: SITE.locale,
    images: [{ url: MEDIA.ogImage.src, width: MEDIA.ogImage.width, height: MEDIA.ogImage.height }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.businessName} — ${SITE.tagline}`,
    description: SITE.description,
    images: [MEDIA.ogImage.src],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.businessName,
    url: SITE.url,
    email: SITE.email,
    description: SITE.description,
    logo: new URL(MEDIA.logo.src, SITE.url).toString(),
    sameAs: SITE.socials.filter((s) => s.url).map((s) => s.url),
  };

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <CartProvider>
          <TopMenu />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
