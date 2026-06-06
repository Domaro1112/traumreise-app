import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";

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
  title: "Traumreise – Deine persönliche KI-Reiseberaterin",
  description:
    "Erzähl uns von dir – unsere KI findet dein perfektes Reiseziel inkl. Hotels, Flügen & Aktivitäten. 100% kostenlos & ohne Anmeldung.",
  keywords: ["Reise", "KI", "Reiseplaner", "Traumreise", "Urlaub", "Reiseberatung"],
  openGraph: {
    title: "Traumreise – Deine persönliche KI-Reiseberaterin",
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
    <html lang="de" className={`${poppins.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
