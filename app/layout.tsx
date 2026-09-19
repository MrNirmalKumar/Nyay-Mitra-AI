import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LangProvider } from "@/lib/LangContext";
import { Suspense } from "react";
import { PageLoader } from "@/components/ui/PageLoader";
import { AuthProvider } from "@/lib/AuthContext";
import AuthModal from "@/components/auth/AuthModal";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '600', '700', '900'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: "Nyay Mitra AI — Understand Your Rights. Take the Right Step.",
  description:
    "AI-powered legal assistance designed for Indian citizens. Understand your rights in simple language, get actionable guidance, analyze legal documents, and generate professional legal demand notices.",
  keywords: [
    "Nyay Mitra AI",
    "Legal AI India",
    "Indian Law Assistant",
    "Legal Notice Generator",
    "Tenant Rights India",
    "Consumer Protection Act",
    "Employee Rights India",
    "Free Legal Guidance",
  ],
  authors: [{ name: "Nyay Mitra AI Team" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect for Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable}`}
        style={{
          fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif",
          backgroundColor: "#F7F6F2",
          color: "#1A1A1A",
        }}
      >
        <AuthProvider>
          <LangProvider>
          <Suspense fallback={null}>
            <PageLoader />
          </Suspense>
          <Navbar />
          <main className="flex-1 w-full flex flex-col">{children}</main>
          <Footer />
        </LangProvider>
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
