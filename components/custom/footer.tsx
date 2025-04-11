"use client";

import { motion, useInView } from "framer-motion";
import { Code, Github, Heart, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { CyberBadge } from "./cyber-badge";
import { DecoDivider } from "./deco-divider";
import { GlitchText } from "./glitch-text";
import { HologramContainer } from "./hologram-container";

const socialLinks = [
  {
    name: "GitHub",
    icon: <Github className="w-5 h-5" />,
    url: "https://github.com/BogdanMihalca",
    color: "green-300",
  },
  {
    name: "LinkedIn",
    icon: <Linkedin className="w-5 h-5" />,
    url: "https://www.linkedin.com/in/bogdan-mihalca-76b2b7b3/",
    color: "neon-cyan",
  },
  {
    name: "Instagram",
    icon: <Instagram className="w-5 h-5" />,
    url: "https://www.instagram.com/mihalcabogdan/",
    color: "neon-pink",
  },
];

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: false, margin: "-100px" });

  return (
    <footer
      ref={footerRef}
      className="relative py-16 bg-space-black/70 overflow-hidden border-t border-neon-cyan/20"
    >
      <div className="absolute inset-0 opacity-5">
        <div className="absolute h-px w-full top-1/3 bg-linear-to-r from-transparent via-fuchsia-600 to-transparent animate-pulse" />
        <div
          className="absolute h-px w-full top-2/3 bg-linear-to-r from-transparent via-cyan-500 to-transparent animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute w-px h-full left-1/3 bg-linear-to-b from-transparent via-lime-500 to-transparent animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute w-px h-full right-1/3 bg-linear-to-b from-transparent via-fuchsia-500 to-transparent animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8"
        >
          <div className="space-y-4">
            <h3 className="text-neon-cyan font-bold text-xl mb-4 flex items-center">
              <span className="text-neon-pink mr-2">[</span>
              <GlitchText color="cyan" intensity="low">
                BOGDAN_MIHALCA
              </GlitchText>
              <span className="text-neon-pink ml-2">]</span>
            </h3>

            <p className="text-gray-300 text-sm">
              Creating digital experiences that inspire and engage.
              <span className="block mt-2 text-neon-blue/80">
                Software engineer // Explorer // Creative
              </span>
            </p>

            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{
                    y: -3,
                    boxShadow: `0 10px 15px -3px rgba(0, 255, 255, 0.2)`,
                  }}
                  className={`flex justify-center items-center p-2 bg-black/30 rounded-sm border border-transparent 
                             hover:border-cyan-500/30 transition-all duration-300`}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-neon-pink font-mono text-sm mb-4">
              NAV_LINKS://
            </h3>
            <ul className="space-y-2 text-sm">
              {["home", "about", "projects", "contact"].map((section) => (
                <li key={section}>
                  <Link
                    href={`/#${section}`}
                    className="text-gray-400 hover:text-neon-cyan transition-colors duration-300 flex items-center"
                  >
                    <motion.span
                      className="text-neon-cyan mr-2 opacity-80"
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      &gt;
                    </motion.span>
                    {section.toUpperCase()}
                  </Link>
                </li>
              ))}
              <li key={"blog"}>
                <Link
                  href={`/blog`}
                  className="text-gray-400 hover:text-neon-cyan transition-colors duration-300 flex items-center"
                >
                  <motion.span
                    className="text-neon-cyan mr-2 opacity-80"
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    &gt;
                  </motion.span>
                  BLOG
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-neon-pink font-mono text-sm mb-4">
              TECH_STACK://
            </h3>
            <div className="flex flex-wrap gap-2">
              {["React", "Next.js", "TypeScript", "TailwindCSS"].map(
                (tech, i) => (
                  <CyberBadge
                    key={tech}
                    variant={
                      ["default", "neon", "holo", "circuit" as const][
                        i % 4
                      ] as any //eslint-disable-line @typescript-eslint/no-explicit-any
                    }
                    delay={i}
                    className="text-xs py-0 px-1.5"
                  >
                    {tech}
                  </CyberBadge>
                )
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-neon-pink font-mono text-sm mb-4">
              SYS_CONTACT://
            </h3>
            <HologramContainer variant="neon" className="p-3 rounded-sm">
              <motion.a
                href="mailto:contact@bogdanmihalca.com"
                className="flex items-center space-x-3 text-sm text-neon-cyan hover:text-neon-pink transition-colors duration-300"
                whileHover={{ x: 5 }}
              >
                <span className="inline-block w-4 h-4 bg-neon-cyan/20 rounded-full"></span>
                <span>contact@bogdanmihalca.com</span>
              </motion.a>
            </HologramContainer>
          </div>
        </motion.div>

        <DecoDivider variant="holo" size="sm" className="my-6" />

        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-neon-cyan mr-2">NETRUNNER//</span>
            <span>
              © {new Date().getFullYear()} Bogdan Mihalca. All rights reserved.
            </span>
          </div>

          <motion.div
            className="flex items-center"
            animate={{
              textShadow: [
                "0 0 5px rgba(0,255,255,0)",
                "0 0 5px rgba(0,255,255,0.3)",
                "0 0 5px rgba(0,255,255,0)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="mr-1">Made with</span>
            <Heart className="h-3 w-3 text-neon-pink mx-1" />
            <span className="mr-1">and</span>
            <Code className="h-3 w-3 text-neon-cyan mx-1" />
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
