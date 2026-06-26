import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavbarWrapper } from "@/components/NavbarWrapper";
import { Footer } from "@/components/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GraDrop - AI Wardrobe & Outfit Suggestions",
  description: "Organize your wardrobe and get AI-powered outfit suggestions with GraDrop",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-stone-50">
        <LanguageProvider>
          <NavbarWrapper />
          {children}

          {/* Premium Footer */}
          <footer className="bg-white border-t border-zinc-100 py-8 px-6 mt-12">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-[10px]">G</div>
                <span className="font-medium text-stone-700">GraDrop © 2026</span>
              </div>
              <Footer />
            </div>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
