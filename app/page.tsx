import { AboutSection } from "@/components/custom/about-section";
import { ContactSection } from "@/components/custom/contact-section";
import { CyberpunkHero } from "@/components/custom/hero-section";
import { ProjectSection } from "@/components/custom/project-section";

const CyberpunkPortfolio = () => {
  return (
    <div className="bg-transparent">
      <CyberpunkHero />
      <AboutSection />
      <ProjectSection />
      <ContactSection />
    </div>
  );
};

export default CyberpunkPortfolio;
