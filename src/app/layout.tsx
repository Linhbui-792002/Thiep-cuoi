import type { Metadata, Viewport } from "next";
import { Allura, Charm, Playfair_Display, Cormorant_Garamond, Be_Vietnam_Pro } from "next/font/google";
import { getCachedSiteConfig } from "@/lib/data";
import { DEFAULT_THEME } from "@/lib/theme";
import { coupleTitle, getSiteUrl, invitationDescription } from "@/lib/seo";
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

export const viewport: Viewport = {
  themeColor: DEFAULT_THEME.primary,
};

export async function generateMetadata(): Promise<Metadata> {
  const config = await getCachedSiteConfig();
  const names = coupleTitle(config);
  const description = invitationDescription(config);
  const site = getSiteUrl();

  return {
    metadataBase: new URL(site),
    title: {
      default: `${names} | Thiệp cưới`,
      template: `%s | ${names}`,
    },
    description,
    applicationName: "Thiệp cưới",
    authors: [{ name: names }],
    openGraph: {
      type: "website",
      locale: "vi_VN",
      url: "/",
      siteName: names,
      title: `${names} | Thiệp cưới`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${names} | Thiệp cưới`,
      description,
    },
    alternates: { canonical: "/" },
  };
}

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
