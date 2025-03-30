"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { GlitchText } from "./glitch-text";
import { ArrowRightCircle } from "lucide-react";

interface CyberSidePanelProps {
  icon: React.ReactNode;
  title?: string;
  children: React.ReactNode;
  initialExpanded?: boolean;
  position?: "left" | "right";
  verticalPosition?: "top" | "center" | "bottom";
  verticalOffset?: number;
  width?: number;
  collapsedSize?: number;
  theme?: "cyber" | "minimal" | "neon";
  onExpandChange?: (expanded: boolean) => void;
}

export const SideDisplay = ({
  icon,
  title,
  children,
  initialExpanded = false,
  position = "right",
  verticalPosition = "center",
  verticalOffset = 0,
  width = 320,
  collapsedSize = 50,
  theme = "cyber",
  onExpandChange,
}: CyberSidePanelProps) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const panelRef = useRef<HTMLDivElement>(null);

  const toggleExpand = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    if (onExpandChange) {
      onExpandChange(newState);
    }
  };

  const getVerticalPositionClass = () => {
    switch (verticalPosition) {
      case "top":
        return "top-0";
      case "bottom":
        return "bottom-0";
      case "center":
      default:
        return "top-1/2 -translate-y-1/2";
    }
  };

  const getVerticalOffsetStyle = () => {
    if (verticalPosition === "center") return {};

    return {
      [verticalPosition === "top" ? "top" : "bottom"]: `${verticalOffset}px`,
    };
  };

  const getThemeStyles = () => {
    switch (theme) {
      case "minimal":
        return {
          panel:
            "bg-slate-900/90 backdrop-blur-sm border border-slate-700 shadow-lg",
          button:
            "bg-slate-800 border border-slate-600 text-slate-200 hover:text-white",
          title: "text-slate-200 border-b border-slate-700",
          content: "text-slate-300",
        };
      case "neon":
        return {
          panel:
            "bg-indigo-950/80 backdrop-blur-md border-2 border-violet-500/50 shadow-[0_0_15px_rgba(124,58,237,0.5)]",
          button:
            "bg-indigo-900 border text-violet-300 hover:text-violet-200 shadow-[0_0_8px_rgba(124,58,237,0.5)]",
          title: "text-violet-300 border-b border-violet-500/30",
          content: "text-violet-200/90",
        };
      case "cyber":
      default:
        return {
          panel:
            "bg-space-black/80 backdrop-blur-md border-l-2 border-t-2 border-b-2 border-neon-cyan/50 shadow-[0_0_15px_rgba(0,255,255,0.5)]",
          button:
            "bg-space-black border border-none  text-neon-cyan hover:text-neon-pink shadow-[0_0_8px_rgba(255,0,255,0.5)] ",
          title: "text-neon-pink border-b border-neon-cyan/30",
          content: "text-neon-cyan/90",
        };
    }
  };

  const themeStyles = getThemeStyles();
  const verticalPositionClass = getVerticalPositionClass();
  const verticalOffsetStyle = getVerticalOffsetStyle();

  // close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isExpanded &&
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
        if (onExpandChange) {
          onExpandChange(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded, onExpandChange]);

  // escape key to close panel
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (isExpanded && event.key === "Escape") {
        setIsExpanded(false);
        if (onExpandChange) {
          onExpandChange(false);
        }
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [isExpanded, onExpandChange]);

  return (
    <div
      ref={panelRef}
      className={cn(
        "fixed z-40 h-auto",
        position === "left" ? "left-0" : "right-0",
        verticalPositionClass,
        "transition-all duration-300 ease-in-out",
        isExpanded
          ? `w-${width} max-w-screen `
          : `w-${collapsedSize} h-${collapsedSize}`
      )}
      style={{
        width: isExpanded ? width : collapsedSize,
        height: isExpanded ? "auto" : collapsedSize,
        ...verticalOffsetStyle,
      }}
    >
      <div
        className={cn(
          "relative h-full w-full",
          themeStyles.panel,
          "overflow-hidden"
        )}
      >
        {!isExpanded && (
          <button
            onClick={toggleExpand}
            className={cn(
              "absolute",
              position === "left",
              "right-1/2 translate-x-1/2",
              "left-1/2 -translate-x-1/2",
              "top-1/2 -translate-y-1/2",
              "w-8 h-8 flex items-center justify-center",
              themeStyles.button,
              "transition-all duration-300",
              "z-10",
              "cursor-pointer"
            )}
            aria-label={"Expand panel"}
          >
            {icon}
          </button>
        )}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: position === "left" ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: position === "left" ? -50 : 50 }}
              transition={{ type: "spring", damping: 20 }}
              className={cn("p-5", "h-full")}
            >
              {title && (
                <div className={cn("mb-4 pb-2", themeStyles.title)}>
                  <GlitchText text={title} variant="holo" /> <span>_v1.2</span>
                </div>
              )}
              <div
                className={cn(
                  "space-y-4",
                  themeStyles.content,
                  "max-h-[500px] overflow-y-auto md:max-h-none"
                )}
              >
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* close button to right */}
        {isExpanded && (
          <button
            className={cn(
              "absolute top-2 right-2 w-6 h-6 flex items-center justify-center",
              "text-neon-pink hover:text-white transition-colors",
              "cursor-pointer z-10"
            )}
            onClick={toggleExpand}
            aria-label="Close panel"
          >
            <ArrowRightCircle />
          </button>
        )}

        {theme === "cyber" && (
          <>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan/0 via-neon-cyan/70 to-neon-cyan/0"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan/0 via-neon-cyan/70 to-neon-cyan/0"></div>
            <div
              className="absolute top-2 left-2 w-2 h-2 bg-neon-pink rounded-full shadow-[0_0_5px_rgba(255,0,255,0.8)] cursor-pointer"
              onClick={toggleExpand}
            />
          </>
        )}
      </div>
    </div>
  );
};
