import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import CustomCursor from "@/components/CustomCursor";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollCTA from "@/components/ScrollCTA";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "lud7n",
  description: "Portfolio site of lud7n",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <SmoothScrollProvider>
          <CustomCursor />
          <div className="bg-[#0a0a0a] min-h-screen text-[#f8f8f6] overflow-hidden">
            <Navigation />
            {children}
            <Footer />
            <ScrollCTA />
          </div>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
