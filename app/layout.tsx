import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/shared/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "席マネ",
  description: "席配置図作成から、実際に席決めまで。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen text-gray-900 antialiased">
        <div className="flex min-h-screen flex-col">
          <Header/>
          <div className="flex-1 bg-sky-100 p-2 text-black">
            <div className="mx-auto w-full h-full max-w-6xl space-y-8 p-6">
              {children}
            </div>
          </div>

          <footer className="border-t border-gray-200 bg-white">
            <div className="mx-auto w-full max-w-7xl px-6 py-3 text-sm text-gray-500">
              Seat Manager
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}