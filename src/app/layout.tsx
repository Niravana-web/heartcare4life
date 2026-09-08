import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CallBar from "@/components/CallBar";
import SmoothScroll from "@/components/SmoothScroll";
import JsonLd from "@/components/JsonLd";
import { SITE, LOCATIONS } from "@/lib/site";
import { graph, organizationLd, physicianLd, websiteLd, locationLd } from "@/lib/seo";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-cormorant", display: "swap" });
const sourceSans = Source_Sans_3({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-source-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} | Dr. Vimal Nanavati | Interventional Cardiologist Bonita, San Diego & Redding, CA`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: "Dr. Vimal Nanavati", url: SITE.url + "/dr-vimal-nanavati" }],
  creator: "Dr. Vimal Nanavati",
  publisher: SITE.name,
  formatDetection: { telephone: true },
  icons: { icon: "/favicon.svg" },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4eee0" },
    { media: "(prefers-color-scheme: dark)", color: "#152030" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${sourceSans.variable}`}>
      <body className="flex min-h-screen flex-col pb-[52px] lg:pb-0">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-QGBG8R4KY7" strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-QGBG8R4KY7');`}</Script>
        <SmoothScroll />
        <JsonLd data={graph(organizationLd(), physicianLd(), websiteLd(), ...LOCATIONS.map(locationLd))} />
        <Header />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
        <CallBar />
      </body>
    </html>
  );
}
