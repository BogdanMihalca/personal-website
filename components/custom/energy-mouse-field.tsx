"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePerformanceMode } from "@/lib/contexts/performance-mode";

const EnergyMouseField = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { reducedAnimations } = usePerformanceMode();

  useEffect(() => {
    if (reducedAnimations) return;

    const onMouseMove = (event: MouseEvent) => {
      const rect = document.body.getBoundingClientRect();
      const newX = event.clientX - rect.left;
      const newY = event.clientY - rect.top;

      const threshold = 5;

      if (
        Math.abs(newX - mousePosition.x) > threshold ||
        Math.abs(newY - mousePosition.y) > threshold
      ) {
        setMousePosition({ x: newX, y: newY });
      }
    };

    document.body.addEventListener("mousemove", onMouseMove);
    return () => {
      document.body.removeEventListener("mousemove", onMouseMove);
    };
  }, [mousePosition.x, mousePosition.y, reducedAnimations]);

  if (reducedAnimations) return null;

  return (
    <motion.div
      className="absolute w-40 h-40 rounded-full pointer-events-none z-0"
      style={{
        background:
          "radial-gradient(circle, rgba(0,255,255,0.3) 0%, rgba(255,0,255,0.1) 50%, rgba(0,0,0,0) 70%)",
        boxShadow:
          "0 0 40px 5px rgba(0,255,255,0.4), inset 0 0 20px rgba(255,0,255,0.4)",
        left: mousePosition.x - 80,
        top: mousePosition.y - 80,
      }}
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.6, 0.8, 0.6],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
      }}
    />
  );
};

export { EnergyMouseField };
