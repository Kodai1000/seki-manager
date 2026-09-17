import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Header from "@/components/shared/Header";
import { getSiteUrl, siteDescription, siteName } from "@/lib/site";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const siteUrl = getSiteUrl();
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: siteName,
  description: siteDescription,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  inLanguage: "ja",
  isAccessibleForFree: true,
  ...(siteUrl && { url: siteUrl.toString() }),
};

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  applicationName: siteName,
  title: { default: `${siteName} | 席替え・座席表作成ツール`, template: `%s | ${siteName}` },
  description: siteDescription,
  keywords: ["席替え", "座席表", "座席表作成", "座席配置", "席順", "学校", "イベント"],
  authors: [{ name: siteName }],
  creator: siteName,
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName,
    title: `${siteName} | 席替え・座席表作成ツール`,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | 席替え・座席表作成ツール`,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-screen text-gray-900 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
        <div className="flex min-h-screen flex-col">
          <Header />
          <div className="flex-1 bg-sky-100 p-2 text-black">
            <div className="mx-auto h-full w-full max-w-6xl space-y-8 p-6">{children}</div>
          </div>
          <footer className="border-t border-gray-200 bg-white">
            <div className="mx-auto w-full max-w-7xl px-6 py-3 text-sm text-gray-500">
              <Link href="/privacy" target="_blank">プライバシーポリシー</Link>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
