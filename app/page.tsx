import { AboutSection } from "@/components/custom/about-section";
import { ContactSection } from "@/components/custom/contact-section";
import CyberpunkWeather from "@/components/custom/cyberpunk-weather";
import { CyberpunkHero } from "@/components/custom/hero-section";
import { MoonPhase } from "@/components/custom/moon-phase";
import { ProjectSection } from "@/components/custom/project-section";
import { SideDisplay } from "@/components/custom/side-display";
import { Moon, SunMoon } from "lucide-react";

const CyberpunkPortfolio = () => {
  return (
    <div className="bg-transparent">
      <CyberpunkHero />
      <AboutSection />
      <ProjectSection />
      <ContactSection />
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
  );
};

export default CyberpunkPortfolio;
