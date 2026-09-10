import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Site Scout — Local CMS & Tech Stack Lead Finder",
  description: "Find local business websites built with Wix, Squarespace, WordPress, and Shopify by location & niche.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full dark antialiased`}>
      <body className="min-h-full flex flex-col antialiased bg-black text-white selection:bg-white selection:text-black">
        {children}
      </body>
    </html>
  );
}
