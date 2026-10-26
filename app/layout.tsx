import { headers } from "next/headers";
import type { Metadata, Viewport } from "next";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-500.css";
import "@fontsource/manrope/latin-600.css";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { origin, site } from "@/lib/content/site";
import { jsonLd } from "@/lib/seo";
export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: {
    default: "NICE Roofing & Flooring | Terracotta Materials in Kurunegala",
    template: "%s | NICE Roofing & Flooring",
  },
  description:
    "Explore terracotta roofing, floor and wall tiles, ventilation blocks, paving and more at NICE Roofing & Flooring in Kurunegala.",
  robots: { index: process.env.NEXT_PUBLIC_INDEXABLE === "true", follow: true },
  icons: { icon: "/favicon.svg" },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111211",
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nonce = (await headers()).get("x-nonce") || undefined;
  return (
    <html lang="en-LK" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html:
              "try{document.documentElement.dataset.theme=localStorage.getItem('nice-theme')==='light'?'light':'dark'}catch{}",
          }}
        />
      </head>
      <body>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <script
          suppressHydrationWarning
          nonce={nonce}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@type": "HomeAndConstructionBusiness",
              "@id": origin + "/#business",
              name: site.legalName,
              alternateName: [site.name, site.tagline],
              url: origin,
              logo: origin + "/images/brand-logo.webp",
              telephone: site.tel,
              address: {
                "@type": "PostalAddress",
                streetAddress: "Puttalam–Kurunegala Road, Maveedalupotha",
                addressLocality: "Kurunegala",
                addressCountry: "LK",
              },
              sameAs: [site.facebook],
              description:
                "Terracotta roofing, floor and wall tiles, ventilation blocks, paving bricks and stones in Kurunegala.",
            }),
          }}
        />
      </body>
    </html>
  );
}
