"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CyberpunkButton } from "./cyber-button";
import { useGlitchText } from "@/lib/hooks/useGlitchText";
import { usePerformanceMode } from "@/lib/contexts/performance-mode";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface CookieConsent {
  necessary: boolean;
  ad_storage: boolean;
  ad_user_data: boolean;
  ad_personalization: boolean;
  analytics_storage: boolean;
  functionality_storage: boolean;
  personalization_storage: boolean;
  security_storage: boolean;
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const CookiePolicy = ({}) => {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true, // Always true, cannot be disabled
    ad_storage: false,
    ad_user_data: false,
    ad_personalization: false,
    analytics_storage: false,
    functionality_storage: true, // granted for functionality
    personalization_storage: false,
    security_storage: true, //  granted for security
  });
  const { reducedAnimations } = usePerformanceMode();
  const { text: glitchedTitle } = useGlitchText({
    text: "COOKIE::SYSTEM_POLICY",
    interval: 150,
  });

  useEffect(() => {
    const hasAccepted = localStorage.getItem("cookiesAccepted");
    const storedConsent = localStorage.getItem("cookieConsent");

    if (storedConsent) {
      try {
        const parsedConsent = JSON.parse(storedConsent);
        setConsent(parsedConsent);
      } catch (e) {
        console.error("Error parsing stored consent:", e);
      }
    }

    if (!hasAccepted) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const updateConsent = (category: keyof CookieConsent, value: boolean) => {
    if (
      category === "necessary" ||
      category === "security_storage" ||
      category === "functionality_storage"
    )
      return;

    setConsent((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const saveConsent = (consentData: CookieConsent) => {
    localStorage.setItem("cookiesAccepted", "true");
    localStorage.setItem("cookieConsent", JSON.stringify(consentData));

    if (window.gtag) {
      window.gtag("consent", "update", {
        ad_storage: consentData.ad_storage ? "granted" : "denied",
        ad_user_data: consentData.ad_user_data ? "granted" : "denied",
        ad_personalization: consentData.ad_personalization
          ? "granted"
          : "denied",
        analytics_storage: consentData.analytics_storage ? "granted" : "denied",
        functionality_storage: consentData.functionality_storage
          ? "granted"
          : "denied",
        personalization_storage: consentData.personalization_storage
          ? "granted"
          : "denied",
        security_storage: consentData.security_storage ? "granted" : "denied",
      });
    }
  };

  const handleAcceptAll = () => {
    const allConsent = {
      necessary: true,
      ad_storage: true,
      ad_user_data: true,
      ad_personalization: true,
      analytics_storage: true,
      functionality_storage: true,
      personalization_storage: true,
      security_storage: true,
    };
    setConsent(allConsent);
    saveConsent(allConsent);
    setVisible(false);
  };

  const handleAcceptSelected = () => {
    saveConsent(consent);
    setVisible(false);
  };

  const handleRejectAll = () => {
    const minimalConsent = {
      necessary: true,
      ad_storage: false,
      ad_user_data: false,
      ad_personalization: false,
      analytics_storage: false,
      functionality_storage: true, // Keep essential functionality
      personalization_storage: false,
      security_storage: true, // Keep essential security
    };
    setConsent(minimalConsent);
    saveConsent(minimalConsent);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] animate-slide-up">
      <div className="relative overflow-hidden">
        <div className="relative border-t border-cyan-500/50 bg-black/95 backdrop-blur-md">
          <div className="container mx-auto p-6">
            {!showDetails ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                <div className="flex-1">
                  <h2 className="text-lg font-mono text-cyan-400 mb-2">
                    {reducedAnimations ? "Cookie Settings" : glitchedTitle}
                  </h2>
                  <p className="text-sm text-gray-300 mb-3">
                    We use cookies to enhance your experience. Choose your
                    preferences or{" "}
                    <Link
                      href="/legal/cookies"
                      className="text-cyan-400 hover:text-cyan-300 underline"
                    >
                      learn more
                    </Link>
                    .
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                  <CyberpunkButton
                    onClick={handleRejectAll}
                    variant="secondary"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    Essential Only
                  </CyberpunkButton>
                  <CyberpunkButton
                    onClick={() => setShowDetails(true)}
                    variant="warning"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    Customize
                  </CyberpunkButton>
                  <CyberpunkButton
                    onClick={handleAcceptAll}
                    variant="primary"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    Accept All
                  </CyberpunkButton>
                </div>
              </div>
            ) : (
              // Detailed Preferences View
              <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-mono text-cyan-400">
                    Cookie Preferences
                  </h2>
                  <CyberpunkButton
                    onClick={() => setShowDetails(false)}
                    variant="warning"
                    size="sm"
                  >
                    ×
                  </CyberpunkButton>
                </div>

                <div className="grid gap-4">
                  {/* Essential Cookies */}
                  <div className="border border-gray-700 rounded-lg p-4 bg-gray-900/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-gray-200">
                          Essential Cookies
                        </h3>
                        <Badge
                          variant="outline"
                          className="text-xs border-red-500 text-red-400"
                        >
                          Required
                        </Badge>
                      </div>
                      <Switch
                        checked={consent.necessary}
                        disabled={true}
                        className="opacity-50"
                      />
                    </div>
                    <p className="text-sm text-gray-400">
                      Required for authentication, security, and core
                      functionality.
                    </p>
                  </div>

                  {/* Analytics Storage */}
                  <div className="border border-gray-700 rounded-lg p-4 bg-gray-900/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-gray-200">
                          Analytics Cookies
                        </h3>
                        <Badge
                          variant="outline"
                          className="text-xs border-yellow-500 text-yellow-400"
                        >
                          Optional
                        </Badge>
                      </div>
                      <Switch
                        checked={consent.analytics_storage}
                        onCheckedChange={(checked: boolean) =>
                          updateConsent("analytics_storage", checked)
                        }
                      />
                    </div>
                    <p className="text-sm text-gray-400">
                      Help us understand website usage and improve performance.
                    </p>
                  </div>

                  {/* Advertising Storage */}
                  <div className="border border-gray-700 rounded-lg p-4 bg-gray-900/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-gray-200">
                          Advertising Cookies
                        </h3>
                        <Badge
                          variant="outline"
                          className="text-xs border-purple-500 text-purple-400"
                        >
                          Optional
                        </Badge>
                      </div>
                      <Switch
                        checked={consent.ad_storage}
                        onCheckedChange={(checked: boolean) =>
                          updateConsent("ad_storage", checked)
                        }
                      />
                    </div>
                    <p className="text-sm text-gray-400">
                      Used for storing advertising-related information and
                      targeting.
                    </p>
                  </div>

                  {/* Personalization Storage */}
                  <div className="border border-gray-700 rounded-lg p-4 bg-gray-900/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-gray-200">
                          Personalization Cookies
                        </h3>
                        <Badge
                          variant="outline"
                          className="text-xs border-green-500 text-green-400"
                        >
                          Optional
                        </Badge>
                      </div>
                      <Switch
                        checked={consent.personalization_storage}
                        onCheckedChange={(checked: boolean) =>
                          updateConsent("personalization_storage", checked)
                        }
                      />
                    </div>
                    <p className="text-sm text-gray-400">
                      Remember your settings, preferences, and personalized
                      content.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-700">
                  <CyberpunkButton
                    onClick={handleAcceptSelected}
                    variant="primary"
                    size="md"
                    className="flex-1"
                  >
                    Save Preferences
                  </CyberpunkButton>
                  <CyberpunkButton
                    onClick={handleRejectAll}
                    variant="secondary"
                    size="md"
                    className="flex-1"
                  >
                    Essential Only
                  </CyberpunkButton>
                </div>

                <div className="text-xs text-gray-500">
                  You can change these preferences anytime via our{" "}
                  <Link
                    href="/legal/cookies"
                    className="text-cyan-400 hover:underline"
                  >
                    Cookie Policy
                  </Link>
                  .
                </div>
              </div>
            )}
          </div>

          {!reducedAnimations && (
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
