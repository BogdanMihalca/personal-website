"use client";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { usePerformanceMode } from "@/lib/contexts/performance-mode";

const AnimatedStars = () => {
  const { reducedAnimations } = usePerformanceMode();

  const stars = useMemo(() => {
    // Reduce star count and effects in performance mode
    const clusters = reducedAnimations ? 3 : 7;
    const starsPerCluster = reducedAnimations ? 8 : 15;
    const allStars = [];

    for (let c = 0; c < clusters; c++) {
      const centerX = Math.random() * 80 + 10; // 10-90% of screen width
      const centerY = Math.random() * 80 + 10; // 10-90% of screen height
      const orbitRadius = Math.random() * (reducedAnimations ? 5 : 10) + 5; // Smaller orbits in performance mode

      for (let i = 0; i < starsPerCluster; i++) {
        const deviation = Math.random() * (reducedAnimations ? 10 : 20);
        const angle = Math.random() * Math.PI * 2;
        const orbitSpeed = Math.random() * 10 + (reducedAnimations ? 20 : 10); // Slower animation in performance mode

        allStars.push({
          id: c * starsPerCluster + i,
          x: centerX + Math.cos(angle) * deviation,
          y: centerY + Math.sin(angle) * deviation,
          size: Math.random() * (reducedAnimations ? 1.5 : 2) + 0.8,
          color: ["#f0f", "#0ff", "#ff0", "#0f0"][
            Math.floor(Math.random() * 4)
          ],
          duration: Math.random() * 3 + (reducedAnimations ? 3 : 1.5), // Slower pulses in performance mode
          delay: Math.random() * 3,
          centerX,
          centerY,
          orbitRadius,
          orbitSpeed,
          initialAngle: angle,
        });
      }
    }

    const extraStars = reducedAnimations ? 7 : 15;
    for (let i = 0; i < extraStars; i++) {
      allStars.push({
        id: clusters * starsPerCluster + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.5 + 0.5,
        color: ["#f0f", "#0ff", "#ff0", "#0f0"][Math.floor(Math.random() * 4)],
        duration: Math.random() * 3 + (reducedAnimations ? 4 : 1.5),
        delay: Math.random() * 3,
        orbitRadius: Math.random() * (reducedAnimations ? 1 : 3) + 1,
        orbitSpeed: Math.random() * 15 + (reducedAnimations ? 30 : 20),
        centerX: Math.random() * 100,
        centerY: Math.random() * 100,
        initialAngle: Math.random() * Math.PI * 2,
      });
    }

    return allStars;
  }, [reducedAnimations]);

  return (
    <div className="absolute inset-0 z-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: `radial-gradient(circle, ${star.color} 0%, rgba(0,0,0,0) 70%)`,
            left: `${star.x}%`,
            top: `${star.y}%`,
            boxShadow: reducedAnimations
              ? `0 0 ${star.size * 2}px ${star.size * 0.5}px ${star.color}`
              : `0 0 ${star.size * 5}px ${star.size}px ${star.color}`,
          }}
          animate={{
            opacity: [0.7, 1, 0.7],
            scale: reducedAnimations ? [1, 1.2, 1] : [1, 1.5, 1],
            x: [
              0,
              star.orbitRadius * Math.cos(star.initialAngle),
              0,
              -star.orbitRadius * Math.cos(star.initialAngle),
              0,
            ],
            y: [
              0,
              star.orbitRadius * Math.sin(star.initialAngle),
              0,
              -star.orbitRadius * Math.sin(star.initialAngle),
              0,
            ],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            x: {
              duration: star.orbitSpeed,
              repeat: Infinity,
              ease: "linear",
            },
            y: {
              duration: star.orbitSpeed,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        />
      ))}
    </div>
  );
};

export { AnimatedStars };
