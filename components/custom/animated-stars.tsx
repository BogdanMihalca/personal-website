"use client";
import { motion } from "framer-motion";
import { useMemo } from "react";

const AnimatedStars = () => {
  const stars = useMemo(() => {
    const clusters = 5;
    const starsPerCluster = 10;
    const allStars = [];

    for (let c = 0; c < clusters; c++) {
      const centerX = Math.random() * 80 + 10; // 10-90% of screen width
      const centerY = Math.random() * 80 + 10; // 10-90% of screen height

      for (let i = 0; i < starsPerCluster; i++) {
        const deviation = Math.random() * 20;
        const angle = Math.random() * Math.PI * 2;

        allStars.push({
          id: c * starsPerCluster + i,
          x: centerX + Math.cos(angle) * deviation,
          y: centerY + Math.sin(angle) * deviation,
          size: Math.random() * 2 + 0.8,
          color: ["#f0f", "#0ff", "#ff0", "#0f0"][
            Math.floor(Math.random() * 4)
          ],
          duration: Math.random() * 3 + 1.5,
          delay: Math.random() * 3,
        });
      }
    }

    for (let i = 0; i < 15; i++) {
      allStars.push({
        id: clusters * starsPerCluster + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.5 + 0.5,
        color: ["#f0f", "#0ff", "#ff0", "#0f0"][Math.floor(Math.random() * 4)],
        duration: Math.random() * 3 + 1.5,
        delay: Math.random() * 3,
      });
    }

    return allStars;
  }, []);

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
            boxShadow: `0 0 ${star.size * 5}px ${star.size}px ${star.color}`,
          }}
          animate={{
            opacity: [0.7, 1, 0.7],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
          }}
        />
      ))}
    </div>
  );
};

export { AnimatedStars };
