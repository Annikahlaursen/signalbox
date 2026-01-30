import "./globals.css";
import Nav from "@/components/Nav";
import { Metadata } from "next";

// Metadata for SEO
export const metadata: Metadata = {
  title: "Next.js Post App",
  description: "A modern post application built with Next.js 16"
};

interface RootLayoutProps {
  children: React.ReactNode;
}

// Root Layout - wraps all pages
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="bg-[#1a1a1a]">
        <Nav />
        {children}
      </body>
    </html>
  );
}
