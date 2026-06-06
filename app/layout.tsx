import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Traumreise – Deine KI-Reiseberaterin",
  description:
    "Erzähl uns von dir – unsere KI findet dein perfektes Reiseziel inkl. Hotels, Flügen & Aktivitäten. 100% kostenlos.",
  keywords: ["Reise", "KI", "Reiseplaner", "Traumreise", "Urlaub", "Reiseberatung"],
  openGraph: {
    title: "Traumreise – Deine KI-Reiseberaterin",
    description: "Persönliche Reiseempfehlungen durch KI. Kostenlos & sofort.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${playfair.variable} ${lato.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
