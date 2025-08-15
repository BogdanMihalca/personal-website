import { AnimatedStars } from "@/components/custom/animated-stars";
import CookiePolicy from "@/components/custom/cookie-policy";
import { EnergyMouseField } from "@/components/custom/energy-mouse-field";
import { Footer } from "@/components/custom/footer";
import { Navbar } from "@/components/custom/navbar";
import { Terminal } from "@/components/custom/terminal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/sonner";
import { PerformanceProvider } from "@/lib/contexts/performance-mode";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { audiowide } from "./fonts";
import { GoogleTagManager } from "@next/third-parties/google";
import Script from "next/script";

import "./globals.css";

export const metadata: Metadata = {
  title: "Bogdan Mihalca | Personal Website",
  description:
    "Cyberpunk-themed portfolio showcasing my work and skills in web development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${audiowide.variable} ${audiowide.className}`}>
      <GoogleTagManager gtmId="GTM-WW7NBMHC" />
      {/* Initialize GTM consent defaults */}
      <Script id="gtm-consent-init" strategy="beforeInteractive" defer>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          
          // Set default consent to denied for all non-essential cookies
          gtag('consent', 'default', {
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'analytics_storage': 'denied',
            'functionality_storage': 'granted',
            'personalization_storage': 'denied',
            'security_storage': 'granted'
          });
          
          // Check for existing consent and update accordingly
          const storedConsent = localStorage.getItem('cookieConsent');
          if (storedConsent) {
            try {
              const consent = JSON.parse(storedConsent);
              gtag('consent', 'update', {
                'ad_storage': consent.ad_storage ? 'granted' : 'denied',
                'ad_user_data': consent.ad_user_data ? 'granted' : 'denied',
                'ad_personalization': consent.ad_personalization ? 'granted' : 'denied',
                'analytics_storage': consent.analytics_storage ? 'granted' : 'denied',
                'functionality_storage': consent.functionality_storage ? 'granted' : 'denied',
                'personalization_storage': consent.personalization_storage ? 'granted' : 'denied',
                'security_storage': consent.security_storage ? 'granted' : 'denied'
              });
            } catch (e) {
              console.error('Error parsing stored consent:', e);
            }
          }
        `}
      </Script>
      <body>
        <SessionProvider>
          <PerformanceProvider>
            <div className="min-h-screen bg-black text-gray-100 relative overflow-x-hidden pt-10 lg:pt-0">
              <div className="fixed inset-0 bg-space-grid opacity-20 z-0" />

              <EnergyMouseField />
              <AnimatedStars />
              <Navbar />
              <ScrollArea>{children}</ScrollArea>
              <Terminal />
              <Footer />
              <CookiePolicy />
              <Toaster
                position="bottom-right"
                offset={{ bottom: 50, right: 100 }}
              />
            </div>
          </PerformanceProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
