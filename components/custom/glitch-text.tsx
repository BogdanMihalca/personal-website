"use client";
import { FC, ReactNode, useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePerformanceMode } from "@/lib/contexts/performance-mode";

interface GlitchTextProps {
  children: ReactNode;
  color?: "cyan" | "fuchsia" | "red" | "green";
  intensity?: "low" | "medium" | "high";
  className?: string;
}

export const GlitchText: FC<GlitchTextProps> = ({
  children,
  color = "cyan",
  intensity = "medium",
  className = "",
}) => {
  const [glitchActive, setGlitchActive] = useState(false);
  const { reducedAnimations } = usePerformanceMode();

  const getGlitchInterval = useCallback(() => {
    if (reducedAnimations) {
      return 10000;
    }

    switch (intensity) {
      case "low":
        return 3000;
      case "high":
        return 1000;
      default:
        return 2000;
    }
  }, [intensity, reducedAnimations]);

  useEffect(() => {
    if (reducedAnimations) {
      const glitchInterval = setInterval(() => {
        if (Math.random() > 0.7) {
          setGlitchActive(true);
          setTimeout(() => setGlitchActive(false), 100);
        }
      }, getGlitchInterval());

      return () => clearInterval(glitchInterval);
    }

    const glitchInterval = setInterval(() => {
      const randomNum = Math.random();
      if (randomNum > 0.6) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 100 + Math.random() * 200);
      }
    }, getGlitchInterval());

    return () => clearInterval(glitchInterval);
  }, [getGlitchInterval, intensity, reducedAnimations]);

  const getColorClasses = () => {
    switch (color) {
      case "fuchsia":
        return "text-fuchsia-400";
      case "red":
        return "text-red-400";
      case "green":
        return "text-green-400";
      default:
        return "text-cyan-400";
    }
  };

  return (
    <motion.span
      className={`relative inline-block ${getColorClasses()} ${className} ${
        glitchActive && !reducedAnimations ? "cyber-glitch" : ""
      }`}
      animate={
        glitchActive && !reducedAnimations
          ? {
              x: [0, -1, 2, 0, 1, 0],
              opacity: [1, 0.85, 1, 0.9, 1],
            }
          : {}
      }
      transition={{ duration: 0.2 }}
    >
      {children}

      {glitchActive && !reducedAnimations && (
        <>
          <motion.span
            className={`absolute top-0 left-0 ${getColorClasses()} opacity-70 mix-blend-screen`}
            style={{ textShadow: "2px 0 #f0f, -2px 0 #0ff" }}
            animate={{ x: [0, 1.5, -1, 0.5, 0] }}
            transition={{ duration: 0.15 }}
          >
            {children}
          </motion.span>
          <motion.span
            className="absolute top-0 left-0 text-black opacity-10 mix-blend-overlay"
            animate={{ x: [0, -1, 2, -1, 0], y: [0, 1, -1, 0.5, 0] }}
            transition={{ duration: 0.15, delay: 0.05 }}
          >
            {children}
          </motion.span>
        </>
      )}
    </motion.span>
  );
};
