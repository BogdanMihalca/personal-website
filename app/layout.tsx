import { AnimatedStars } from "@/components/custom/animated-stars";
import CyberpunkWeather from "@/components/custom/cyberpunk-weather";
import { EnergyMouseField } from "@/components/custom/energy-mouse-field";
import { Navbar } from "@/components/custom/navbar";
import { SideDisplay } from "@/components/custom/side-display";
import { Terminal } from "@/components/custom/terminal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Moon, SunMoon } from "lucide-react";
import type { Metadata } from "next";
import { audiowide } from "./fonts";
import "./globals.css";
import { MoonPhase } from "@/components/custom/moon-phase";

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
          <SideDisplay
            icon={<SunMoon width={30} height={30} />}
            title="WEATHER CONTROL"
            theme="cyber"
            position="right"
            verticalPosition="top"
            verticalOffset={100}
            collapsedSize={40}
            width={420}
          >
            <CyberpunkWeather />
          </SideDisplay>
          <SideDisplay
            icon={<Moon width={30} height={30} />}
            title="MOON CONTROL"
            theme="cyber"
            position="right"
            verticalPosition="top"
            verticalOffset={150}
            collapsedSize={40}
            width={420}
          >
            <MoonPhase />
          </SideDisplay>
        </div>
      </body>
    </html>
  );
}
