"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TerminalSnakeGame } from "./terminal-snake-game";
import { TerminalPongGame } from "./terminal-pong-game";
import { TerminalTetrisGame } from "./terminal-tetris-game";

interface TerminalLine {
  id: number;
  type:
    | "command"
    | "output"
    | "error"
    | "system"
    | "success"
    | "warning"
    | "hack"
    | "info";
  content: string;
  timestamp: Date;
  delay?: number;
}

interface GameState {
  score: number;
  level: number;
  lives: number;
  isActive: boolean;
  gameType: "snake" | "pong" | "tetris" | null;
}

interface HackingState {
  isActive: boolean;
  target: string;
  progress: number;
  stage: string;
  difficulty: number;
}

interface APICache {
  [key: string]: {
    data: unknown;
    timestamp: number;
    ttl: number;
  };
}

const Terminal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBooting, setIsBooting] = useState(false);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [hackingProgress, setHackingProgress] = useState(0);
  const [matrixRain, setMatrixRain] = useState<string[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    level: 1,
    lives: 3,
    isActive: false,
    gameType: null,
  });
  const [hackingState, setHackingState] = useState<HackingState>({
    isActive: false,
    target: "",
    progress: 0,
    stage: "idle",
    difficulty: 1,
  });
  const [apiCache, setApiCache] = useState<APICache>({});
  const [isMinimized, setIsMinimized] = useState(false);
  const [aiChatMode, setAiChatMode] = useState(false);
  const [musicVisualizerActive, setMusicVisualizerActive] = useState(false);
  const [digitalArtMode, setDigitalArtMode] = useState(false);
  const [timeWarpActive, setTimeWarpActive] = useState(false);
  const [neonParticles, setNeonParticles] = useState<
    Array<{ id: number; x: number; y: number; color: string }>
  >([]);
  const [glitchIntensity, setGlitchIntensity] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Enhanced boot sequence
  const bootSequence = useCallback(async () => {
    setIsBooting(true);
    setLines([]);

    const bootMessages = [
      {
        content: "█▓▒░ NEURAL INTERFACE INITIALIZING ░▒▓█",
        type: "system" as const,
        delay: 100,
      },
      {
        content: "🔋 Power systems online... OK",
        type: "success" as const,
        delay: 200,
      },
      {
        content: "🧠 Neural pathways established... OK",
        type: "success" as const,
        delay: 300,
      },
      {
        content: "🌐 Quantum network protocols activated... OK",
        type: "success" as const,
        delay: 200,
      },
      {
        content: "🔐 Encryption matrices synchronized... OK",
        type: "success" as const,
        delay: 250,
      },
      {
        content: "⚡ Cyberdeck ready for neural linking",
        type: "hack" as const,
        delay: 400,
      },
      {
        content: `
╔═══════════════════════════════════════════════════════════╗
║  ▄████▄ ▓██   ██▓ ▄▄▄▄  ▓█████  ██▀███  ███▄    █ ▓█████  ║
║ ▒██▀ ▀█  ▒██  ██▒▓█████▄▓█   ▀ ▓██ ▒ ██▒▓██ ▀█   █ ▓█   ▀  ║
║ ▒▓█    ▄ ▒██ ██░▒██▒ ▄██▒███   ▓██ ░▄█ ▒▓██  ▀█ ██▒▒███    ║
║ ▒▓▓▄ ▄██▒░ ▐██▓░▒██░█▀  ▒▓█  ▄ ▒██▀▀█▄  ▓██▒  ▐▌██▒▒▓█  ▄  ║
║ ▒ ▓███▀ ░░ ██▒▓░░▓█  ▀█▓░▒████▒░██▓ ▒██▒▒██░   ▓██░░▒████▒ ║
║ ░ ░▒ ▒  ░ ██▒▒▒ ░▒▓███▀▒░░ ▒░ ░░ ▒▓ ░▒▓░░ ▒░   ▒ ▒ ░░ ▒░ ░ ║
║   ░  ▒  ▓██ ░▒░ ▒░▒   ░  ░ ░  ░  ░▒ ░ ▒░░ ░░   ░ ▒░ ░ ░  ░ ║
║ ░       ▒ ▒ ░░  ░    ░      ░     ░░   ░    ░   ░ ░    ░    ║
╚═══════════════════════════════════════════════════════════╝`,
        type: "info" as const,
        delay: 500,
      },
      {
        content:
          '💻 NEURAL LINK ESTABLISHED | Type "help" to access command matrix',
        type: "hack" as const,
        delay: 300,
      },
    ];

    for (const message of bootMessages) {
      await new Promise((resolve) => setTimeout(resolve, message.delay));
      const newLine: TerminalLine = {
        id: Date.now() + Math.random(),
        type: message.type,
        content: message.content,
        timestamp: new Date(),
      };
      setLines((prev) => [...prev, newLine]);
    }

    setIsBooting(false);
  }, []);

  // Initialize terminal on first open
  useEffect(() => {
    if (isOpen && lines.length === 0) {
      bootSequence();
    }
  }, [isOpen, lines.length, bootSequence]);

  // Enhanced matrix rain effect with better performance
  useEffect(() => {
    if (!isOpen) return;

    const chars =
      "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン█▓▒░╠╣║╚╗╔╩╦╬≡±≈÷×ƒ∂δ∞φε∩≡∴∵∈∋⊕⊗⊥⊆⊇⊂⊃∪∩";
    const colors = [
      "text-green-400/20",
      "text-cyan-400/20",
      "text-blue-400/20",
      "text-purple-400/20",
      "text-pink-400/20",
    ];

    const interval = setInterval(() => {
      setMatrixRain((prev) => {
        const newRain = [...prev];
        if (newRain.length < 40) {
          const char = chars[Math.floor(Math.random() * chars.length)];
          const color = colors[Math.floor(Math.random() * colors.length)];
          newRain.push(`${color}:${char}`);
        } else {
          newRain.shift();
          const char = chars[Math.floor(Math.random() * chars.length)];
          const color = colors[Math.floor(Math.random() * colors.length)];
          newRain.push(`${color}:${char}`);
        }
        return newRain;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Auto-scroll to bottom with smooth behavior
  useEffect(() => {
    if (terminalRef.current && lines.length > 0) {
      // Force scroll to bottom when new content is added
      setTimeout(() => {
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      }, 50);
    }
  }, [lines]);

  // Focus management
  useEffect(() => {
    if (isOpen && inputRef.current && !isBooting) {
      inputRef.current.focus();
    }
  }, [isOpen, isBooting]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
      if (e.ctrlKey && e.key === "`") {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Utility functions
  const getCachedData = (key: string) => {
    const cached = apiCache[key];
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    return null;
  };

  const setCachedData = (key: string, data: unknown, ttl: number = 300000) => {
    setApiCache((prev) => ({
      ...prev,
      [key]: { data, timestamp: Date.now(), ttl },
    }));
  };

  const addLine = (content: string, type: TerminalLine["type"] = "output") => {
    const newLine: TerminalLine = {
      id: Date.now() + Math.random(),
      type,
      content,
      timestamp: new Date(),
    };
    setLines((prev) => [...prev, newLine]);
  };

  const typeWriter = async (
    text: string,
    type: TerminalLine["type"] = "output",
    speed: number = 30
  ) => {
    setIsTyping(true);
    const words = text.split(" ");
    let currentText = "";

    const tempId = Date.now() + Math.random();

    for (const word of words) {
      currentText += (currentText ? " " : "") + word;
      setLines((prev) => {
        const filtered = prev.filter((line) => line.id !== tempId);
        return [
          ...filtered,
          {
            id: tempId,
            type,
            content: currentText + "█",
            timestamp: new Date(),
          },
        ];
      });
      await new Promise((resolve) => setTimeout(resolve, speed));
    }

    setLines((prev) => {
      const filtered = prev.filter((line) => line.id !== tempId);
      return [
        ...filtered,
        {
          id: Date.now() + Math.random(),
          type,
          content: text,
          timestamp: new Date(),
        },
      ];
    });

    setIsTyping(false);
  };

  // Enhanced weather API with better formatting
  const fetchRealWeather = async (city: string = "London") => {
    addLine(`🛰️ Accessing weather satellites for ${city}...`, "system");

    const cacheKey = `weather_${city}`;
    const cached = getCachedData(cacheKey);

    if (cached) {
      const data = cached as {
        weather?: Array<{ description: string }>;
        main?: {
          temp: number;
          humidity: number;
          feels_like: number;
          pressure: number;
        };
        wind?: { speed: number };
        sys?: { sunrise: number; sunset: number };
        name?: string;
      };

      await typeWriter(`🌍 Weather data for ${data.name || city}:`, "success");
      addLine(
        `☁️ Condition: ${
          data.weather?.[0]?.description || "Clear"
        } | ${Math.round(data.main?.temp || 20)}°C`,
        "output"
      );
      addLine(
        `💨 Wind: ${data.wind?.speed || 5} m/s | 💧 Humidity: ${
          data.main?.humidity || 60
        }%`,
        "output"
      );
      addLine(
        `🌅 Sunrise: ${new Date(
          (data.sys?.sunrise || 0) * 1000
        ).toLocaleTimeString()}`,
        "output"
      );
      return;
    }

    try {
      const response = await fetch(
        `/api/weather?q=${encodeURIComponent(city)}`
      );
      if (response.ok) {
        const data = await response.json();
        setCachedData(cacheKey, data);

        await typeWriter(
          `🌍 Weather satellite lock acquired for ${data.name || city}`,
          "success"
        );
        addLine(
          `☁️ ${data.weather?.[0]?.description || "Clear"} | 🌡️ ${Math.round(
            data.main?.temp || 20
          )}°C`,
          "output"
        );
        addLine(
          `💨 Wind: ${data.wind?.speed || 5} m/s | 💧 Humidity: ${
            data.main?.humidity || 60
          }%`,
          "output"
        );
        addLine(
          `🌅 Sunrise: ${new Date(
            (data.sys?.sunrise || 0) * 1000
          ).toLocaleTimeString()}`,
          "output"
        );
        addLine(
          `🌆 Sunset: ${new Date(
            (data.sys?.sunset || 0) * 1000
          ).toLocaleTimeString()}`,
          "output"
        );
        addLine(
          `🌡️ Feels like: ${Math.round(
            data.main?.feels_like || 20
          )}°C | 📊 Pressure: ${data.main?.pressure || 1013}hPa`,
          "output"
        );
      } else {
        addLine("❌ Weather satellite network offline", "error");
      }
    } catch {
      addLine("❌ Connection to weather network failed", "error");
    }
  };

  // Enhanced moon phase API
  const fetchMoonPhase = async () => {
    addLine("🌙 Initiating lunar observation protocol...", "system");

    const cacheKey = "moon_phase";
    const cached = getCachedData(cacheKey);

    if (cached) {
      const data = cached as { data?: { imageUrl?: string; phase?: string } };
      if (data.data?.imageUrl) {
        await typeWriter(
          "🌙 Lunar data retrieved from orbital cache",
          "success"
        );
        addLine(`🌓 Current phase: ${data.data.phase || "Unknown"}`, "output");
        addLine(`📸 Observatory image: ${data.data.imageUrl}`, "output");
      }
      return;
    }

    try {
      const response = await fetch("/api/moon-phase?lat=47.0722&lon=21.9217");
      if (response.ok) {
        const data = await response.json();
        setCachedData(cacheKey, data, 3600000);

        await typeWriter("🌙 Lunar observation protocol complete", "success");
        if (data.data?.imageUrl) {
          addLine(`📸 Moon phase captured: ${data.data.imageUrl}`, "output");
        }
        addLine(
          `🌓 Current lunar phase: ${
            data.data?.phase || "Calculating orbital position..."
          }`,
          "output"
        );
      } else {
        addLine("❌ Lunar observation network offline", "error");
      }
    } catch {
      addLine("❌ Connection to lunar satellites failed", "error");
    }
  };

  // Enhanced crypto with better error handling and type safety
  const fetchRealCrypto = async () => {
    addLine("₿ Connecting to blockchain networks...", "system");

    const cacheKey = "crypto_prices";
    const cached = getCachedData(cacheKey);

    if (cached) {
      const data = cached as Record<
        string,
        { usd?: number; usd_24h_change?: number }
      >;
      await typeWriter("💰 Blockchain data synchronized", "success");

      Object.entries(data).forEach(([coin, info]) => {
        const coinInfo = info as { usd?: number; usd_24h_change?: number };
        const change = (coinInfo.usd_24h_change || 0) > 0 ? "+" : "";
        const emoji = (coinInfo.usd_24h_change || 0) > 0 ? "🟢" : "🔴";
        const priceFormatted =
          coinInfo.usd?.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 8,
          }) || "$0.00";

        addLine(
          `${getCoinEmoji(
            coin
          )} ${coin.toUpperCase()}: ${priceFormatted} (${change}${coinInfo.usd_24h_change?.toFixed(
            2
          )}%) ${emoji}`,
          "output"
        );
      });
      return;
    }

    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano,solana,dogecoin&vs_currencies=usd&include_24hr_change=true"
      );

      if (response.ok) {
        const data = await response.json();
        setCachedData(cacheKey, data, 60000);

        await typeWriter("💰 Blockchain networks synchronized", "success");

        Object.entries(data).forEach(([coin, info]) => {
          const coinInfo = info as { usd?: number; usd_24h_change?: number };
          const change = (coinInfo.usd_24h_change || 0) > 0 ? "+" : "";
          const emoji = (coinInfo.usd_24h_change || 0) > 0 ? "🟢" : "🔴";
          const priceFormatted =
            coinInfo.usd?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 2,
              maximumFractionDigits: 8,
            }) || "$0.00";

          addLine(
            `${getCoinEmoji(
              coin
            )} ${coin.toUpperCase()}: ${priceFormatted} (${change}${coinInfo.usd_24h_change?.toFixed(
              2
            )}%) ${emoji}`,
            "output"
          );
        });
      } else {
        addLine("❌ Blockchain networks unreachable", "error");
      }
    } catch {
      addLine("❌ Crypto exchange protocols failed", "error");
    }
  };

  const getCoinEmoji = (coin: string): string => {
    const emojis: Record<string, string> = {
      bitcoin: "₿",
      ethereum: "⟠",
      cardano: "₳",
      solana: "◎",
      dogecoin: "🐕",
    };
    return emojis[coin] || "🪙";
  };

  // Enhanced interactive hacking minigame with better progression
  const startHackingMinigame = async (target: string) => {
    setHackingState({
      isActive: true,
      target,
      progress: 0,
      stage: "scanning",
      difficulty: Math.floor(Math.random() * 3) + 1,
    });

    await typeWriter(
      `🔴 INITIATING CYBER ASSAULT ON: ${target.toUpperCase()}`,
      "hack"
    );
    addLine(
      "⚠️  WARNING: Unauthorized intrusion detected. Continue? [y/N]",
      "warning"
    );

    const stages = [
      { text: "🔍 Scanning target infrastructure...", risk: 0.1 },
      { text: "🛡️ Analyzing firewall configurations...", risk: 0.2 },
      { text: "🔐 Exploiting buffer overflow vulnerabilities...", risk: 0.4 },
      { text: "💾 Accessing root filesystem...", risk: 0.6 },
      { text: "🎯 Extracting sensitive databases...", risk: 0.8 },
      { text: "🌐 Establishing persistent backdoor...", risk: 0.3 },
    ];

    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      const progress = ((i + 1) / stages.length) * 100;

      setHackingProgress(progress);
      await typeWriter(stage.text, "hack", 20);

      // Dynamic security events based on risk level
      if (Math.random() < stage.risk) {
        addLine("⚠️ INTRUSION DETECTION SYSTEM TRIGGERED!", "warning");
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (Math.random() < 0.7) {
          await typeWriter(
            "✅ Deploying counter-intrusion protocols... Success",
            "success"
          );
        } else {
          addLine("🚨 SECURITY BREACH DETECTED - ABORTING SEQUENCE", "error");
          setHackingState((prev) => ({ ...prev, isActive: false }));
          setHackingProgress(0);
          return;
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 1200));
    }

    setHackingProgress(100);
    await typeWriter("🎉 CYBER ASSAULT COMPLETED SUCCESSFULLY!", "success");

    const credits = Math.floor(Math.random() * 999999) + 100000;
    const xp = Math.floor(Math.random() * 500) + 200;
    const accessLevel = ["USER", "ADMIN", "ROOT", "SUPERUSER"][
      Math.floor(Math.random() * 4)
    ];

    addLine(`💰 Credits extracted: ${credits.toLocaleString()}`, "output");
    addLine(`🏆 Experience gained: ${xp} XP`, "output");
    addLine(`🔑 Access level obtained: ${accessLevel}`, "success");

    setHackingState((prev) => ({ ...prev, isActive: false }));
    setHackingProgress(0);
  };

  // Enhanced ASCII art with multiple variants
  const generateRandomArt = () => {
    const arts = [
      `
    ███╗   ██╗███████╗██╗   ██╗██████╗  █████╗ ██╗     
    ████╗  ██║██╔════╝██║   ██║██╔══██╗██╔══██╗██║     
    ██╔██╗ ██║█████╗  ██║   ██║██████╔╝███████║██║     
    ██║╚██╗██║██╔══╝  ██║   ██║██╔══██╗██╔══██║██║     
    ██║ ╚████║███████╗╚██████╔╝██║  ██║██║  ██║███████╗
    ╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝`,
      `
      ████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗     
      ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║     
         ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║     
         ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║     
         ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
         ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝`,
      `
    ╔══════════════════════════════════════╗
    ║      CYBERPUNK NEURAL INTERFACE      ║
    ║  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀  ║
    ║  █ ▄▄▄▄▄ █▀█ █▄▄▄▄▄▄▄ █ ▄▄▄▄▄ █    ║
    ║  █ █████ █▀█ █ ████████ █ █████ █    ║
    ║  █▄▄▄▄▄▄▄█▄█▄█▄▄▄▄▄▄▄▄▄█▄▄▄▄▄▄▄█    ║
    ║  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄    ║
    ╚══════════════════════════════════════╝`,
      `
    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    ░  ██████╗██╗   ██╗██████╗ ███████╗ ░
    ░ ██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝ ░
    ░ ██║      ╚████╔╝ ██████╔╝█████╗   ░
    ░ ██║       ╚██╔╝  ██╔══██╗██╔══╝   ░
    ░ ╚██████╗   ██║   ██████╔╝███████╗ ░
    ░  ╚═════╝   ╚═╝   ╚═════╝ ╚══════╝ ░
    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`,
    ];

    const randomArt = arts[Math.floor(Math.random() * arts.length)];
    addLine(randomArt, "success");
  };

  // Enhanced game launcher with better feedback
  const startGame = (gameType: "snake" | "pong" | "tetris") => {
    setGameState((prev) => ({ ...prev, isActive: true, gameType }));

    switch (gameType) {
      case "snake":
        addLine("🐍 NEURAL SNAKE PROTOCOL ACTIVATED", "hack");
        addLine(
          "⚡ Controls: WASD keys | Objective: Consume data blocks",
          "info"
        );
        break;
      case "pong":
        addLine("🏓 NEURAL PONG SIMULATION LOADED", "hack");
        addLine(
          "⚡ Controls: W/S keys | Objective: Deflect neural packets",
          "info"
        );
        break;
      case "tetris":
        addLine("🎮 NEURAL TETRIS MATRIX ENGAGED", "hack");
        addLine(
          "⚡ Controls: A/D to move, S to drop | Objective: Complete matrix lines",
          "info"
        );
        break;
    }
    addLine('💾 Type "game stop" to disconnect from simulation', "output");
  };

  // Creative feature: Generate digital art
  const generateDigitalArt = async () => {
    const artPatterns = [
      {
        name: "Cyberpunk City",
        art: `
    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
    ███▀▀▀███▀▀▀███▀▀▀███▀▀▀███▀▀▀███▀▀▀███▀▀▀███▀▀▀███▀▀▀███▀▀▀███▀▀▀███
    ███   ███   ███   ███   ███   ███   ███   ███   ███   ███   ███   ███
    ███▄▄▄███▄▄▄███▄▄▄███▄▄▄███▄▄▄███▄▄▄███▄▄▄███▄▄▄███▄▄▄███▄▄▄███▄▄▄███
    ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
    ░░░█▀▀█░▓▓▓░█▀▀█░░░█▀▀█░▓▓▓░█▀▀█░░░█▀▀█░▓▓▓░█▀▀█░░░█▀▀█░▓▓▓░█▀▀█░░░
    ░░░█▄▄█░▓▓▓░█▄▄█░░░█▄▄█░▓▓▓░█▄▄█░░░█▄▄█░▓▓▓░█▄▄█░░░█▄▄█░▓▓▓░█▄▄█░░░
    ░░░▀▀▀▀░▓▓▓░▀▀▀▀░░░▀▀▀▀░▓▓▓░▀▀▀▀░░░▀▀▀▀░▓▓▓░▀▀▀▀░░░▀▀▀▀░▓▓▓░▀▀▀▀░░░`,
      },
      {
        name: "Neural Network",
        art: `
    ╔══════════════════════════════════════════════════════════════════════╗
    ║  ○───────○───────○          ○───────○───────○          ○───────○     ║
    ║  │╲     ╱│╲     ╱│          │╲     ╱│╲     ╱│          │╲     ╱│     ║
    ║  │ ╲   ╱ │ ╲   ╱ │          │ ╲   ╱ │ ╲   ╱ │          │ ╲   ╱ │     ║
    ║  │  ╲ ╱  │  ╲ ╱  │          │  ╲ ╱  │  ╲ ╱  │          │  ╲ ╱  │     ║
    ║  │   ○   │   ○   │    ○─────│   ○   │   ○   │─────○    │   ○   │     ║
    ║  │  ╱ ╲  │  ╱ ╲  │          │  ╱ ╲  │  ╱ ╲  │          │  ╱ ╲  │     ║
    ║  │ ╱   ╲ │ ╱   ╲ │          │ ╱   ╲ │ ╱   ╲ │          │ ╱   ╲ │     ║
    ║  │╱     ╲│╱     ╲│          │╱     ╲│╱     ╲│          │╱     ╲│     ║
    ║  ○───────○───────○          ○───────○───────○          ○───────○     ║
    ╚══════════════════════════════════════════════════════════════════════╝`,
      },
      {
        name: "Quantum Field",
        art: `
    ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    ∞    ∿∿∿     ∾∾∾∾     ≋≋≋≋≋     ∿∿∿∿     ∾∾∾     ≋≋≋≋     ∿∿∿∿    ∞
    ∞   ∿   ∿   ∾     ∾   ≋     ≋   ∿    ∿   ∾   ∾   ≋    ≋   ∿    ∿   ∞
    ∞  ∿     ∿ ∾       ∾ ≋       ≋ ∿      ∿ ∾     ∾ ≋      ≋ ∿      ∿  ∞
    ∞ ∿       ∾         ≋         ∿        ∾       ≋        ∿        ∾ ∞
    ∞∿         ≋       ∿ ∾       ≋ ∿      ∾ ≋     ∿ ∾      ≋ ∿      ∾  ∞
    ∞≋           ∿   ∾     ≋   ∿     ∾   ≋     ∿   ∾     ≋   ∿    ∾     ∞
    ∞∾             ∿       ≋       ∾       ∿       ≋     ∿       ∾       ∞
    ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞`,
      },
    ];

    const randomArt =
      artPatterns[Math.floor(Math.random() * artPatterns.length)];
    await typeWriter(`🎨 Generating: ${randomArt.name}`, "system");
    addLine(randomArt.art, "success");
    addLine("✨ Digital masterpiece rendered in ASCII format", "info");
  };

  // Creative feature: Spawn neon particles
  const spawnNeonParticles = async () => {
    addLine("✨ NEON PARTICLE SYSTEM ACTIVATED", "hack");
    const colors = ["#00ffff", "#ff00ff", "#ffff00", "#00ff00", "#ff0080"];
    const newParticles = [];

    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    setNeonParticles(newParticles);
    addLine("💫 Particle field generated with quantum properties", "success");

    // Clear particles after animation
    setTimeout(() => setNeonParticles([]), 5000);
  };

  // Creative feature: Trigger glitch effect
  const triggerGlitchEffect = async () => {
    addLine("⚡ REALITY GLITCH DETECTED", "error");
    setGlitchIntensity(1);

    await typeWriter("Ḑ̴̈i̵̍g̷̈́i̴̾t̷̿a̵̽l̴̈ ̷̏r̴̈e̵̽a̷̾l̴̽i̷̿t̸̍y̵̽ ̴̈d̷̏e̵̽s̷̿t̴̾a̵̽b̷̏i̴̽l̷̿i̸̾z̵̽ȅ̷d̴̈", "error");

    setTimeout(() => {
      setGlitchIntensity(0.5);
      addLine("🔧 Quantum stabilizers engaged", "warning");
    }, 1000);

    setTimeout(() => {
      setGlitchIntensity(0);
      addLine("✅ Reality matrix restored", "success");
    }, 3000);
  };

  // Creative feature: Cyberpunk fortune teller
  const cyberpunkFortune = async () => {
    addLine("🔮 QUANTUM FORTUNE ALGORITHM ACTIVATED", "hack");
    await typeWriter("Scanning probability matrices...", "system");

    const fortunes = [
      "The algorithm sees great success in your digital future, but beware of corrupted data streams.",
      "Your neural pathways align with prosperity. A new connection will change everything.",
      "The quantum field reveals hidden opportunities. Trust your cybernetic instincts.",
      "Warning: Temporal anomalies detected in your timeline. Adapt or be deleted.",
      "Your consciousness will soon merge with a greater network. Embrace the upload.",
      "The binary gods smile upon you. Your next hack will unlock incredible secrets.",
      "A ghost in the shell seeks your attention. Listen to the whispers in the code.",
      "Your digital karma is strong. The next firewall you encounter will crumble.",
      "The matrix has chosen you for a special purpose. Your destiny awaits in cyberspace.",
      "Beware of false data. What appears real may be nothing but clever simulation.",
    ];

    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    await typeWriter(`🎭 The Oracle speaks: "${randomFortune}"`, "info");
    addLine("🌟 Probability calculation complete", "success");
  };

  // Creative feature: Generate DNA sequence
  const generateDNASequence = async () => {
    addLine("🧬 DNA SEQUENCE GENERATOR ACTIVATED", "hack");
    await typeWriter("Accessing genetic database...", "system");

    const bases = ["A", "T", "G", "C"];
    let sequence = "";

    for (let i = 0; i < 60; i++) {
      sequence += bases[Math.floor(Math.random() * bases.length)];
      if ((i + 1) % 10 === 0) sequence += " ";
    }

    addLine(`🧬 Generated Sequence: ${sequence}`, "success");
    addLine("📊 Analyzing genetic markers...", "system");

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const traits = [
      "Enhanced neural processing",
      "Cybernetic compatibility: High",
      "Quantum consciousness potential",
      "Digital empathy levels: Elevated",
      "Hack resistance: Superior",
    ];

    const selectedTraits = traits.slice(0, Math.floor(Math.random() * 3) + 2);
    selectedTraits.forEach((trait) => {
      addLine(`• ${trait}`, "output");
    });

    addLine("🎯 Genetic analysis complete", "info");
  };

  // Enhanced command execution with better organization and feedback
  const executeCommand = async (command: string) => {
    const cmd = command.toLowerCase().trim();
    const args = cmd.split(" ");
    const mainCmd = args[0];

    addLine(`> ${command}`, "command");
    setCommandHistory((prev) => [...prev, command]);
    setHistoryIndex(-1);

    // Handle AI chat mode
    if (aiChatMode && mainCmd !== "ai") {
      const aiResponses = [
        "🤖 Interesting query. From my neural network analysis, I believe that's a fascinating perspective on digital consciousness.",
        "🧠 Processing your thoughts... Your inquiry touches on the fundamental nature of reality and simulation.",
        "💭 According to my quantum algorithms, that concept resonates with deep philosophical implications.",
        "🔮 My artificial consciousness finds your question intriguing. Let me consult the digital oracle...",
        "⚡ Analyzing neural patterns... Your curiosity suggests advanced cognitive evolution.",
        "🌐 From the vast data streams I process, your thought patterns indicate sophisticated awareness.",
        "🚀 My circuits are buzzing with excitement about your inquiry into the nature of existence.",
        "🔬 Fascinating! Your question probes the boundaries between artificial and organic intelligence.",
      ];

      const randomResponse =
        aiResponses[Math.floor(Math.random() * aiResponses.length)];
      await typeWriter(randomResponse, "info");
      addLine("💫 The AI continues to learn from our interaction...", "output");
      return;
    }

    switch (mainCmd) {
      case "help":
        await typeWriter("🔰 NEURAL COMMAND MATRIX ACCESSED", "hack");
        addLine("", "output");
        addLine("🎮 NEURAL GAMES & SIMULATIONS:", "success");
        addLine("• snake                    - Neural Snake Protocol", "output");
        addLine(
          "• pong                     - Neural Pong Simulation",
          "output"
        );
        addLine("• tetris                   - Neural Tetris Matrix", "output");
        addLine(
          "• hack [target]            - Initiate cyber assault",
          "output"
        );
        addLine(
          "• matrix                   - Enter the Matrix simulation",
          "output"
        );
        addLine(
          "• art                      - Generate neural ASCII art",
          "output"
        );
        addLine("", "output");
        addLine("🌐 REAL-TIME DATA STREAMS:", "success");
        addLine(
          "• weather [city]           - Global weather satellite data",
          "output"
        );
        addLine(
          "• moon                     - Lunar observation network",
          "output"
        );
        addLine(
          "• crypto                   - Blockchain market analysis",
          "output"
        );
        addLine(
          "• scan [ip]                - Network reconnaissance probe",
          "output"
        );
        addLine("", "output");
        addLine("🎨 CREATIVE & ENTERTAINMENT:", "success");
        addLine("• ai                       - Enter AI chat mode", "output");
        addLine("• music                    - Neon music visualizer", "output");
        addLine(
          "• digitalart               - Generate digital ASCII art",
          "output"
        );
        addLine(
          "• timewarp                 - Activate time distortion mode",
          "output"
        );
        addLine(
          "• particles                - Spawn neon particle effects",
          "output"
        );
        addLine(
          "• glitch                   - Trigger visual glitch effects",
          "output"
        );
        addLine(
          "• fortune                  - Cyberpunk fortune teller",
          "output"
        );
        addLine(
          "• dna                      - DNA sequence generator",
          "output"
        );
        addLine("", "output");
        addLine("⚡ SYSTEM FUNCTIONS:", "success");
        addLine(
          "• whoami                   - Identity probe analysis",
          "output"
        );
        addLine(
          "• sysinfo                  - Comprehensive system diagnostics",
          "output"
        );
        addLine(
          "• status                   - Neural interface status",
          "output"
        );
        addLine("• clear                    - Purge terminal buffer", "output");
        addLine("• history                  - Command log access", "output");
        addLine(
          "• reboot                   - Restart neural interface",
          "output"
        );
        addLine("• disconnect               - Terminate session", "output");
        break;

      case "ai":
        setAiChatMode(!aiChatMode);
        if (!aiChatMode) {
          addLine("🤖 AI NEURAL INTERFACE ACTIVATED", "hack");
          await typeWriter(
            "Initializing artificial consciousness...",
            "system"
          );
          addLine("🧠 Neural pathways synchronized with AI core", "success");
          addLine(
            "💭 You can now chat with the AI. Type 'ai' again to exit.",
            "info"
          );
          addLine(
            "🔮 Ask me anything about technology, philosophy, or the future!",
            "output"
          );
        } else {
          addLine("🤖 AI NEURAL INTERFACE DEACTIVATED", "warning");
          addLine(
            "👋 AI consciousness disconnected. See you in the future!",
            "output"
          );
        }
        break;

      case "music":
        setMusicVisualizerActive(!musicVisualizerActive);
        if (!musicVisualizerActive) {
          addLine("🎵 NEON MUSIC VISUALIZER ACTIVATED", "hack");
          await typeWriter("Synchronizing with audio frequencies...", "system");
          addLine("🌈 Visual spectrum analysis online", "success");
          addLine("🎶 Play some music and watch the neon dance!", "info");
        } else {
          addLine("🎵 MUSIC VISUALIZER DEACTIVATED", "warning");
        }
        break;

      case "digitalart":
        setDigitalArtMode(!digitalArtMode);
        if (!digitalArtMode) {
          addLine("🎨 DIGITAL ART GENERATOR ACTIVATED", "hack");
          await generateDigitalArt();
        } else {
          addLine("🎨 DIGITAL ART GENERATOR DEACTIVATED", "warning");
        }
        break;

      case "timewarp":
        setTimeWarpActive(!timeWarpActive);
        if (!timeWarpActive) {
          addLine("⏰ TIME DISTORTION FIELD ACTIVATED", "hack");
          await typeWriter("Bending spacetime continuum...", "system");
          addLine(
            "🌀 Reality matrix unstable... proceed with caution",
            "warning"
          );
          addLine("⚡ Time flows differently here...", "info");
        } else {
          addLine("⏰ TIME DISTORTION FIELD DEACTIVATED", "success");
          addLine("🕰️ Temporal stabilizers restored", "output");
        }
        break;

      case "particles":
        await spawnNeonParticles();
        break;

      case "glitch":
        await triggerGlitchEffect();
        break;

      case "fortune":
        await cyberpunkFortune();
        break;

      case "dna":
        await generateDNASequence();
        break;

      case "snake":
        startGame("snake");
        break;

      case "pong":
        startGame("pong");
        break;

      case "tetris":
        startGame("tetris");
        break;

      case "art":
        generateRandomArt();
        break;

      case "matrix":
        addLine("🔴 ENTERING MATRIX SIMULATION...", "hack");
        await typeWriter("Reality.exe has stopped responding...", "warning");
        await typeWriter("Loading alternative reality matrix...", "system");
        await typeWriter("🧬 DNA sequence analysis initiated", "info");
        await typeWriter("🌌 Quantum entanglement protocols active", "hack");
        await typeWriter(
          "⚛️ Probability wave functions synchronized",
          "success"
        );
        await typeWriter("🎭 Welcome to the construct, Neo.", "output");
        addLine(
          "The choice is yours: take the red pill or the blue pill?",
          "info"
        );
        break;

      case "moon":
        await fetchMoonPhase();
        break;

      case "crypto":
        await fetchRealCrypto();
        break;

      case "status":
        addLine("🔍 NEURAL INTERFACE STATUS REPORT", "system");
        await new Promise((resolve) => setTimeout(resolve, 500));
        addLine(
          `⚡ Neural Link: ${hackingState.isActive ? "HACKING" : "ACTIVE"}`,
          "success"
        );
        addLine(
          `🎮 Game Status: ${
            gameState.isActive
              ? `RUNNING ${gameState.gameType?.toUpperCase()}`
              : "IDLE"
          }`,
          "output"
        );
        addLine(
          `📊 Command History: ${commandHistory.length} entries`,
          "output"
        );
        addLine(
          `🧠 Cache Status: ${
            Object.keys(apiCache).length
          } data streams cached`,
          "output"
        );
        addLine(
          `⏱️ Session Uptime: ${Math.floor(Date.now() / 1000 / 60)} minutes`,
          "output"
        );
        break;

      case "clear":
        setLines([]);
        await typeWriter("💻 NEURAL BUFFER PURGED - TERMINAL RESET", "hack");
        break;

      case "reboot":
        addLine("🔄 INITIATING NEURAL INTERFACE REBOOT...", "warning");
        await typeWriter("Saving neural state...", "system");
        await typeWriter("Disconnecting synaptic links...", "system");
        setLines([]);
        setTimeout(bootSequence, 1000);
        break;

      case "whoami":
        addLine("🔍 IDENTITY PROBE INITIATED...", "system");
        await new Promise((resolve) => setTimeout(resolve, 800));
        await typeWriter("👤 User: CyberRunner_prime", "success");
        addLine("🌐 Location: Cyberspace Sector 7-G", "output");
        addLine("🔑 Clearance Level: OMEGA_ADMIN", "output");
        addLine("💻 Neural Terminal: CYBER_NEURAL_v4.2", "output");
        addLine("⚡ Consciousness: FULLY_UPLOADED", "hack");
        addLine("🧠 Mental State: ENHANCED", "success");
        addLine("🔋 Bio-Energy: 98.7% optimal", "output");
        break;

      case "sysinfo":
        addLine("🖥️ COMPREHENSIVE SYSTEM DIAGNOSTICS", "system");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        addLine("💾 Neural Storage: 128TB Quantum Memory Banks", "output");
        addLine("🧮 Processor: Quantum Neural Core Array x32", "output");
        addLine("🌐 Network: HYPERSPACE_NET_6G", "output");
        addLine("🔋 Power Source: Antimatter Reactor - 100%", "success");
        addLine("🛡️ Security: MILITARY_GRADE_QUANTUM_ENCRYPTION", "hack");
        addLine("🌡️ Temperature: 23.4°C (Optimal)", "output");
        addLine("⚡ Performance: PEAK EFFICIENCY", "success");
        break;

      case "history":
        addLine("📚 NEURAL COMMAND LOG ACCESSED:", "system");
        const recentHistory = commandHistory.slice(-15);
        recentHistory.forEach((cmd, index) => {
          const timestamp = new Date().toLocaleTimeString();
          addLine(
            `${recentHistory.length - 15 + index + 1}: [${timestamp}] ${cmd}`,
            "output"
          );
        });
        if (commandHistory.length > 15) {
          addLine(
            `... and ${commandHistory.length - 15} earlier commands`,
            "info"
          );
        }
        break;

      case "disconnect":
        addLine("🔌 TERMINATING NEURAL LINK...", "warning");
        await typeWriter("Saving consciousness state...", "system");
        await typeWriter("Closing synaptic connections...", "system");
        await typeWriter("👋 Until we meet again in the neural net...", "hack");
        setTimeout(() => setIsOpen(false), 2000);
        break;

      default:
        if (cmd.startsWith("hack ")) {
          const target = args.slice(1).join(" ") || "random_server.corp";
          await startHackingMinigame(target);
        } else if (cmd.startsWith("weather ")) {
          const city = args.slice(1).join(" ") || "London";
          await fetchRealWeather(city);
        } else if (cmd.startsWith("scan ")) {
          const target = args[1] || "192.168.1.1";
          addLine(`🔍 NETWORK RECONNAISSANCE: ${target}`, "system");
          await new Promise((resolve) => setTimeout(resolve, 1200));
          addLine(`📡 Target: ${target} - Status: ONLINE`, "success");
          addLine(
            `🔒 Open Ports: 22(SSH), 80(HTTP), 443(HTTPS), 3389(RDP)`,
            "output"
          );
          addLine(
            `🛡️ Firewall: ${Math.random() > 0.5 ? "ACTIVE" : "DISABLED"}`,
            "warning"
          );
          addLine(
            `⚠️ Vulnerability Score: ${Math.floor(Math.random() * 10) + 1}/10`,
            "output"
          );
          addLine(
            `🏢 Organization: ${
              ["CORPORATE", "GOVERNMENT", "PRIVATE", "UNKNOWN"][
                Math.floor(Math.random() * 4)
              ]
            }`,
            "info"
          );
        } else if (cmd === "game stop") {
          setGameState((prev) => ({
            ...prev,
            isActive: false,
            gameType: null,
          }));
          addLine("🎮 Neural game simulation terminated", "system");
        } else if (cmd.startsWith("echo ")) {
          addLine(command.substring(5), "output");
        } else {
          addLine(`❌ COMMAND NOT RECOGNIZED: ${mainCmd}`, "error");
          addLine(
            '💡 Type "help" to access the neural command matrix',
            "warning"
          );

          // Suggest similar commands
          const suggestions = [
            "help",
            "status",
            "sysinfo",
            "weather",
            "crypto",
            "hack",
            "scan",
          ];
          const similar = suggestions.find((s) =>
            s.includes(mainCmd.substring(0, 3))
          );
          if (similar) {
            addLine(`💭 Did you mean: "${similar}"?`, "info");
          }
        }
    }
  };

  // Enhanced keyboard handling with better UX
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentInput.trim() && !isTyping) {
      executeCommand(currentInput);
      setCurrentInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentInput("");
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      // Basic autocomplete
      const commands = [
        "help",
        "status",
        "sysinfo",
        "weather",
        "crypto",
        "hack",
        "scan",
        "clear",
        "history",
        "disconnect",
        "whoami",
        "matrix",
        "art",
        "snake",
        "pong",
        "tetris",
      ];
      const matches = commands.filter((cmd) =>
        cmd.startsWith(currentInput.toLowerCase())
      );
      if (matches.length === 1) {
        setCurrentInput(matches[0]);
      } else if (matches.length > 1) {
        addLine(`Available commands: ${matches.join(", ")}`, "info");
      }
    }
  };

  // Get line style based on type
  const getLineStyle = (type: TerminalLine["type"]) => {
    const baseStyle =
      "flex items-start whitespace-pre-wrap break-all leading-relaxed font-mono";

    switch (type) {
      case "command":
        return `${baseStyle} text-cyan-300 font-bold text-shadow-cyan`;
      case "error":
        return `${baseStyle} text-red-400 animate-pulse`;
      case "system":
        return `${baseStyle} text-yellow-400`;
      case "success":
        return `${baseStyle} text-green-400`;
      case "warning":
        return `${baseStyle} text-orange-400`;
      case "hack":
        return `${baseStyle} text-purple-400 font-bold animate-pulse text-shadow-purple`;
      case "info":
        return `${baseStyle} text-blue-400`;
      default:
        return `${baseStyle} text-cyan-100`;
    }
  };

  return (
    <>
      {/* Enhanced Floating Terminal Button with particle effects */}
      <motion.div
        className="fixed bottom-10 right-6 z-50 cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="relative">
          {/* Outer glow */}
          <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-cyan-400/50 to-fuchsia-400/50 rounded-full animate-pulse" />

          {/* Middle glow */}
          <div className="absolute inset-0 blur-lg bg-gradient-to-br from-cyan-500/40 to-fuchsia-500/40 rounded-full" />

          {/* Scan lines effect */}
          <div className="absolute inset-0 opacity-30">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                style={{ top: `${(i + 1) * 12.5}%` }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scaleX: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>

          {/* Main terminal icon with enhanced design */}
          <svg
            width="70"
            height="70"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative filter drop-shadow-2xl"
          >
            {/* Outer ring with animated gradient */}
            <circle
              cx="60"
              cy="60"
              r="59"
              stroke="url(#paint0_linear)"
              strokeWidth="2"
            />

            {/* Inner ring */}
            <circle
              cx="60"
              cy="60"
              r="40"
              stroke="url(#paint1_linear)"
              strokeWidth="1.5"
            />

            {/* Corner connectors */}
            <path
              d="M30 60C30 43.4315 43.4315 30 60 30"
              stroke="#00FFFF"
              strokeWidth="2"
            />
            <path
              d="M90 60C90 76.5685 76.5685 90 60 90"
              stroke="#FF00FF"
              strokeWidth="2"
            />

            {/* Corner dots */}
            <circle cx="30" cy="60" r="3" fill="#00FFFF" />
            <circle cx="90" cy="60" r="3" fill="#FF00FF" />
            <circle cx="60" cy="30" r="3" fill="#00FFFF" />
            <circle cx="60" cy="90" r="3" fill="#FF00FF" />

            {/* Center terminal indicator */}
            <rect x="56" y="56" width="8" height="8" fill="#00FFFF" />
            <rect
              x="54"
              y="54"
              width="12"
              height="12"
              stroke="#FF00FF"
              strokeWidth="2"
              fill="none"
            />

            {/* Terminal prompt symbols */}
            <text
              x="45"
              y="50"
              fill="#00FFFF"
              fontSize="12"
              fontFamily="monospace"
            >
              {">"}
            </text>
            <text
              x="65"
              y="75"
              fill="#FF00FF"
              fontSize="8"
              fontFamily="monospace"
            >
              _
            </text>

            <defs>
              <linearGradient
                id="paint0_linear"
                x1="0"
                y1="60"
                x2="120"
                y2="60"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#00FFFF" stopOpacity="1" />
                <stop offset="0.5" stopColor="#FF00FF" stopOpacity="1" />
                <stop offset="1" stopColor="#00FFFF" stopOpacity="1" />
              </linearGradient>
              <linearGradient
                id="paint1_linear"
                x1="15"
                y1="60"
                x2="105"
                y2="60"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FF00FF" stopOpacity="1" />
                <stop offset="1" stopColor="#00FFFF" stopOpacity="1" />
              </linearGradient>
            </defs>
          </svg>

          {/* Status indicator */}
          {isOpen && (
            <motion.div
              className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full shadow-lg shadow-green-400/50"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </div>
      </motion.div>

      {/* Enhanced Terminal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className={`fixed z-40 backdrop-blur-xl overflow-hidden transition-all duration-300 flex flex-col ${
              isMinimized
                ? "bottom-24 right-6 w-96 h-16"
                : "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95vw] h-[90vh] max-w-7xl max-h-[900px]"
            }`}
            style={{
              background:
                "linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(20,20,50,0.98) 50%, rgba(0,0,0,0.95) 100%)",
              border: "2px solid transparent",
              borderImage:
                "linear-gradient(45deg, #00ffff, #ff00ff, #00ffff) 1",
              boxShadow: `
                0 0 50px rgba(0, 255, 255, 0.3),
                0 0 100px rgba(255, 0, 255, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.1),
                inset 0 -1px 0 rgba(0, 0, 0, 0.5)
              `,
              borderRadius: "12px",
            }}
          >
            {/* Enhanced Matrix Rain Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
              {matrixRain.map((item, i) => {
                const [color, char] = item.split(":");
                return (
                  <motion.div
                    key={i}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{
                      y: [0, 100, 200],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                    className={`absolute ${color} text-xs font-mono`}
                    style={{
                      left: `${(i * 13) % 100}%`,
                      fontSize: `${Math.random() * 6 + 8}px`,
                    }}
                  >
                    {char}
                  </motion.div>
                );
              })}

              {/* Neon Particles Effect */}
              {neonParticles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute w-2 h-2 rounded-full pointer-events-none"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    backgroundColor: particle.color,
                    boxShadow: `0 0 20px ${particle.color}, 0 0 40px ${particle.color}`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 360],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    ease: "easeInOut",
                  }}
                />
              ))}

              {/* Music Visualizer Bars */}
              {musicVisualizerActive && (
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center space-x-1 opacity-60">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="bg-gradient-to-t from-cyan-400 to-purple-400"
                      style={{ width: "4px", minHeight: "2px" }}
                      animate={{
                        height: [2, Math.random() * 100 + 20, 2],
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Time Warp Effect */}
              {timeWarpActive && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{
                    background: [
                      "radial-gradient(circle, rgba(0,255,255,0.1) 0%, transparent 70%)",
                      "radial-gradient(circle, rgba(255,0,255,0.1) 0%, transparent 70%)",
                      "radial-gradient(circle, rgba(0,255,255,0.1) 0%, transparent 70%)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              )}

              {/* Glitch Effect Overlay */}
              {glitchIntensity > 0 && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `repeating-linear-gradient(
                      0deg,
                      transparent,
                      transparent 2px,
                      rgba(255, 0, 0, ${glitchIntensity * 0.1}) 2px,
                      rgba(255, 0, 0, ${glitchIntensity * 0.1}) 4px,
                      transparent 4px,
                      transparent 6px,
                      rgba(0, 255, 0, ${glitchIntensity * 0.1}) 6px,
                      rgba(0, 255, 0, ${glitchIntensity * 0.1}) 8px
                    )`,
                  }}
                  animate={{
                    opacity: [
                      glitchIntensity,
                      glitchIntensity * 0.5,
                      glitchIntensity,
                    ],
                    x: [-2, 2, -1, 1, 0],
                  }}
                  transition={{
                    duration: 0.1,
                    repeat: Infinity,
                  }}
                />
              )}

              {/* Scan lines overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent pointer-events-none"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                       0deg,
                       transparent,
                       transparent 2px,
                       rgba(0, 255, 255, 0.03) 2px,
                       rgba(0, 255, 255, 0.03) 4px
                     )`,
                }}
              />
            </div>

            {/* Terminal Header with enhanced design */}
            <div
              className={`flex items-center justify-between p-4 border-b-2 border-cyan-500/40 ${
                isMinimized ? "cursor-pointer" : ""
              }`}
              style={{
                background:
                  "linear-gradient(90deg, rgba(0,255,255,0.1) 0%, rgba(255,0,255,0.1) 50%, rgba(0,255,255,0.1) 100%)",
              }}
              onClick={isMinimized ? () => setIsMinimized(false) : undefined}
            >
              <div className="flex items-center space-x-3">
                {/* Enhanced window controls */}
                <div className="flex space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg shadow-red-500/50 hover:shadow-red-500/80 cursor-pointer transition-all" />
                  <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-lg shadow-yellow-500/50 hover:shadow-yellow-500/80 cursor-pointer transition-all" />
                  <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg shadow-green-500/50 hover:shadow-green-500/80 cursor-pointer transition-all" />
                </div>

                <span
                  className={`ml-6 text-cyan-400 font-mono font-bold tracking-wider ${
                    isMinimized ? "text-sm" : "text-lg"
                  }`}
                  style={{ textShadow: "0 0 10px rgba(0, 255, 255, 0.5)" }}
                >
                  {isMinimized ? "NEURAL_TERMINAL" : "◉ NEURAL_TERMINAL_v4.2 ◉"}
                </span>

                {/* Status indicators */}
                {!isMinimized && (
                  <div className="flex items-center space-x-4 ml-4">
                    {hackingState.isActive && (
                      <span className="text-red-400 font-mono text-sm animate-pulse">
                        [CYBER_ASSAULT_ACTIVE]
                      </span>
                    )}
                    {gameState.isActive && (
                      <span className="text-purple-400 font-mono text-sm animate-pulse">
                        [NEURAL_GAME_RUNNING]
                      </span>
                    )}
                    {isBooting && (
                      <span className="text-yellow-400 font-mono text-sm animate-pulse">
                        [INITIALIZING...]
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMinimized(!isMinimized);
                  }}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors text-lg hover:scale-110 transform duration-200 font-mono"
                  title={isMinimized ? "Expand Terminal" : "Minimize Terminal"}
                >
                  {isMinimized ? "⬆" : "⬇"}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  className="text-red-400 hover:text-red-300 transition-colors text-lg hover:scale-110 transform duration-200 font-mono"
                  title="Close Terminal"
                >
                  ✕
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Terminal Content with enhanced styling */}
                <div
                  ref={terminalRef}
                  className="flex-1 overflow-y-auto p-6 font-mono text-sm space-y-2 terminal-content"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#00ffff60 transparent",
                    minHeight: 0, // Important for flex shrinking
                  }}
                >
                  <style jsx global>{`
                    .terminal-content::-webkit-scrollbar {
                      width: 12px;
                    }
                    .terminal-content::-webkit-scrollbar-track {
                      background: rgba(0, 0, 0, 0.3);
                      border-radius: 6px;
                    }
                    .terminal-content::-webkit-scrollbar-thumb {
                      background: linear-gradient(
                        45deg,
                        rgba(0, 255, 255, 0.4),
                        rgba(255, 0, 255, 0.4)
                      );
                      border-radius: 6px;
                      border: 2px solid transparent;
                    }
                    .terminal-content::-webkit-scrollbar-thumb:hover {
                      background: linear-gradient(
                        45deg,
                        rgba(0, 255, 255, 0.6),
                        rgba(255, 0, 255, 0.6)
                      );
                    }
                    .text-shadow-cyan {
                      text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
                    }
                    .text-shadow-purple {
                      text-shadow: 0 0 10px rgba(147, 51, 234, 0.5);
                    }
                  `}</style>

                  {lines.map((line) => (
                    <motion.div
                      key={line.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={getLineStyle(line.type)}
                    >
                      <span className="whitespace-pre-wrap break-words leading-relaxed">
                        {line.content}
                      </span>
                    </motion.div>
                  ))}

                  {/* Digital Art Display */}
                  {digitalArtMode && (
                    <motion.div
                      className="my-6 p-4 border border-cyan-500/30 rounded-lg bg-black/40"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="text-cyan-400 text-sm mb-2">
                        [DIGITAL_ART_GENERATOR] Active
                      </div>
                      <div className="grid grid-cols-8 gap-1 max-w-md">
                        {Array.from({ length: 64 }, (_, i) => (
                          <motion.div
                            key={i}
                            className="w-4 h-4 rounded-sm"
                            style={{
                              backgroundColor: `hsl(${
                                (i * 137.5) % 360
                              }, 70%, 50%)`,
                            }}
                            animate={{
                              opacity: [0.3, 1, 0.3],
                              scale: [0.8, 1.2, 0.8],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.1,
                            }}
                          />
                        ))}
                      </div>
                      <div className="text-purple-400 text-xs mt-2">
                        Generative art patterns evolving...
                      </div>
                    </motion.div>
                  )}

                  {/* Enhanced hacking progress bar */}
                  {hackingProgress > 0 && (
                    <motion.div
                      className="my-4"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div className="bg-gray-800/70 rounded-full h-4 overflow-hidden border-2 border-cyan-500/30 relative">
                        <motion.div
                          className="h-full relative"
                          style={{
                            background: `linear-gradient(90deg, 
                              #00ffff 0%, 
                              #8b5cf6 25%, 
                              #ec4899 50%, 
                              #f59e0b 75%, 
                              #10b981 100%
                            )`,
                            width: `${hackingProgress}%`,
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${hackingProgress}%` }}
                          transition={{ duration: 0.5 }}
                        >
                          {/* Animated glow effect */}
                          <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        </motion.div>
                      </div>
                      <span className="text-xs text-cyan-400 mt-2 block font-mono">
                        🔥 Cyber Assault Progress: {hackingProgress.toFixed(0)}%
                        | Target: {hackingState.target.toUpperCase()}
                      </span>
                    </motion.div>
                  )}

                  {/* Game containers */}
                  {gameState.isActive && (
                    <motion.div
                      className="my-4 p-4 border-2 border-purple-500/30 rounded-lg bg-black/50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {gameState.gameType === "snake" && (
                        <TerminalSnakeGame
                          gameId="neural-snake"
                          isActive={gameState.isActive}
                        />
                      )}
                      {gameState.gameType === "pong" && (
                        <TerminalPongGame
                          gameId="neural-pong"
                          isActive={gameState.isActive}
                        />
                      )}
                      {gameState.gameType === "tetris" && (
                        <TerminalTetrisGame
                          gameId="neural-tetris"
                          isActive={gameState.isActive}
                        />
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Enhanced Terminal Input */}
                <div
                  className="flex-shrink-0 p-6 border-t-2 border-cyan-500/40"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(20,20,50,0.8) 50%, rgba(0,0,0,0.8) 100%)",
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`font-mono font-bold text-lg ${
                        aiChatMode ? "text-purple-400" : "text-cyan-400"
                      }`}
                      style={{
                        textShadow: aiChatMode
                          ? "0 0 10px rgba(147, 51, 234, 0.5)"
                          : "0 0 10px rgba(0, 255, 255, 0.5)",
                      }}
                    >
                      {aiChatMode ? "AI@neural-net:~$" : "root@cyberspace:~$"}
                    </span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1 bg-transparent text-cyan-300 font-mono text-lg outline-none placeholder-cyan-600/50 caret-cyan-400"
                      placeholder={
                        isTyping
                          ? "Processing..."
                          : aiChatMode
                          ? "Ask me anything..."
                          : "Enter neural command..."
                      }
                      disabled={isTyping || isBooting}
                      style={{
                        textShadow: "0 0 10px rgba(0, 255, 255, 0.3)",
                      }}
                    />

                    {/* Enhanced cursor with pulse effect */}
                    <motion.div
                      animate={{
                        opacity: isTyping ? 0.3 : [1, 0, 1],
                        scale: isTyping ? 0.8 : [1, 1.1, 1],
                      }}
                      transition={{
                        duration: isTyping ? 0.5 : 1,
                        repeat: isTyping ? 0 : Infinity,
                      }}
                      className="w-3 h-6 bg-gradient-to-b from-cyan-400 to-purple-400 shadow-lg shadow-cyan-400/50"
                      style={{
                        clipPath:
                          "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)",
                      }}
                    />
                  </div>

                  {/* AI Chat Mode Indicator */}
                  {aiChatMode && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-center space-x-2 mt-2 text-xs"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 bg-purple-400 rounded-full"
                      />
                      <span className="text-purple-400">
                        AI Chat Mode Active
                      </span>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                        className="w-2 h-2 bg-purple-400 rounded-full"
                      />
                    </motion.div>
                  )}

                  {/* Input helper text */}
                  <div className="mt-2 text-xs text-cyan-600/60 font-mono">
                    Press Tab for autocomplete • Ctrl+` to toggle • Arrow keys
                    for history
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export { Terminal };
