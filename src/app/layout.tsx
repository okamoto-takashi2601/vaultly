import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { PwaInit } from "@/components/pwa-init";
import { AddToHomeBanner } from "@/components/add-to-home-banner";
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
  title: "Laterloom — Seal today. Open tomorrow.",
  description: "Create time capsules for your future self and loved ones.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Laterloom",
  },
};

export const viewport: Viewport = {
  themeColor: "#1c1d2c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-background text-foreground`}
      >
        <body className="min-h-full flex flex-col">
          <PwaInit />
          {children}
          <AddToHomeBanner />
        </body>
      </html>
    </ClerkProvider>
  );
}
