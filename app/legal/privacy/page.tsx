"use client";

import React from "react";
import { HologramContainer } from "@/components/custom/hologram-container";
import { GlitchText } from "@/components/custom/glitch-text";
import { DecoDivider } from "@/components/custom/deco-divider";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 pt-32">
      <div className="mb-8 text-center">
        <GlitchText
          className="text-4xl font-bold tracking-wider mb-2"
          intensity="medium"
        >
          PRIVACY POLICY
        </GlitchText>
        <p className="text-neon-cyan text-sm">Last Updated: April 6, 2025</p>
      </div>

      <DecoDivider className="my-8" variant="neon" />

      <div className="max-w-4xl mx-auto space-y-8">
        <HologramContainer variant="neon" className="p-6" intensity="low">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-cyan">
              Introduction
            </h2>
            <p className="mb-4 text-gray-300">
              This Privacy Policy describes how your personal information is
              collected, used, and shared when you visit this website.
            </p>
          </section>
        </HologramContainer>

        <HologramContainer variant="holo" className="p-6" intensity="low">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-purple">
              Personal Information We Collect
            </h2>
            <p className="mb-4 text-gray-300">
              When you visit the website, we automatically collect certain
              information about your device, including information about your
              web browser, IP address, time zone, and some of the cookies that
              are installed on your device. Additionally, as you browse the
              site, we collect information about the individual web pages that
              you view, what websites or search terms referred you to the site,
              and information about how you interact with the site. We refer to
              this automatically-collected information as &quot;Device
              Information.&quot;
            </p>
            <p className="mb-4 text-gray-300">
              We collect Device Information using the following technologies:
            </p>
            <ul className="list-disc pl-8 mb-4 text-gray-300">
              <li className="mb-2">
                &quot;Cookies&quot; are data files that are placed on your
                device or computer and often include an anonymous unique
                identifier. For more information about cookies, and how to
                disable cookies, visit http://www.allaboutcookies.org.
              </li>
              <li className="mb-2">
                &quot;Log files&quot; track actions occurring on the Site, and
                collect data including your IP address, browser type, Internet
                service provider, referring/exit pages, and date/time stamps.
              </li>
            </ul>
            <p className="mb-4 text-gray-300">
              When we talk about &quot;Personal Information&quot; in this
              Privacy Policy, we are talking both about Device Information and
              Contact Information.
            </p>
          </section>
        </HologramContainer>

        <HologramContainer variant="neon" className="p-6" intensity="low">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-cyan">
              How Do We Use Your Personal Information?
            </h2>
            <p className="mb-4 text-gray-300">
              We use the Device Information that we collect to help us screen
              for potential risk and fraud (in particular, your IP address), and
              more generally to improve and optimize our Site (for example, by
              generating analytics about how our visitors browse and interact
              with the Site).
            </p>
            <p className="mb-4 text-gray-300">
              We may share your Personal Information to comply with applicable
              laws and regulations, to respond to a subpoena, search warrant or
              other lawful request for information we receive, or to otherwise
              protect our rights.
            </p>
          </section>
        </HologramContainer>

        <HologramContainer variant="glitch" className="p-6" intensity="low">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-pink">
              Behavioral Advertising
            </h2>
            <p className="mb-4 text-gray-300">
              We use your Personal Information to provide you with targeted
              advertisements or marketing communications we believe may be of
              interest to you. For more information about how targeted
              advertising works, you can visit the Network Advertising
              Initiative&apos;s educational page at
              http://www.networkadvertising.org/understanding-online-advertising.
            </p>
          </section>
        </HologramContainer>

        <HologramContainer variant="holo" className="p-6" intensity="low">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-purple">
              Your Rights
            </h2>
            <p className="mb-4 text-gray-300">
              If you are a European resident, you have the right to access
              personal information we hold about you and to ask that your
              personal information be corrected, updated, or deleted. If you
              would like to exercise this right, please contact us through the
              contact form on our website.
            </p>
            <p className="mb-4 text-gray-300">
              Additionally, if you are a European resident, we note that we are
              processing your information in order to fulfill contracts we might
              have with you, or otherwise to pursue our legitimate business
              interests listed above. Please note that your information may be
              transferred outside of Europe, including to Canada and the United
              States.
            </p>
          </section>
        </HologramContainer>

        <HologramContainer variant="neon" className="p-6" intensity="low">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-cyan">
              Data Retention
            </h2>
            <p className="mb-4 text-gray-300">
              When you submit your contact information through the site, we will
              maintain your information for our records unless and until you ask
              us to delete this information. For more details, please refer to
              our
              <a
                href="/legal/data-deletion"
                className="text-neon-pink hover:underline ml-1"
              >
                Data Deletion Policy
              </a>
              .
            </p>
          </section>
        </HologramContainer>

        <HologramContainer variant="glitch" className="p-6" intensity="low">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-pink">
              Changes
            </h2>
            <p className="mb-4 text-gray-300">
              We may update this privacy policy from time to time in order to
              reflect, for example, changes to our practices or for other
              operational, legal or regulatory reasons.
            </p>
          </section>
        </HologramContainer>

        <HologramContainer variant="holo" className="p-6" intensity="low">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-purple">
              Contact Us
            </h2>
            <p className="mb-4 text-gray-300">
              For more information about our privacy practices, if you have
              questions, or if you would like to make a complaint, please
              contact us using the contact form on this website or via email.
            </p>
          </section>
        </HologramContainer>
      </div>

      <DecoDivider className="my-8" variant="holo" />
    </div>
  );
}
