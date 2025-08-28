import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile;
}

// Enhanced engagement tracking hook
export function usePostEngagement(postId: number) {
  const [startTime] = useState(Date.now());
  const [scrollDepth, setScrollDepth] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let timeOnPage = 0;
    let lastUpdate = Date.now();

    // Track scroll depth and reading progress
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const currentScrollDepth = Math.round(
        (scrollTop / (documentHeight - windowHeight)) * 100
      );

      setScrollDepth(Math.max(scrollDepth, currentScrollDepth));

      // Calculate reading progress based on content area
      const contentElement = document.querySelector("article, .content, main");
      if (contentElement) {
        const contentRect = contentElement.getBoundingClientRect();
        const contentTop = contentRect.top + scrollTop;
        const contentHeight = contentRect.height;
        const progress = Math.round(
          Math.max(
            0,
            Math.min(
              100,
              ((scrollTop + windowHeight - contentTop) / contentHeight) * 100
            )
          )
        );
        setReadingProgress(Math.max(readingProgress, progress));
      }
    };

    // Track visibility (page focus/blur)
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
      if (document.hidden) {
        timeOnPage += Date.now() - lastUpdate;
      } else {
        lastUpdate = Date.now();
      }
    };

    // Add event listeners
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Clean up function to potentially send engagement data
    const cleanup = () => {
      if (!document.hidden) {
        timeOnPage += Date.now() - lastUpdate;
      }

      // Only send engagement data if user has analytics consent
      try {
        const hasConsent =
          typeof window !== "undefined" &&
          localStorage.getItem("cookieConsent") &&
          JSON.parse(localStorage.getItem("cookieConsent") || "{}")
            .analytics_storage;

        if (hasConsent && timeOnPage > 5000) {
          // Only if stayed more than 5 seconds
          const engagementScore = Math.min(
            100,
            Math.round(
              (timeOnPage / 1000) * 0.1 + // Time weight
                scrollDepth * 0.3 + // Scroll weight
                readingProgress * 0.6 // Reading weight
            )
          );

          // Send engagement data (could be enhanced with API call)
          console.log("Engagement data:", {
            postId,
            timeOnPage: Math.round(timeOnPage / 1000),
            scrollDepth,
            readingProgress,
            engagementScore,
            isBounce: timeOnPage < 10000 && scrollDepth < 25,
          });
        }
      } catch (error) {
        console.warn("Error sending engagement data:", error);
      }
    };

    // Track on page unload
    window.addEventListener("beforeunload", cleanup);

    return () => {
      cleanup();
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", cleanup);
    };
  }, [postId, scrollDepth, readingProgress]);

  return {
    timeOnPage: Date.now() - startTime,
    scrollDepth,
    readingProgress,
    isVisible,
  };
}
