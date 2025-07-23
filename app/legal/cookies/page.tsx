"use client";

import React, { useState, useEffect } from "react";
import { HologramContainer } from "@/components/custom/hologram-container";
import { GlitchText } from "@/components/custom/glitch-text";
import { DecoDivider } from "@/components/custom/deco-divider";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CyberpunkButton } from "@/components/custom/cyber-button";

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

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

export default function CookiePolicy() {
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true,
    ad_storage: false,
    ad_user_data: false,
    ad_personalization: false,
    analytics_storage: false,
    functionality_storage: true,
    personalization_storage: false,
    security_storage: true,
  });
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // Load current consent settings
    const storedConsent = localStorage.getItem("cookieConsent");
    if (storedConsent) {
      try {
        const parsedConsent = JSON.parse(storedConsent);
        setConsent(parsedConsent);
      } catch (e) {
        console.error("Error parsing stored consent:", e);
      }
    }
    setHasLoaded(true);
  }, []);

  const updateConsent = (category: keyof CookieConsent, value: boolean) => {
    // Prevent changing truly essential cookies
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

  const saveConsent = () => {
    localStorage.setItem("cookieConsent", JSON.stringify(consent));

    // Update GTM consent mode if available
    if (window.gtag) {
      window.gtag("consent", "update", {
        ad_storage: consent.ad_storage ? "granted" : "denied",
        ad_user_data: consent.ad_user_data ? "granted" : "denied",
        ad_personalization: consent.ad_personalization ? "granted" : "denied",
        analytics_storage: consent.analytics_storage ? "granted" : "denied",
        functionality_storage: consent.functionality_storage
          ? "granted"
          : "denied",
        personalization_storage: consent.personalization_storage
          ? "granted"
          : "denied",
        security_storage: consent.security_storage ? "granted" : "denied",
      });
    }

    // Show success message or reload page
    window.location.reload();
  };

  const clearAllCookies = () => {
    const minimalConsent = {
      necessary: true,
      ad_storage: false,
      ad_user_data: false,
      ad_personalization: false,
      analytics_storage: false,
      functionality_storage: true,
      personalization_storage: false,
      security_storage: true,
    };
    setConsent(minimalConsent);
    localStorage.setItem("cookieConsent", JSON.stringify(minimalConsent));
    localStorage.removeItem("cookiesAccepted");

    // Clear GTM consent
    if (window.gtag) {
      window.gtag("consent", "update", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "denied",
        functionality_storage: "granted",
        personalization_storage: "denied",
        security_storage: "granted",
      });
    }

    window.location.reload();
  };
  return (
    <div className="container mx-auto px-4 py-12 pt-32">
      <div className="mb-8 text-center">
        <GlitchText
          className="text-4xl font-bold tracking-wider mb-2"
          intensity="medium"
        >
          COOKIE POLICY
        </GlitchText>
        <p className="text-neon-cyan text-sm">Last Updated: July 23, 2025</p>
      </div>

      <DecoDivider className="my-8" variant="neon" />

      <div className="max-w-4xl mx-auto space-y-8">
        <HologramContainer variant="neon" className="p-6" intensity="low">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-cyan">
              What Are Cookies?
            </h2>
            <p className="mb-4 text-gray-300">
              Cookies are small text files that are placed on your computer or
              mobile device when you visit a website. They are widely used to
              make websites work, or work more efficiently, as well as to
              provide information to the owners of the site. This policy
              explains how and why we use cookies on our website.
            </p>
          </section>
        </HologramContainer>

        <HologramContainer variant="holo" className="p-6" intensity="low">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-purple">
              Authentication & Security Cookies
            </h2>
            <p className="mb-4 text-gray-300">
              These cookies are essential for secure user authentication and
              protection against security threats.
            </p>
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-neon-purple/30">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-lg font-semibold text-neon-purple">
                    __Host-authjs.*
                  </h4>
                  <Badge
                    variant="outline"
                    className="text-xs border-red-500 text-red-400"
                  >
                    Essential
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  <strong>Purpose:</strong> Protects against Cross-Site Request
                  Forgery (CSRF) attacks and manages authentication state
                </p>
                <p className="text-sm text-gray-400 mb-2">
                  <strong>Duration:</strong> Session cookies are deleted when
                  browser closes
                </p>
                <p className="text-sm text-gray-400">
                  <strong>Security:</strong> HttpOnly, Secure, SameSite=Lax with
                  additional Host prefix security
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-neon-purple/30">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-lg font-semibold text-neon-purple">
                    __Secure-authjs.*
                  </h4>
                  <Badge
                    variant="outline"
                    className="text-xs border-red-500 text-red-400"
                  >
                    Essential
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  <strong>Purpose:</strong> Manages authentication sessions,
                  callback URLs, and user login state
                </p>
                <p className="text-sm text-gray-400 mb-2">
                  <strong>Duration:</strong> Session and persistent cookies with
                  varying lifespans based on functionality
                </p>
                <p className="text-sm text-gray-400">
                  <strong>Security:</strong> HttpOnly, Secure, SameSite=Lax with
                  Secure prefix
                </p>
              </div>
            </div>
          </section>
        </HologramContainer>

        <HologramContainer variant="glitch" className="p-6" intensity="low">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-pink">
              Analytics & Performance Cookies
            </h2>
            <p className="mb-4 text-gray-300">
              These cookies help us understand how visitors interact with our
              website by collecting and reporting information anonymously.
            </p>
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-neon-pink/30">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-lg font-semibold text-neon-pink">_ga*</h4>
                  <Badge
                    variant="outline"
                    className="text-xs border-yellow-500 text-yellow-400"
                  >
                    Analytics
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  <strong>Purpose:</strong> Google Analytics - tracks website
                  usage, user behavior, and site performance metrics
                </p>
                <p className="text-sm text-gray-400 mb-2">
                  <strong>Duration:</strong> Up to 2 years depending on the
                  specific cookie
                </p>
                <p className="text-sm text-gray-400">
                  <strong>Provider:</strong> Google Analytics / Google Analytics
                  4
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-neon-pink/30">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-lg font-semibold text-neon-pink">
                    ph_phc_*
                  </h4>
                  <Badge
                    variant="outline"
                    className="text-xs border-yellow-500 text-yellow-400"
                  >
                    Analytics
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  <strong>Purpose:</strong> PostHog analytics - tracks user
                  behavior, product analytics, and feature usage
                </p>
                <p className="text-sm text-gray-400 mb-2">
                  <strong>Duration:</strong> Up to 1 year for user
                  identification and session tracking
                </p>
                <p className="text-sm text-gray-400">
                  <strong>Provider:</strong> PostHog
                </p>
              </div>
            </div>
          </section>
        </HologramContainer>

        <HologramContainer variant="neon" className="p-6" intensity="low">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-cyan">
              Security & Protection Cookies
            </h2>
            <p className="mb-4 text-gray-300">
              These cookies provide additional security layers and protection
              against malicious activities.
            </p>
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-neon-cyan/30">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-lg font-semibold text-neon-cyan">
                    cf_clearance
                  </h4>
                  <Badge
                    variant="outline"
                    className="text-xs border-blue-500 text-blue-400"
                  >
                    Security
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  <strong>Purpose:</strong> Cloudflare security - proves you
                  passed a security challenge and helps protect against bot
                  attacks
                </p>
                <p className="text-sm text-gray-400 mb-2">
                  <strong>Duration:</strong> Up to 1 year for security
                  verification
                </p>
                <p className="text-sm text-gray-400">
                  <strong>Provider:</strong> Cloudflare
                </p>
              </div>
            </div>
          </section>
        </HologramContainer>

        <HologramContainer variant="holo" className="p-6" intensity="low">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-purple">
              Marketing & Tracking Cookies
            </h2>
            <p className="mb-4 text-gray-300">
              These cookies are used for marketing purposes and to track user
              interactions across different platforms.
            </p>
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-neon-purple/30">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-lg font-semibold text-neon-purple">
                    rl_*
                  </h4>
                  <Badge
                    variant="outline"
                    className="text-xs border-purple-500 text-purple-400"
                  >
                    Marketing
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  <strong>Purpose:</strong> RudderStack - comprehensive user
                  tracking including anonymous identification, session tracking,
                  user journey analysis, referrer tracking, and user trait
                  collection for marketing and analytics
                </p>
                <p className="text-sm text-gray-400 mb-2">
                  <strong>Duration:</strong> Various durations up to 1 year
                  depending on the specific tracking function
                </p>
                <p className="text-sm text-gray-400">
                  <strong>Provider:</strong> RudderStack (Customer Data
                  Platform)
                </p>
              </div>
            </div>
          </section>
        </HologramContainer>

        <HologramContainer variant="glitch" className="p-6" intensity="low">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-pink">
              Local Storage Data
            </h2>
            <p className="mb-4 text-gray-300">
              In addition to cookies, we also store certain preferences locally
              in your browser to enhance your experience.
            </p>
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-neon-pink/30">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-lg font-semibold text-neon-pink">
                    cookiesAccepted
                  </h4>
                  <Badge
                    variant="outline"
                    className="text-xs border-green-500 text-green-400"
                  >
                    Preference
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  <strong>Purpose:</strong> Remembers that you have seen and
                  interacted with our cookie banner
                </p>
                <p className="text-sm text-gray-400 mb-2">
                  <strong>Value:</strong> true/false
                </p>
                <p className="text-sm text-gray-400">
                  <strong>Duration:</strong> Persistent (until manually cleared)
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-neon-pink/30">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-lg font-semibold text-neon-pink">
                    cookieConsent
                  </h4>
                  <Badge
                    variant="outline"
                    className="text-xs border-green-500 text-green-400"
                  >
                    Preference
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  <strong>Purpose:</strong> Stores your detailed cookie consent
                  preferences for each category
                </p>
                <p className="text-sm text-gray-400 mb-2">
                  <strong>Value:</strong> JSON object with consent settings
                </p>
                <p className="text-sm text-gray-400">
                  <strong>Duration:</strong> Persistent (until manually cleared)
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-neon-pink/30">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-lg font-semibold text-neon-pink">
                    reducedAnimations
                  </h4>
                  <Badge
                    variant="outline"
                    className="text-xs border-green-500 text-green-400"
                  >
                    Preference
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  <strong>Purpose:</strong> Stores your animation preferences
                  for accessibility and performance
                </p>
                <p className="text-sm text-gray-400 mb-2">
                  <strong>Value:</strong> true/false
                </p>
                <p className="text-sm text-gray-400">
                  <strong>Duration:</strong> Persistent (until manually cleared)
                </p>
              </div>
            </div>
          </section>
        </HologramContainer>

        <HologramContainer variant="neon" className="p-6" intensity="low">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-cyan">
              Manage Your Cookie Preferences
            </h2>
            <p className="mb-6 text-gray-300">
              You can adjust your cookie preferences below. Changes will take
              effect immediately.
            </p>

            {hasLoaded && (
              <div className="space-y-4 mb-6">
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

                {/* Analytics Cookies */}
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

                {/* Advertising Cookies */}
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

                {/* Personalization Cookies */}
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
            )}

            <div className="flex gap-4">
              <CyberpunkButton
                onClick={saveConsent}
                variant="primary"
                size="md"
              >
                Save Preferences
              </CyberpunkButton>
              <CyberpunkButton
                onClick={clearAllCookies}
                variant="danger"
                size="md"
              >
                Reset All Cookies
              </CyberpunkButton>
            </div>

            <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
              <p className="text-sm text-yellow-200">
                <strong>Note:</strong> After changing your preferences, the page
                will reload to apply the new settings. Some changes may require
                clearing your browser cache to take full effect.
              </p>
            </div>
          </section>
        </HologramContainer>

        <HologramContainer variant="holo" className="p-6" intensity="low">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-purple">
              Cookie Categories & Legal Basis
            </h2>
            <div className="space-y-4 text-gray-300">
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-semibold text-red-400 mb-2">
                  Strictly Necessary Cookies
                </h4>
                <p className="text-sm">
                  These cookies are essential for the website to function
                  properly. They cannot be disabled as they are necessary for
                  core functionality like authentication and security.
                  <br />
                  <strong>Legal Basis:</strong> Legitimate Interest (Article
                  6(1)(f) GDPR)
                </p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-semibold text-yellow-400 mb-2">
                  Analytics Cookies
                </h4>
                <p className="text-sm">
                  These cookies help us understand how visitors interact with
                  our website by collecting information anonymously. We use this
                  data to improve website performance.
                  <br />
                  <strong>Legal Basis:</strong> Consent (Article 6(1)(a) GDPR)
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-purple-400 mb-2">
                  Marketing Cookies
                </h4>
                <p className="text-sm">
                  These cookies track your browsing habits to enable us to show
                  advertising which is more likely to be of interest to you, and
                  to track the effectiveness of advertising.
                  <br />
                  <strong>Legal Basis:</strong> Consent (Article 6(1)(a) GDPR)
                </p>
              </div>
            </div>
          </section>
        </HologramContainer>

        <HologramContainer variant="holo" className="p-6" intensity="low">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-purple">
              Managing Your Cookie Preferences
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                You have the right to manage your cookie preferences. Here are
                your options:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Browser Settings:</strong> You can configure your
                  browser to refuse all cookies or indicate when a cookie is
                  being sent. However, some website features may not function
                  properly.
                </li>
                <li>
                  <strong>Opt-out Links:</strong>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>
                      Google Analytics:{" "}
                      <a
                        href="https://tools.google.com/dlpage/gaoptout"
                        className="text-neon-cyan hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Google Analytics Opt-out
                      </a>
                    </li>
                    <li>
                      PostHog: You can opt-out directly in your browser settings
                      or through PostHog&apos;s opt-out mechanisms
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Cookie Banner:</strong> When you first visit our site,
                  you can choose which types of cookies to accept through our
                  cookie consent banner.
                </li>
              </ul>
            </div>
          </section>
        </HologramContainer>

        <HologramContainer variant="glitch" className="p-6" intensity="low">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-pink">
              Third-Party Services
            </h2>
            <div className="space-y-4 text-gray-300">
              <p className="mb-4">
                We use the following third-party services that may set their own
                cookies:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-semibold text-neon-cyan mb-2">
                    Google Analytics
                  </h4>
                  <p className="text-sm">
                    Provides website analytics and user behavior insights.
                    <br />
                    <a
                      href="https://policies.google.com/privacy"
                      className="text-neon-cyan hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Google Privacy Policy
                    </a>
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-semibold text-neon-purple mb-2">
                    PostHog
                  </h4>
                  <p className="text-sm">
                    Product analytics and user behavior tracking.
                    <br />
                    <a
                      href="https://posthog.com/privacy"
                      className="text-neon-purple hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      PostHog Privacy Policy
                    </a>
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-semibold text-neon-pink mb-2">
                    RudderStack
                  </h4>
                  <p className="text-sm">
                    Customer data platform for analytics and marketing.
                    <br />
                    <a
                      href="https://rudderstack.com/privacy-policy/"
                      className="text-neon-pink hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      RudderStack Privacy Policy
                    </a>
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-semibold text-neon-cyan mb-2">
                    Cloudflare
                  </h4>
                  <p className="text-sm">
                    Content delivery network and security services.
                    <br />
                    <a
                      href="https://www.cloudflare.com/privacypolicy/"
                      className="text-neon-cyan hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Cloudflare Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </HologramContainer>

        <HologramContainer variant="neon" className="p-6" intensity="low">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-cyan">
              Your Rights Under GDPR
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Under the General Data Protection Regulation (GDPR), you have
                the following rights:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Right to Access:</strong> Request information about
                  the personal data we process
                </li>
                <li>
                  <strong>Right to Rectification:</strong> Request correction of
                  inaccurate personal data
                </li>
                <li>
                  <strong>Right to Erasure:</strong> Request deletion of your
                  personal data
                </li>
                <li>
                  <strong>Right to Restrict Processing:</strong> Request
                  limitation of data processing
                </li>
                <li>
                  <strong>Right to Data Portability:</strong> Request transfer
                  of your data to another service
                </li>
                <li>
                  <strong>Right to Object:</strong> Object to processing based
                  on legitimate interests
                </li>
                <li>
                  <strong>Right to Withdraw Consent:</strong> Withdraw consent
                  for cookie usage at any time
                </li>
              </ul>
              <p className="mt-4">
                To exercise any of these rights, please contact us through our
                <a
                  href="https://bogdanmihalca.com#contact"
                  className="text-neon-cyan hover:underline ml-1"
                >
                  contact form
                </a>
                or refer to our
                <a
                  href="/legal/privacy"
                  className="text-neon-cyan hover:underline ml-1"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </section>
        </HologramContainer>

        <HologramContainer variant="holo" className="p-6" intensity="low">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-purple">
              Changes to This Policy
            </h2>
            <p className="mb-4 text-gray-300">
              We may update this Cookie Policy from time to time to reflect
              changes in our practices, technologies, legal requirements, or
              other factors. When we make changes, we will update the &quot;Last
              Updated&quot; date at the top of this policy.
            </p>
            <p className="text-gray-300">
              We encourage you to review this policy periodically to stay
              informed about how we use cookies and protect your information.
            </p>
          </section>
        </HologramContainer>

        <HologramContainer variant="glitch" className="p-6" intensity="low">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-pink">
              Contact Information
            </h2>
            <p className="mb-4 text-gray-300">
              If you have questions about this Cookie Policy, our use of
              cookies, or wish to exercise your rights regarding cookies, please
              contact us:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>
                Through our{" "}
                <a
                  href="https://bogdanmihalca.com#contact"
                  className="text-neon-pink hover:underline"
                >
                  contact form
                </a>
              </li>
              <li>By email (address available on our contact page)</li>
              <li>
                For data protection matters, you can also contact your local
                supervisory authority
              </li>
            </ul>
          </section>
        </HologramContainer>
      </div>

      <DecoDivider className="my-8" variant="holo" />
    </div>
  );
}
