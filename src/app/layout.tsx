import type { Metadata } from "next";
import { Allura, Charm, Playfair_Display, Cormorant_Garamond, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const allura = Allura({
  variable: "--font-allura",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const charm = Charm({
  variable: "--font-charm",
  subsets: ["latin", "vietnamese"],
  weight: "400",
  display: "swap",
  preload: false,
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Thiệp Cưới",
  description: "Thiệp cưới điện tử",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${allura.variable} ${charm.variable} ${playfair.variable} ${cormorant.variable} ${beVietnam.variable} h-full`}
    >
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
