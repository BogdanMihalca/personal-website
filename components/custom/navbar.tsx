"use client";
import { useCallback, useEffect, useState } from "react";
import { CyberpunkLogo } from "./cyber-logo/cyber-logo";
import { orbitron } from "@/app/fonts";
import { useHash } from "@/lib/hooks/useHash";
import { scrollToSection } from "@/lib/utils";
import { usePerformanceMode } from "@/lib/contexts/performance-mode";
import { Battery, BatteryCharging } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const hash = useHash();
  const { reducedAnimations, togglePerformanceMode } = usePerformanceMode();

  const handleScroll = useCallback(() => {
    if (window.scrollY > 10) {
      !scrolled && setScrolled(true); // eslint-disable-line @typescript-eslint/no-unused-expressions
    } else {
      scrolled && setScrolled(false); // eslint-disable-line @typescript-eslint/no-unused-expressions
    }
  }, [scrolled]);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // based on hash change, set the active section
  useEffect(() => {
    const section = hash.replace("#", "");
    if (section) {
      scrollToSection(section);
      setActiveSection(section);
    }
  }, [hash]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black bg-opacity-80 backdrop-blur-md shadow-lg shadow-cyan-500/10"
          : ""
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center relative">
          <div className="flex items-center">
            <CyberpunkLogo
              name="Bogdan Mihalca"
              className={orbitron.className}
            />
          </div>

          <div className="hidden md:flex space-x-8 mr-12">
            {["home", "about", "projects", "contact"].map((section) => (
              <a
                key={section}
                href={`#${section}`}
                className={`nav-link uppercase text-sm tracking-wider hover:text-cyan-400 transition-colors duration-300 ${
                  activeSection === section
                    ? "text-cyan-400 font-medium"
                    : "text-gray-300"
                }`}
              >
                {section}
              </a>
            ))}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-cyan-400 focus:outline-hidden"
              role="button"
              aria-label="Toggle Menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span
                  className={`h-0.5 w-full bg-current transform transition-all duration-300 ${
                    menuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                ></span>
                <span
                  className={`h-0.5 w-full bg-current transition-all duration-300 ${
                    menuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`h-0.5 w-full bg-current transform transition-all duration-300 ${
                    menuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                ></span>
              </div>
            </button>
          </div>

          <button
            onClick={togglePerformanceMode}
            className={`fixed z-50  right-4 p-2 rounded-full transition-all duration-300 cursor-pointer hidden md:block ${
              reducedAnimations
                ? "bg-gray-800 text-green-400"
                : "bg-black/50 text-cyan-400"
            }`}
            title={
              reducedAnimations
                ? "Enable full animations"
                : "Enable power saving mode"
            }
          >
            {reducedAnimations ? (
              <BatteryCharging size={20} className="animate-pulse" />
            ) : (
              <Battery size={20} />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-black bg-opacity-70 backdrop-blur-md border-t border-cyan-500/30 shadow-lg shadow-cyan-500/20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              {["home", "about", "projects", "contact"].map((section) => (
                <a
                  key={section}
                  href={`#${section}`}
                  onClick={() => setMenuOpen(false)}
                  className={`uppercase text-sm tracking-wider transition-colors duration-300 py-2 ${
                    activeSection === section
                      ? "text-cyan-400 font-medium border-l-2 border-cyan-400 pl-3"
                      : "text-gray-300 hover:text-cyan-400 hover:border-l-2 hover:border-cyan-400/50 hover:pl-3"
                  }`}
                >
                  {section}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export { Navbar };
