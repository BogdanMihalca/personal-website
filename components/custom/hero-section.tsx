"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code, Terminal, Zap, Camera, Layers, Video } from "lucide-react";
import { FloatingCube } from "./floating-cube";
import { CyberTerminal } from "./cyber-terminal";

const CyberpunkHero = () => {
  const [glitchEffect, setGlitchEffect] = useState(false);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 200);
    }, Math.random() * 5000 + 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute h-px w-full top-1/3 bg-gradient-to-r from-transparent via-fuchsia-600 to-transparent animate-pulse" />
        <div
          className="absolute h-px w-full top-2/3 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute w-px h-full left-1/3 bg-gradient-to-b from-transparent via-lime-500 to-transparent animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute w-px h-full right-1/3 bg-gradient-to-b from-transparent via-fuchsia-500 to-transparent animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <div className="absolute inset-0 z-0">
        <div className="absolute w-full h-1/2 bg-gradient-to-b from-purple-900/0 via-fuchsia-900/20 to-transparent" />
        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-cyan-900/0 via-cyan-900/20 to-transparent" />
        <div className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-fuchsia-600/30 to-purple-800/10 blur-3xl -left-24 top-1/3" />
        <div className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-cyan-500/30 to-blue-800/10 blur-3xl right-0 top-12" />
        <div className="absolute w-full h-96 bg-gradient-to-r from-lime-500/10 via-cyan-900/5 to-fuchsia-500/10 blur-3xl left-0 bottom-0" />
      </div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-start mt-20 lg:mt-0 lg:justify-center h-screen">
        <div
          className={`max-w-3xl transition-all duration-100 ${
            glitchEffect ? "translate-x-1 skew-x-1" : ""
          }`}
        >
          <div className="relative mb-6 inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 rounded p-px animate-gradient-x"></div>
            <Badge className="relative bg-black/80 text-cyan-400 backdrop-blur-sm py-2 px-3 border-0 text-sm font-mono">
              <Terminal className="mr-2 h-3 w-3 text-fuchsia-500" /> MBC _v1.0
            </Badge>
          </div>

          <h1
            className={`hidden lg:block text-6xl md:text-7xl font-bold mb-4 leading-tight ${
              glitchEffect ? "text-fuchsia-500" : "text-white"
            } `}
            style={{
              textShadow: glitchEffect
                ? "2px 0 #0ff, -2px 0 #f0f, 0 0 20px rgba(0, 255, 255, 0.7)"
                : "0 0 10px rgba(0, 255, 255, 0.5), 0 0 20px rgba(255, 0, 255, 0.3)",
            }}
          >
            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-cyan-400 animate-gradient-x">
              BOGDAN MIHALCA
            </span>
            <br />
            <span className="text-3xl md:text-4xl font-light tracking-widest text-gray-200 font-mono relative">
              SOFTWARE ENGINEER
              <span className="absolute -right-8 top-0 text-lime-500 animate-ping">
                _
              </span>
            </span>
          </h1>

          <CyberTerminal />

          <div className="flex flex-wrap gap-4 mt-8">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-white border-0 relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-600/0 via-white/10 to-cyan-600/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              <span className="relative flex items-center">
                JACK IN <Zap className="ml-2 h-4 w-4" />
              </span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border border-cyan-500/50 text-cyan-400 hover:bg-cyan-950/50 relative group"
            >
              <span className="absolute inset-0 w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-700"></span>
              <span className="absolute inset-0 w-1/2 h-px bottom-0 bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-700 delay-100"></span>
              <Code className="mr-2 h-4 w-4 text-fuchsia-400" /> ACCESS SOURCE
            </Button>
          </div>

          <div className="mt-8 p-0.5 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/50 via-fuchsia-500/20 to-cyan-500/50 rounded-sm opacity-70">
              <div className="flex flex-wrap gap-3 bg-black/30 backdrop-blur-sm p-3 rounded-sm relative z-10">
                {[
                  {
                    name: "React",
                    icon: <Code className="w-3.5 h-3.5 mr-1" />,
                    color: "cyan" as const,
                  },
                  {
                    name: "NextJs",
                    icon: <Zap className="w-3.5 h-3.5 mr-1" />,
                    color: "fuchsia" as const,
                  },
                  {
                    name: "TypeScript",
                    icon: <Terminal className="w-3.5 h-3.5 mr-1" />,
                    color: "blue" as const,
                  },
                  {
                    name: "Photography",
                    icon: <Camera className="w-3.5 h-3.5 mr-1" />,
                    color: "amber" as const,
                  },
                  {
                    name: "Videography",
                    icon: <Video className="w-3.5 h-3.5 mr-1" />,
                    color: "rose" as const,
                  },
                  {
                    name: "Adobe",
                    icon: <Layers className="w-3.5 h-3.5 mr-1" />,
                    color: "red" as const,
                  },
                ].map((tech) => {
                  const colorClasses = {
                    cyan: "text-cyan-400 hover:text-cyan-300 border-cyan-500/30",
                    fuchsia:
                      "text-fuchsia-400 hover:text-fuchsia-300 border-fuchsia-500/30",
                    blue: "text-blue-400 hover:text-blue-300 border-blue-500/30",
                    purple:
                      "text-purple-400 hover:text-purple-300 border-purple-500/30",
                    amber:
                      "text-amber-400 hover:text-amber-300 border-amber-500/30",
                    rose: "text-rose-400 hover:text-rose-300 border-rose-500/30",
                    red: "text-red-400 hover:text-red-300 border-red-500/30",
                  };

                  return (
                    <Badge
                      key={tech.name}
                      className={`bg-black/50 ${
                        colorClasses[tech.color]
                      } px-3 py-1.5 flex items-center transition-colors duration-300 border`}
                      variant="outline"
                    >
                      {tech.icon} {tech.name}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <FloatingCube />

      {glitchEffect && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0 bg-fuchsia-500/5"></div>
          <div className="absolute h-px w-full top-1/4 bg-cyan-500/70"></div>
          <div className="absolute h-px w-full bottom-1/3 bg-fuchsia-500/70"></div>
          <div
            className="absolute w-full h-full opacity-20"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='6' height='1' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='1' fill='%23FFFFFF'/%3E%3C/svg%3E\")",
              backgroundRepeat: "repeat",
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export { CyberpunkHero };
