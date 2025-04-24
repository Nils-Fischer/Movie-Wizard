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
  metadataBase: new URL("https://moviewizard.me"),
  title: "Movie Wizard",
  description: "AI-curated movie recommendations.",
  openGraph: {
    title: "Movie Wizard",
    description: "AI-curated movie recommendations.",
    images: [
      {
        url: "https://moviewizard.me/icon.webp",
        width: 1200,
        height: 630,
        alt: "Movie Wizard Open Graph Image",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Movie Wizard",
    description: "AI-curated movie recommendations.",
    images: ["https://moviewizard.me/icon.webp"],
  },
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
