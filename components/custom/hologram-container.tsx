"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePerformanceMode } from "@/lib/contexts/performance-mode";

type HologramVariant = "neon" | "holo" | "glitch";

interface HologramContainerProps {
  children: React.ReactNode;
  variant?: HologramVariant;
  className?: string;
  intensity?: "low" | "medium" | "high";
  interactive?: boolean;
}

export const HologramContainer = ({
  children,
  variant = "neon",
  className,
  intensity = "medium",
  interactive = true,
}: HologramContainerProps) => {
  const { reducedAnimations } = usePerformanceMode();
  const [isHovering, setIsHovering] = useState(false);
  const [glitchTiming, setGlitchTiming] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const effectiveIntensity = reducedAnimations ? "low" : intensity;

  const effectiveInteractive = reducedAnimations ? false : interactive;

  useEffect(() => {
    const intervalTime =
      effectiveIntensity === "high"
        ? 2000 + Math.random() * 2000
        : effectiveIntensity === "medium"
        ? 4000 + Math.random() * 3000
        : 8000 + Math.random() * 4000;

    const interval = setInterval(() => {
      setGlitchTiming((prev) => prev + 1);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [effectiveIntensity]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!effectiveInteractive) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setMousePosition({ x, y });
  };

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-md",
        "backdrop-blur-xs transition-all duration-300",
        {
          "border border-neon-cyan/30": variant === "neon",
          "border border-neon-purple/30": variant === "holo",
          "border border-neon-pink/30": variant === "glitch",
        },
        className
      )}
      onMouseEnter={() => effectiveInteractive && setIsHovering(true)}
      onMouseLeave={() => effectiveInteractive && setIsHovering(false)}
      onMouseMove={handleMouseMove}
      animate={{
        boxShadow:
          isHovering && !reducedAnimations
            ? variant === "neon"
              ? "0 0 15px 2px rgba(15, 239, 253, 0.3)"
              : variant === "holo"
              ? "0 0 15px 2px rgba(176, 38, 255, 0.3)"
              : "0 0 15px 2px rgba(255, 45, 108, 0.3)"
            : "0 0 0px 0px rgba(0, 0, 0, 0)",
      }}
    >
      {!reducedAnimations && (
        <div
          className="absolute inset-0 pointer-events-none bg-scanline opacity-10 z-10"
          aria-hidden="true"
        />
      )}

      <div
        className={cn("absolute inset-0 opacity-20 z-0", {
          "bg-gradient-radial from-neon-cyan/20 to-transparent":
            variant === "neon",
          "bg-gradient-radial from-neon-purple/20 to-transparent":
            variant === "holo",
          "bg-gradient-radial from-neon-pink/20 to-transparent":
            variant === "glitch",
        })}
        style={{
          transform: effectiveInteractive
            ? `translate(${
                (mousePosition.x - 0.5) * (reducedAnimations ? 5 : 10)
              }px, ${(mousePosition.y - 0.5) * (reducedAnimations ? 5 : 10)}px)`
            : "none",
        }}
      />

      {!reducedAnimations && (
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none mix-blend-screen"
          animate={{
            opacity: [0, 0.05, 0],
            x: [-2, 1, 0],
            y: [1, -1, 0],
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
            repeat: 1,
            repeatType: "reverse",
            repeatDelay: 0.1,
          }}
          key={glitchTiming}
        >
          <div
            className={cn("w-full h-full", {
              "bg-neon-cyan": variant === "neon",
              "bg-neon-purple": variant === "holo",
              "bg-neon-pink": variant === "glitch",
            })}
          />
        </motion.div>
      )}

      <motion.div
        className="relative z-10"
        style={{
          transform:
            effectiveInteractive && isHovering
              ? `translate(${
                  (mousePosition.x - 0.5) * (reducedAnimations ? -2 : -5)
                }px, ${
                  (mousePosition.y - 0.5) * (reducedAnimations ? -2 : -5)
                }px)`
              : "none",
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};
