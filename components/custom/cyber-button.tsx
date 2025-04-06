import { useGlitchText } from "@/lib/hooks/useGlitchText";
import { useState, useEffect } from "react";
import { usePerformanceMode } from "@/lib/contexts/performance-mode";

type CyberpunkButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "success" | "warning";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  loadingText?: string;
  dataText?: string;
  icon?: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
};

const CyberpunkButton = ({
  onClick,
  disabled = false,
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  loadingText = "SYS::SYNCING_",
  className = "",
  type = "button",
  icon,
}: CyberpunkButtonProps) => {
  const { reducedAnimations } = usePerformanceMode();
  const displayText = loading ? loadingText : children?.toString() || "";

  // Always call hook regardless of reduced animations setting
  const { text: glitchedText } = useGlitchText({
    text: displayText,
    interval: 100,
  });

  // Use the glitched text only if animations aren't reduced
  const text = reducedAnimations ? displayText : glitchedText;

  const [cursorBlink, setCursorBlink] = useState(true);

  const variants = {
    primary: {
      bg: "bg-black",
      border: "border-cyan-500",
      text: "text-cyan-400",
      gradFrom: "from-purple-600/20",
      gradTo: "to-cyan-600/20",
      cornerTL: "border-cyan-400",
      cornerTR: "border-purple-500",
      cornerBL: "border-purple-500",
      cornerBR: "border-cyan-400",
    },
    secondary: {
      bg: "bg-gray-900",
      border: "border-amber-500",
      text: "text-amber-400",
      gradFrom: "from-red-600/20",
      gradTo: "to-amber-500/20",
      cornerTL: "border-amber-400",
      cornerTR: "border-red-500",
      cornerBL: "border-red-500",
      cornerBR: "border-amber-400",
    },
    danger: {
      bg: "bg-black",
      border: "border-red-500",
      text: "text-red-400",
      gradFrom: "from-red-600/20",
      gradTo: "to-pink-500/20",
      cornerTL: "border-red-400",
      cornerTR: "border-pink-500",
      cornerBL: "border-pink-500",
      cornerBR: "border-red-400",
    },
    success: {
      bg: "bg-black",
      border: "border-green-500",
      text: "text-green-400",
      gradFrom: "from-green-600/20",
      gradTo: "to-cyan-500/20",
      cornerTL: "border-green-400",
      cornerTR: "border-cyan-500",
      cornerBL: "border-cyan-500",
      cornerBR: "border-green-400",
    },
    warning: {
      bg: "bg-black",
      border: "border-yellow-500",
      text: "text-yellow-400",
      gradFrom: "from-yellow-600/20",
      gradTo: "to-orange-500/20",
      cornerTL: "border-yellow-400",
      cornerTR: "border-orange-500",
      cornerBL: "border-orange-500",
      cornerBR: "border-yellow-400",
    },
  };

  // Configure size styles
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  // Cursor blink effect
  useEffect(() => {
    // Only apply blinking cursor if animations aren't reduced
    if (reducedAnimations) {
      setCursorBlink(true);
      return;
    }

    const interval = setInterval(() => {
      setCursorBlink((prev) => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, [reducedAnimations]);

  const currentVariant = variants[variant] || variants.primary;
  const currentSize = sizes[size] || sizes.md;

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
      className={`
        relative overflow-hidden ${currentVariant.bg} border ${
        currentVariant.border
      } ${currentVariant.text}
        font-mono tracking-wider ${currentSize} hover:bg-opacity-20 transition-all
        group cursor-pointer ${
          disabled || loading ? "opacity-50 cursor-not-allowed" : ""
        }
        ${fullWidth ? "w-full" : ""} ${className}
      `}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-r ${currentVariant.gradFrom} ${currentVariant.gradTo} opacity-50 group-hover:opacity-70`}
      />

      <div
        className={`absolute top-0 left-0 w-2 h-2 border-t border-l ${currentVariant.cornerTL}`}
      />
      <div
        className={`absolute top-0 right-0 w-2 h-2 border-t border-r ${currentVariant.cornerTR}`}
      />
      <div
        className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l ${currentVariant.cornerBL}`}
      />
      <div
        className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r ${currentVariant.cornerBR}`}
      />

      <span className="relative z-10 inline-flex items-center whitespace-nowrap">
        {icon && <span className="mr-1">{icon}</span>}

        <span>{text}</span>
        <span className={`ml-1 ${cursorBlink ? "opacity-100" : "opacity-0"}`}>
          █
        </span>
      </span>
    </button>
  );
};

export { CyberpunkButton };
