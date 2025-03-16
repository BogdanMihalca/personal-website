"use client";
import { useState, useEffect, FC, ReactElement } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const CyberpunkDisplay: FC<{ title: string; children: ReactElement }> = ({
  title = "SYSTEM_BREACH",
  children,
}) => {
  const [glitchActive, setGlitchActive] = useState(false);
  const [hardGlitch, setHardGlitch] = useState(false);
  const [headerGlitch, setHeaderGlitch] = useState(false);

  // Trigger various glitch effects with different timings
  useEffect(() => {
    // Small title glitches - frequent
    const minorGlitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 100 + Math.random() * 200);
    }, 800 + Math.random() * 1200);

    // Major glitches - less frequent
    const majorGlitchInterval = setInterval(() => {
      setHardGlitch(true);
      setTimeout(() => setHardGlitch(false), 250);
    }, 4000 + Math.random() * 3000);

    // Header bar glitches
    const headerGlitchInterval = setInterval(() => {
      setHeaderGlitch(true);
      setTimeout(() => setHeaderGlitch(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => {
      clearInterval(minorGlitchInterval);
      clearInterval(majorGlitchInterval);
      clearInterval(headerGlitchInterval);
    };
  }, []);

  // Generate random hex data
  const generateHexLine = (length: number) => {
    return Array.from({ length })
      .map(() =>
        Math.floor(Math.random() * 16)
          .toString(16)
          .toUpperCase()
      )
      .join("");
  };

  return (
    <div className="relative w-[300px]">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 255, 255, 0.1) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          opacity: 0.4,
        }}
      />
      <div className="relative z-10">
        <div className="absolute -inset-px bg-transparent rounded overflow-hidden z-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                "conic-gradient(transparent, #f0f, #0ff, transparent)",
              animation: "spin 4s linear infinite",
            }}
          />
        </div>
        {hardGlitch && (
          <motion.div
            className="absolute inset-0 z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background:
                "linear-gradient(transparent 20%, rgba(255,0,255,0.3) 22%, transparent 23%, transparent 36%, rgba(0,255,255,0.3) 38%, transparent 40%, transparent 65%, rgba(255,0,255,0.3) 67%, transparent 69%)",
              backgroundSize: "100% 100%",
              transform: "translateX(-5px)",
              mixBlendMode: "exclusion",
            }}
          />
        )}

        <Card className="relative border-0 rounded overflow-hidden bg-transparent">
          <div className="relative bg-gray-900/95 shadow-lg overflow-hidden p-0.5">
            <div
              className="absolute inset-0"
              style={{
                boxShadow:
                  "inset 0 0 15px rgba(0, 255, 255, 0.5), inset 0 0 10px rgba(255, 0, 255, 0.3)",
              }}
            />

            <div className="relative border-b-2 border-cyan-500/50">
              <motion.div
                className="absolute h-0.5 w-full bg-cyan-400/80 z-10"
                animate={{
                  y: [0, 40, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              />

              <div
                className={`relative p-2 ${
                  headerGlitch ? "bg-red-500/20" : "bg-gray-900"
                } flex items-center overflow-hidden`}
                style={{
                  backgroundImage: headerGlitch
                    ? ""
                    : "radial-gradient(circle, rgba(0,255,255,0.1) 1px, transparent 1px)",
                  backgroundSize: "12px 12px",
                }}
              >
                <div className="hidden md:flex items-center">
                  <div className="text-cyan-400 text-xs   mr-2 opacity-70">
                    SYS://
                  </div>
                  <div className="h-3 w-3 bg-cyan-400 rounded-full animate-pulse" />
                </div>

                <div className="flex-1 flex justify-center relative overflow-visible">
                  {glitchActive && (
                    <motion.div
                      className="absolute font-bold text-xl text-fuchsia-600/70 left-0 right-0 text-center"
                      style={{
                        fontFamily: "'Orbitron', sans-serif",
                        clipPath:
                          "polygon(0 25%, 100% 25%, 100% 30%, 0 30%, 0 50%, 100% 50%, 100% 55%, 0 55%, 0 70%, 100% 70%, 100% 75%, 0 75%)",
                        transform: "translateX(3px) translateY(1px)",
                      }}
                    >
                      {title}
                    </motion.div>
                  )}

                  {/* Main title with text shadow */}
                  <motion.h2
                    className={`font-bold text-xl ${
                      glitchActive ? "text-cyan-400" : "text-transparent"
                    } tracking-wider text-center uppercase`}
                    animate={
                      headerGlitch
                        ? {
                            x: [0, -2, 3, -3, 0],
                            skewX: [0, -4, 6, -2, 0],
                          }
                        : {}
                    }
                    transition={{ duration: 0.2 }}
                    style={{
                      fontFamily: "'Orbitron', sans-serif",
                      textShadow: glitchActive
                        ? "rgba(255,0,255,0.8) 0 0 1px, rgba(255,0,255,0.8) 0 0 3px, rgba(255,0,255,0.8) 0 0 5px"
                        : "0 0 4px #0ff, 0 0 11px #0ff, 0 0 19px #0ff",
                      WebkitTextStroke: glitchActive
                        ? "0.5px rgba(0,255,255,0.6)"
                        : "0.5px rgba(0,255,255,0.8)",
                      backgroundImage: !glitchActive
                        ? "linear-gradient(90deg, #0ff, #f0f, #0ff)"
                        : "",
                      backgroundSize: "200% auto",
                      WebkitBackgroundClip: "text",
                      animation: !glitchActive
                        ? "gradient 3s linear infinite"
                        : "",
                      filter: headerGlitch ? "hue-rotate(90deg)" : "none",
                    }}
                  >
                    {title}

                    <span className="inline-block">
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "loop",
                        }}
                      >
                        _
                      </motion.span>
                    </span>
                  </motion.h2>
                </div>

                <div className="hidden md:block text-cyan-400/70 text-xs   ml-2">
                  <span className="animate-pulse">█</span>
                  <span>{generateHexLine(4)}</span>
                </div>
              </div>

              <div className="flex justify-between bg-black text-xs   overflow-hidden text-cyan-500/70 px-1">
                <motion.div
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {generateHexLine(12)}
                </motion.div>
                <div>
                  {new Date()
                    .toISOString()
                    .replace("T", "/")
                    .split(".")[0]
                    .replace(/:/g, "/")}
                </div>
              </div>
            </div>

            <div className="relative">
              <div
                className="absolute inset-0 pointer-events-none z-20 opacity-10"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2) 1px, transparent 1px, transparent 2px)",
                  backgroundSize: "100% 2px",
                }}
              />
              <div
                className="relative z-10 p-3 md:p-4"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, rgba(0,255,255,0.03) 0px, rgba(0,255,255,0.03) 1px, transparent 1px, transparent 4px)",
                  backgroundSize: "5px 5px",
                }}
              >
                <div className="relative z-20">{children}</div>

                {glitchActive && (
                  <>
                    <motion.div
                      className="absolute h-2 bg-fuchsia-600/30 z-30 pointer-events-none"
                      style={{
                        width: "30%",
                        left: `${Math.random() * 70}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                    />
                    <motion.div
                      className="absolute w-1 bg-cyan-400/40 z-30 pointer-events-none"
                      style={{
                        height: "10%",
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 90}%`,
                      }}
                    />
                  </>
                )}
              </div>
            </div>

            <div className="border-t-2 border-cyan-500/50 bg-black/70 overflow-hidden ">
              <div className="relative overflow-hidden">
                <motion.div
                  animate={{ x: ["100%", "-100%"] }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="text-xs text-cyan-400/60   tracking-wider py-1 inline-block"
                >
                  NET//BREACH:::{generateHexLine(16)}:::AUTH_BYPASS_ACTIVE:::
                  {generateHexLine(8)}:::NEURO_LINK_ESTABLISHED:::
                  {generateHexLine(12)}
                  :::SIGNAL_STRENGTH::97.8%:::CORE_TEMP::42.3°C:::DARKNET_ACCESS_GRANTED:::
                  {generateHexLine(10)}
                  :::BIOCHIP_STATUS::OPTIMAL:::FIREWALL::COMPROMISED:::
                  {generateHexLine(14)}
                  :::IDENTITY_MASKED:::GRID_CONNECTION::SECURE
                </motion.div>
              </div>
            </div>
          </div>
        </Card>

        <div className="absolute -top-1 -right-1 w-2 h-8 bg-fuchsia-600/60" />
        <div className="absolute -bottom-1 -left-1 w-8 h-2 bg-cyan-400/60" />

        {hardGlitch && (
          <>
            <motion.div
              className="absolute -right-3 top-1/3 bg-cyan-400 w-6 h-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="absolute -left-2 top-2/3 bg-fuchsia-500 w-4 h-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.15, delay: 0.1 }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export { CyberpunkDisplay };
