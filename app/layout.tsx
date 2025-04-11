import { AnimatedStars } from "@/components/custom/animated-stars";
import CookiePolicy from "@/components/custom/cookie-policy";
import { EnergyMouseField } from "@/components/custom/energy-mouse-field";
import { Footer } from "@/components/custom/footer";
import { Navbar } from "@/components/custom/navbar";
import { Terminal } from "@/components/custom/terminal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/sonner";
import { PerformanceProvider } from "@/lib/contexts/performance-mode";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { audiowide } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bogdan Mihalca | Personal Website",
  description:
    "Cyberpunk-themed portfolio showcasing my work and skills in web development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${audiowide.variable} ${audiowide.className}`}>
      <body>
        <SessionProvider>
          <PerformanceProvider>
            <div className="min-h-screen bg-black text-gray-100 relative overflow-x-hidden pt-10 lg:pt-0">
              <div className="fixed inset-0 bg-space-grid opacity-20 z-0" />
              <EnergyMouseField />
              <AnimatedStars />
              <Navbar />
              <ScrollArea>{children}</ScrollArea>
              <Terminal />
              <Footer />
              <CookiePolicy />
            </div>
          </PerformanceProvider>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
