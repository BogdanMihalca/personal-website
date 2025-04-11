import { useState, useEffect, useRef, useCallback } from "react";
import { usePerformanceMode } from "@/lib/contexts/performance-mode";

type GlitchTextOptions = {
  text: string;
  interval?: number;
  glitchProbability?: number;
  characterCorruptionRate?: number;
  specialChars?: string[];
  glitchDuration?: number;
};

/**
 *  hook that returns glitched versions of text without DOM manipulation.
 * simply renders the returned text value wherever needed.
 *
 * @param options configuration options including the text to glitch
 * @returns the current text (original or glitched) and control functions
 */
const useGlitchText = (options: GlitchTextOptions) => {
  const {
    text,
    interval = 100,
    glitchProbability = 0.3,
    characterCorruptionRate = 0.2,
    specialChars = [
      "$",
      "#",
      "%",
      "&",
      "!",
      ">",
      "<",
      "=",
      "*",
      "?",
      "@",
      "`",
      "¡",
      "™",
      "£",
      "¢",
      "∞",
      "§",
      "¶",
      "•",
      "ª",
      "º",
      "–",
      "≠",
      "å",
      "ß",
      "∂",
      "ƒ",
      "©",
      "˙",
      "∆",
      "˚",
      "¬",
      "…",
      "æ",
      "≈",
      "ç",
      "√",
      "∫",
      "˜",
      "µ",
      "≤",
      "≥",
      "÷",
      "/",
      "?",
      "░",
      "▒",
      "▓",
      "<",
      ">",
      "/",
    ],
    glitchDuration = 150,
  } = options;

  const { reducedAnimations } = usePerformanceMode();
  const [displayText, setDisplayText] = useState<string>(text);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const originalText = useRef<string>(text);
  const intervalRef = useRef<number | null>(null);
  const isGlitching = useRef<boolean>(false);

  useEffect(() => {
    originalText.current = text;
    if (!isGlitching.current) {
      setDisplayText(text);
    }
  }, [text]);

  const corruptText = useCallback(
    (inputText: string): string => {
      return inputText
        .split("")
        .map((char) =>
          Math.random() < characterCorruptionRate
            ? specialChars[Math.floor(Math.random() * specialChars.length)]
            : char
        )
        .join("");
    },
    [characterCorruptionRate, specialChars]
  );

  const applyGlitch = useCallback(() => {
    if (Math.random() > glitchProbability || isGlitching.current) return;

    isGlitching.current = true;
    const corruptedText = corruptText(originalText.current);
    setDisplayText(corruptedText);

    setTimeout(() => {
      setDisplayText(originalText.current);
      isGlitching.current = false;
    }, glitchDuration);
  }, [corruptText, glitchProbability, glitchDuration]);

  const clearGlitchInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setDisplayText(originalText.current);
    isGlitching.current = false;
  }, []);

  const start = useCallback(() => {
    if (intervalRef.current !== null) return;

    intervalRef.current = window.setInterval(applyGlitch, interval);
    setIsRunning(true);
  }, [applyGlitch, interval]);

  const stop = useCallback(() => {
    clearGlitchInterval();
    setIsRunning(false);
  }, [clearGlitchInterval]);

  const glitchNow = useCallback(() => {
    if (!isGlitching.current && !reducedAnimations) {
      isGlitching.current = true;
      const corruptedText = corruptText(originalText.current);
      setDisplayText(corruptedText);

      setTimeout(() => {
        setDisplayText(originalText.current);
        isGlitching.current = false;
      }, glitchDuration);
    }
  }, [corruptText, glitchDuration, reducedAnimations]);

  useEffect(() => {
    if (reducedAnimations) {
      clearGlitchInterval();
      setIsRunning(false);
      return;
    }

    if (isRunning) {
      start();
    } else {
      clearGlitchInterval();
    }

    return clearGlitchInterval;
  }, [isRunning, start, clearGlitchInterval, reducedAnimations]);

  return {
    text: reducedAnimations ? originalText.current : displayText,
    isRunning: reducedAnimations ? false : isRunning,
    start,
    stop,
    glitchNow,
  };
};

export { useGlitchText };
export type { GlitchTextOptions };
