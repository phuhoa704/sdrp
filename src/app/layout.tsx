import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { StockProvider } from "@/components/providers/StockProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Next.js CMS Platform",
  description: "Enterprise-grade Content Management System built with Next.js 15 and Tailwind CSS",
  keywords: ["CMS", "Next.js", "Content Management", "Tailwind CSS"],
  authors: [{ name: "TekNix" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable}`}>
      <body className="min-h-screen font-sans">
        <ReduxProvider>
          <AuthProvider>
            <StockProvider>
              {children}
              <div id="modal-root" />
            </StockProvider>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
