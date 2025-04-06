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

  // Update original text if the input text changes
  useEffect(() => {
    originalText.current = text;
    // Only update display text if we're not currently glitching
    if (!isGlitching.current) {
      setDisplayText(text);
    }
  }, [text]);

  // Create a corrupted version of the text
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

  // Apply a single glitch effect
  const applyGlitch = useCallback(() => {
    // Only glitch sometimes based on probability
    if (Math.random() > glitchProbability || isGlitching.current) return;

    isGlitching.current = true;
    const corruptedText = corruptText(originalText.current);
    setDisplayText(corruptedText);

    // Reset after duration
    setTimeout(() => {
      setDisplayText(originalText.current);
      isGlitching.current = false;
    }, glitchDuration);
  }, [corruptText, glitchProbability, glitchDuration]);

  // Internal function to clear the interval
  const clearGlitchInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // Reset to original text
    setDisplayText(originalText.current);
    isGlitching.current = false;
  }, []);

  // Start the glitch effect
  const start = useCallback(() => {
    if (intervalRef.current !== null) return;

    intervalRef.current = window.setInterval(applyGlitch, interval);
    setIsRunning(true);
  }, [applyGlitch, interval]);

  // Stop the glitch effect
  const stop = useCallback(() => {
    clearGlitchInterval();
    setIsRunning(false);
  }, [clearGlitchInterval]);

  // Force a glitch now
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

  // Set up and clean up the interval
  useEffect(() => {
    // Don't run the glitching effect if reduced animations is enabled
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

  // If reducedAnimations is enabled, always return the original text
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
