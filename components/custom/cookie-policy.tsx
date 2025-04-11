"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CyberpunkButton } from "./cyber-button";
import { useGlitchText } from "@/lib/hooks/useGlitchText";
import { usePerformanceMode } from "@/lib/contexts/performance-mode";

const CookiePolicy = () => {
  const [visible, setVisible] = useState(false);
  const { reducedAnimations } = usePerformanceMode();
  const { text: glitchedTitle } = useGlitchText({
    text: "COOKIE::SYSTEM_POLICY",
    interval: 150,
  });

  useEffect(() => {
    const hasAccepted = localStorage.getItem("cookiesAccepted");
    if (!hasAccepted) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-101 animate-slide-up">
      <div className="relative overflow-hidden">
        <div className="relative border-t border-cyan-500 bg-black bg-opacity-90 backdrop-blur-sm">
          <div className="container mx-auto p-4 md:p-6">
            <div className="grid md:grid-cols-4 gap-6 items-center">
              <div className="md:col-span-1">
                <h2 className="text-lg md:text-xl font-mono tracking-wider text-cyan-400">
                  {reducedAnimations ? "COOKIE::SYSTEM_POLICY" : glitchedTitle}
                  <span className="ml-1 animate-blink">█</span>
                </h2>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm text-gray-300 mb-2">
                  This neural interface deploys data fragments (cookies) to
                  optimize your experience. By connecting to this network, you
                  authorize data collection in accordance with our protocols.
                </p>
                <p className="text-xs text-cyan-300 mb-3">
                  Access our{" "}
                  <Link
                    href="/legal/privacy"
                    className="text-cyan-400 hover:text-cyan-300 underline"
                  >
                    Privacy Protocol
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/legal/tos"
                    className="text-cyan-400 hover:text-cyan-300 underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  for complete documentation.
                </p>
              </div>

              <div className="md:col-span-1 flex justify-end">
                <CyberpunkButton
                  onClick={handleAccept}
                  variant="primary"
                  size="md"
                >
                  ACCEPT_CONNECTION
                </CyberpunkButton>
              </div>
            </div>
          </div>

          {!reducedAnimations && (
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-scan"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
