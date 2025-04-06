"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePerformanceMode } from "@/lib/contexts/performance-mode";

interface DataStreamProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  position?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "center";
  speed?: "slow" | "medium" | "fast";
  charCount?: number;
  opacity?: number;
}

const DataStream = ({
  className,
  size = "sm",
  position = "bottom-right",
  speed = "medium",
  charCount = 50,
  opacity = 0.3,
}: DataStreamProps) => {
  const { reducedAnimations } = usePerformanceMode();

  // If reducedAnimations is enabled, reduce the character count significantly
  const actualCharCount = reducedAnimations
    ? Math.min(10, charCount)
    : charCount;

  const sizeClasses = {
    sm: "w-24 h-32 text-xs",
    md: "w-32 h-40 text-xs",
    lg: "w-44 h-52 text-sm",
  };

  const positionClasses = {
    "top-left": "top-8 left-8",
    "top-right": "top-8 right-8",
    "bottom-left": "bottom-8 left-8",
    "bottom-right": "bottom-8 right-8",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  };

  const speedDuration = {
    slow: 15,
    medium: 10,
    fast: 5,
  };

  // Slow down animations dramatically in reduced animations mode
  const actualDuration = reducedAnimations
    ? speedDuration[speed] * 3
    : speedDuration[speed];

  const variantClasses = {
    neon: `text-cyan-400/${opacity}`,
  };

  return (
    <div
      className={cn(
        "absolute font-mono overflow-hidden pointer-events-none backdrop-blur-[1px] rounded-sm",
        sizeClasses[size],
        positionClasses[position],
        variantClasses["neon"],
        className
      )}
    >
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-cyber-black to-transparent z-10"></div>

      <motion.div
        animate={reducedAnimations ? {} : { y: [0, -500] }}
        transition={{
          duration: actualDuration,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {Array(actualCharCount)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="whitespace-nowrap">
              {Math.random().toString(16).slice(2, 10).toUpperCase()}
              {Math.random() < 0.5 ? " " : ""}
              {Math.random().toString(16).slice(2, 10).toUpperCase()}
              {Math.random() < 0.5 ? " " : ""}
            </div>
          ))}
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black to-transparent z-10"></div>

      <div className="absolute inset-0 bg-cyan-900/10 mix-blend-overlay pointer-events-none"></div>
    </div>
  );
};

export { DataStream };
