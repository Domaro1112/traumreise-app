import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site-config";

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
  title: "Traumreise – Deine persönliche KI-Reiseberaterin",
  description:
    "Erzähl uns von dir – unsere KI findet dein perfektes Reiseziel inkl. Hotels, Flügen & Aktivitäten. 100% kostenlos & ohne Anmeldung.",
  keywords: ["Reise", "KI", "Reiseplaner", "Traumreise", "Urlaub", "Reiseberatung"],
  openGraph: {
    title: "Traumreise – Deine persönliche KI-Reiseberaterin",
    description: "Persönliche Reiseempfehlungen durch KI. Kostenlos & sofort verfügbar.",
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
      <body>{children}</body>
    </html>
  );
}
