import { useEffect, useRef } from "react";

type GlitchTextOptions = {
  interval?: number;
};

const useGlitchText = (options: GlitchTextOptions = {}) => {
  const glitchInterval = useRef<NodeJS.Timeout | null>(null);

  const applyGlitchEffect = () => {
    const glitchTexts = document.querySelectorAll(".glitch-text");
    if (glitchTexts.length > 0) {
      const randomIndex = Math.floor(Math.random() * glitchTexts.length);
      const element = glitchTexts[randomIndex] as HTMLElement;
      const originalText =
        element.getAttribute("data-text") || element.innerText;

      if (Math.random() > 0.7) {
        // Apply character corruption
        const corruptedText = originalText
          .split("")
          .map((char) =>
            Math.random() > 0.8
              ? ["$", "#", "%", "&", "!", ">", "<", "="][
                  Math.floor(Math.random() * 8)
                ]
              : char
          )
          .join("");

        element.innerText = corruptedText;

        // Reset after brief delay
        setTimeout(() => {
          element.innerText = originalText;
        }, 150);
      }
    }
  };

  useEffect(() => {
    // Set up glitch effect interval
    glitchInterval.current = setInterval(
      applyGlitchEffect,
      options.interval || 100
    );

    return () => {
      if (glitchInterval.current) {
        clearInterval(glitchInterval.current);
      }
    };
  }, [options.interval]);
};

export { useGlitchText };
