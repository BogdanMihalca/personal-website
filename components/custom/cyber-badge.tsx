"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CyberBadgeProps {
  children?: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: "default" | "neon" | "glitch" | "holo" | "circuit";
}

const CyberBadge = ({
  className = "",
  delay = 0,
  children = null,
  variant = "default",
}: CyberBadgeProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "neon":
        return "text-neon-pink border-neon-pink/40 from-neon-pink/10 to-neon-blue/5 hover:shadow-neon-pink/30";
      case "glitch":
        return "text-neon-purple border-neon-purple/40 from-neon-purple/10 to-black/20 hover:shadow-neon-purple/30";
      case "holo":
        return "text-white border-white/30 bg-gradient-to-br from-neon-cyan/20 via-neon-purple/10 to-neon-pink/20 hover:shadow-white/20 backdrop-blur-sm";
      case "circuit":
        return "text-neon-green border-neon-green/40 from-neon-green/10 to-black/30 hover:shadow-neon-green/30";
      default:
        return "text-neon-cyan border-neon-cyan/30 from-neon-blue/10 to-neon-cyan/5 hover:shadow-neon-cyan/30";
    }
  };

  const getBorderColor = () => {
    switch (variant) {
      case "neon":
        return "border-neon-pink/50";
      case "glitch":
        return "border-neon-purple/50";
      case "holo":
        return "border-white/50";
      case "circuit":
        return "border-neon-green/50";
      default:
        return "border-neon-cyan/50";
    }
  };

  const getGlowColor = () => {
    switch (variant) {
      case "neon":
        return "rgba(255, 0, 255, 0.5)";
      case "glitch":
        return "rgba(128, 0, 255, 0.5)";
      case "holo":
        return "rgba(255, 255, 255, 0.5)";
      case "circuit":
        return "rgba(57, 255, 20, 0.5)";
      default:
        return "rgba(0, 255, 255, 0.5)";
    }
  };

  const getLineColor = () => {
    switch (variant) {
      case "neon":
        return "from-transparent via-neon-pink to-transparent";
      case "glitch":
        return "from-transparent via-neon-purple to-transparent";
      case "holo":
        return "from-neon-cyan via-white to-neon-pink";
      case "circuit":
        return "from-transparent via-neon-green to-transparent";
      default:
        return "from-transparent via-neon-cyan to-transparent";
    }
  };

  const getHoverBgColor = () => {
    switch (variant) {
      case "neon":
        return "group-hover/tag:bg-neon-pink/10";
      case "glitch":
        return "group-hover/tag:bg-neon-purple/10";
      case "holo":
        return "group-hover/tag:bg-white/10";
      case "circuit":
        return "group-hover/tag:bg-neon-green/10";
      default:
        return "group-hover/tag:bg-neon-cyan/10";
    }
  };

  const badgeId = `cyber-badge-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.2,
        delay: 0.05 * delay,
      }}
      whileHover={{
        scale: 1.05,
        boxShadow: `0 0 8px ${getGlowColor()}`,
      }}
      className={cn(
        "relative inline-block text-[10px] px-2 py-0.5 border rounded-sm bg-gradient-to-r overflow-hidden group/tag",
        getVariantStyles(),
        className
      )}
      onMouseEnter={() => {
        const element = document.getElementById(badgeId);
        if (element) {
          element.classList.add("animate");
        }
      }}
      onMouseLeave={() => {
        const element = document.getElementById(badgeId);
        if (element) {
          element.classList.remove("animate");
        }
      }}
      id={badgeId}
    >
      <span className="relative z-10">{children}</span>

      <motion.div
        className={`absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r ${getLineColor()}`}
        animate={{
          x: ["-100%", "100%"],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 2 + delay * 0.5,
        }}
      />

      {variant === "circuit" && (
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/2 left-0 w-1 h-[1px] bg-neon-green" />
          <div className="absolute top-1/2 right-0 w-1 h-[1px] bg-neon-green" />
          <div className="absolute top-0 left-1/4 w-[1px] h-1 bg-neon-green" />
        </div>
      )}

      {variant === "glitch" && (
        <motion.div
          className="absolute inset-0 bg-neon-purple/20 opacity-0 mix-blend-overlay"
          animate={{
            opacity: [0, 0.3, 0],
            x: [0, -2, 1, 0],
          }}
          transition={{
            duration: 0.2,
            repeat: Infinity,
            repeatDelay: 5 + Math.random() * 5,
          }}
        />
      )}

      {variant === "holo" && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-neon-cyan/0 via-white/20 to-neon-pink/0"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        />
      )}

      <div
        className={`absolute top-0 right-0 w-1 h-1 border-t border-r ${getBorderColor()}`}
      />
      <div
        className={`absolute bottom-0 left-0 w-1 h-1 border-b border-l ${getBorderColor()}`}
      />

      <motion.div
        className={`absolute inset-0 bg-transparent ${getHoverBgColor()} transition-all duration-300`}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      />
    </motion.span>
  );
};

export { CyberBadge };
