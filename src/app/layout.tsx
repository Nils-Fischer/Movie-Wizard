import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Geist, Righteous } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const righteous = Righteous({
  variable: "--font-righteous",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Movie Wizard",
  description: "Find the perfect movie for you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://m.media-amazon.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://m.media-amazon.com" />
      </head>
      <body className={cn("bg-background min-h-screen font-sans antialiased", geistSans.variable, righteous.variable)}>
        <SpeedInsights />
        <Analytics />
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </body>
    </html>
  );
}
