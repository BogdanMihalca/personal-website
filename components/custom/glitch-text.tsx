"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type GlitchVariant = "neon" | "holo" | "glitch";

interface GlitchTextProps {
  text: string;
  variant?: GlitchVariant;
  className?: string;
  intensity?: "low" | "medium" | "high";
}

export const GlitchText = ({
  text,
  variant = "neon",
  className,
  intensity = "medium",
}: GlitchTextProps) => {
  const [isGlitching, setIsGlitching] = useState(false);

  // Random glitch timing for more realistic effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);

      setTimeout(() => {
        setIsGlitching(false);
      }, 150);
    }, Math.random() * (intensity === "high" ? 2000 : intensity === "medium" ? 4000 : 8000) + 1000);

    return () => clearInterval(glitchInterval);
  }, [intensity]);

  // Generate glitch characters for the effect
  const getGlitchChars = () => {
    const glitchChars = "`¡™£¢∞§¶•ªº–≠åß∂ƒ©˙∆˚¬…æ≈ç√∫˜µ≤≥÷/?░▒▓<>/";
    return text
      .split("")
      .map((char) =>
        char !== " "
          ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
          : " "
      )
      .join("");
  };

  return (
    <span
      className={cn(
        "relative inline-block font-retro tracking-wider",
        {
          "text-neon-cyan": variant === "neon",
          "text-neon-purple": variant === "holo",
          "text-neon-pink": variant === "glitch",
        },
        className
      )}
    >
      {/* Main text */}
      <span className="relative z-10">{text}</span>

      {/* Glitch layers */}
      <motion.span
        className={cn("absolute left-0 top-0 z-20 opacity-0", {
          "text-neon-cyan": variant === "neon",
          "text-neon-purple": variant === "holo",
          "text-neon-pink": variant === "glitch",
        })}
        animate={{
          opacity: isGlitching ? [0, 0.8, 0] : 0,
          x: isGlitching ? [-2, 1, -1, 0] : 0,
          y: isGlitching ? [1, -1, 0] : 0,
        }}
        transition={{ duration: 0.15 }}
        aria-hidden="true"
      >
        {isGlitching ? getGlitchChars() : text}
      </motion.span>

      <motion.span
        className={cn("absolute left-0 top-0 z-30 opacity-0 mix-blend-screen", {
          "text-neon-pink": variant === "neon",
          "text-neon-cyan": variant === "holo",
          "text-neon-yellow": variant === "glitch",
        })}
        animate={{
          opacity: isGlitching ? [0, 0.6, 0] : 0,
          x: isGlitching ? [2, -1, 1, 0] : 0,
          y: isGlitching ? [-1, 1, 0] : 0,
        }}
        transition={{ duration: 0.15, delay: 0.05 }}
        aria-hidden="true"
      >
        {isGlitching ? getGlitchChars() : text}
      </motion.span>
    </span>
  );
};
