import { Navbar } from "@/components/custom/navbar";
import type { Metadata } from "next";
import { audiowide } from "./fonts";
import "./globals.css";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EnergyMouseField } from "@/components/custom/energy-mouse-field";
import { AnimatedStars } from "@/components/custom/animated-stars";
import { Terminal } from "@/components/custom/terminal";

export const metadata: Metadata = {
  title: "Bogdan Mihalca",
  description: "Software Engineer, Web Developer, and Content Creator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${audiowide.variable} ${audiowide.className}`}>
      <body>
        <div className="min-h-screen bg-black text-gray-100 relative overflow-x-hidden pt-10 lg:pt-0">
          <div className="fixed inset-0 bg-space-grid opacity-20 z-0" />
          <EnergyMouseField />
          <AnimatedStars />
          <Navbar />
          <ScrollArea>{children}</ScrollArea>
          <Terminal />
        </div>
      </body>
    </html>
  );
}
