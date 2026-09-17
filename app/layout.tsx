import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: '--font-space-grotesk' });

export const metadata: Metadata = {
  title: "Nyay Mitra AI - Understand Your Rights. Take the Right Step.",
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Anti-flash script: runs before paint to apply saved theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('nyay-theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans bg-white dark:bg-navy-950 text-slate-800 dark:text-slate-100 min-h-screen flex flex-col selection:bg-gold-500 selection:text-navy-950`}>
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 w-full flex flex-col">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
