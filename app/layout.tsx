import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site-config";
import JsonLd from "@/components/seo/JsonLd";
import { buildOrganizationJsonLd, buildWebsiteJsonLd } from "@/lib/seo/jsonLd";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "ApeAround – Finde deine Traumreise",
  description:
    "Beantworte ein paar Fragen und entdecke Reiseziele, die zu dir passen – mit Reiseprofil, Kostenüberblick und direkten Links zu Hotels, Flügen & Aktivitäten. Kostenlos & ohne Anmeldung.",
  keywords: ["Reise", "Reisefinder", "Reiseplaner", "Traumreise", "Urlaub", "Reiseinspiration"],
  openGraph: {
    title: "ApeAround – Finde deine Traumreise",
    description: "Persönliche Reiseideen in wenigen Klicks. Kostenlos & sofort verfügbar.",
    type: "website",
  },
  // ── Vorübergehend: Indexierung global deaktiviert ─────────────────────────
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    googleBot: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
      noimageindex: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${poppins.variable} ${inter.variable}`}>
      <body>
        <JsonLd data={[buildOrganizationJsonLd(), buildWebsiteJsonLd()]} />
        {children}
      </body>
    </html>
  );
}
