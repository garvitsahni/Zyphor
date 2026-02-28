import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/ClientProviders";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Zyphra — AI Project Lifecycle Teammate",
  description: "From idea to startup. Zyphra helps teams build, ship, and pitch hackathon projects with AI-powered collaboration.",
  keywords: ["hackathon", "AI", "project management", "startup", "collaboration"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <div className="animated-bg" />
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
