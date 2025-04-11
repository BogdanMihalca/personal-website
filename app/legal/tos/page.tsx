"use client";

import React from "react";
import { HologramContainer } from "@/components/custom/hologram-container";
import { GlitchText } from "@/components/custom/glitch-text";
import { DecoDivider } from "@/components/custom/deco-divider";

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-12 pt-32">
      <div className="mb-8 text-center">
        <GlitchText
          className="text-4xl font-bold tracking-wider mb-2"
          intensity="medium"
        >
          TERMS OF SERVICE
        </GlitchText>
        <p className="text-neon-cyan text-sm">Last Updated: April 6, 2025</p>
      </div>

      <DecoDivider className="my-8" variant="neon" />

      <div className="max-w-4xl mx-auto space-y-8">
        <HologramContainer variant="neon" className="p-6" intensity="low">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-cyan">
              1. Introduction
            </h2>
            <p className="mb-4 text-gray-300">
              Welcome to my personal website. By accessing or using this
              website, you agree to be bound by these Terms of Service
              (&quot;Terms&quot;), our Privacy Policy, and all applicable laws
              and regulations. If you do not agree with any of these terms, you
              are prohibited from using or accessing this website.
            </p>
          </section>
        </HologramContainer>

        <HologramContainer variant="holo" className="p-6" intensity="low">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-purple">
              2. Definitions
            </h2>
            <p className="mb-2 text-gray-300">
              For the purposes of these Terms:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-300">
              <li>&quot;Website&quot; refers to this personal website.</li>
              <li>
                &quot;User,&quot; &quot;You,&quot; and &quot;Your&quot; refer to
                you, the person accessing this website.
              </li>
              <li>
                &quot;Owner,&quot; &quot;I,&quot; &quot;Me,&quot; and
                &quot;My&quot; refer to the website owner.
              </li>
              <li>
                &quot;Content&quot; includes text, images, audio, video, or
                other material published on this Website.
              </li>
              <li>
                &quot;Services&quot; refers to any features, applications, or
                services offered through the Website.
              </li>
            </ul>
          </section>
        </HologramContainer>

        <HologramContainer variant="neon" className="p-6" intensity="low">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-cyan">
              3. User Accounts
            </h2>
            <p className="mb-4 text-gray-300">
              To access certain features of the Website, you may be required to
              register for an account. When you register, you agree to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-300">
              <li>Provide accurate, current, and complete information.</li>
              <li>Maintain and promptly update your account information.</li>
              <li>Maintain the security of your account and password.</li>
              <li>
                Accept all responsibility for any activity that occurs under
                your account.
              </li>
              <li>
                Notify me immediately of any unauthorized use of your account.
              </li>
            </ul>
            <p className="mb-4 text-gray-300">
              I reserve the right to terminate or suspend your account at any
              time for any reason, without notice or liability.
            </p>
          </section>
        </HologramContainer>

        <HologramContainer variant="glitch" className="p-6" intensity="low">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-pink">
              4. Third-Party Authentication
            </h2>
            <p className="mb-4 text-gray-300">
              This Website offers the option to register and log in using
              third-party services such as Google and Facebook. By using these
              services, you understand and agree that:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-300">
              <li>
                Your interaction with these third-party services is governed by
                their respective privacy policies and terms of service.
              </li>
              <li>
                I may collect certain information from these services as
                permitted by your privacy settings with those services.
              </li>
              <li>
                I am not responsible for any data processing conducted by these
                third-party services.
              </li>
              <li>
                You may revoke access to your third-party accounts at any time
                by adjusting your settings with those services.
              </li>
            </ul>
          </section>
        </HologramContainer>

        <HologramContainer variant="holo" className="p-6" intensity="low">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-purple">
              5. Location Data
            </h2>
            <p className="mb-4 text-gray-300">
              Certain features of this Website, including weather information
              and other location-based services, may request access to your
              location data. By using these features, you:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-300">
              <li>
                Consent to the collection, use, and sharing of your location
                data as necessary to provide these services.
              </li>
              <li>
                Understand that location data may be transmitted to third-party
                API providers to fulfill your requests.
              </li>
              <li>
                Acknowledge that you can disable location services through your
                browser or device settings, though this may limit your ability
                to use certain features of the Website.
              </li>
            </ul>
          </section>
        </HologramContainer>

        <HologramContainer variant="neon" className="p-6" intensity="low">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-cyan">
              6. User-Generated Content
            </h2>
            <p className="mb-4 text-gray-300">
              This Website may allow you to post, submit, or transmit content
              such as comments, reviews, or blog posts. By submitting content,
              you:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-300">
              <li>
                Grant me a worldwide, non-exclusive, royalty-free, transferable
                license to use, reproduce, distribute, prepare derivative works
                of, display, and perform such content.
              </li>
              <li>
                Represent and warrant that you own or have the necessary rights
                to post such content.
              </li>
              <li>
                Understand that I reserve the right to remove any content that
                violates these Terms or that I find objectionable for any
                reason.
              </li>
            </ul>
            <p className="mb-4 text-gray-300">
              You agree not to post content that:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-300">
              <li>
                Is unlawful, harmful, threatening, abusive, harassing,
                defamatory, vulgar, obscene, or invasive of another&apos;s
                privacy.
              </li>
              <li>Infringes upon intellectual property rights of others.</li>
              <li>
                Contains software viruses or any other code designed to disrupt,
                damage, or limit the functioning of any computer system.
              </li>
              <li>
                Constitutes unsolicited or unauthorized advertising, promotional
                materials, or spam.
              </li>
            </ul>
          </section>
        </HologramContainer>

        <HologramContainer variant="glitch" className="p-6" intensity="low">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-pink">
              7. Intellectual Property
            </h2>
            <p className="mb-4 text-gray-300">
              All content on this Website, including text, graphics, logos,
              icons, images, audio clips, digital downloads, and software, is my
              property or the property of my licensors and is protected by
              copyright, trademark, and other intellectual property laws.
            </p>
            <p className="mb-4 text-gray-300">
              You may access, use, and display the Website on a single computer
              or device and download and print pages for your personal,
              non-commercial use. You may not:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-300">
              <li>
                Modify, reproduce, duplicate, copy, or redistribute any content
                from this Website for commercial purposes.
              </li>
              <li>
                Remove any copyright, trademark, or other proprietary notices.
              </li>
              <li>
                Use any data mining, robots, or similar data gathering methods.
              </li>
            </ul>
          </section>
        </HologramContainer>

        <HologramContainer variant="holo" className="p-6" intensity="low">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-purple">
              8. Disclaimer of Warranties
            </h2>
            <p className="mb-4 text-gray-300">
              THIS WEBSITE AND ITS CONTENT ARE PROVIDED &quot;AS IS&quot; AND
              &quot;AS AVAILABLE&quot; WITHOUT ANY WARRANTIES OF ANY KIND,
              EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO,
              WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
              NON-INFRINGEMENT, OR COURSE OF PERFORMANCE.
            </p>
            <p className="mb-4 text-gray-300">
              I do not warrant that (1) the Website will function uninterrupted,
              secure, or available at any particular time or location; (2) any
              errors or defects will be corrected; (3) the Website is free of
              viruses or other harmful components; or (4) the results of using
              the Website will meet your requirements.
            </p>
          </section>
        </HologramContainer>

        <HologramContainer variant="neon" className="p-6" intensity="low">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-cyan">
              9. Limitation of Liability
            </h2>
            <p className="mb-4 text-gray-300">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, I SHALL NOT BE LIABLE FOR
              ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
              DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED
              DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR
              OTHER INTANGIBLE LOSSES, RESULTING FROM (1) YOUR ACCESS TO OR USE
              OF OR INABILITY TO ACCESS OR USE THE WEBSITE; (2) ANY CONDUCT OR
              CONTENT OF ANY THIRD PARTY ON THE WEBSITE; (3) ANY CONTENT
              OBTAINED FROM THE WEBSITE; AND (4) UNAUTHORIZED ACCESS, USE, OR
              ALTERATION OF YOUR TRANSMISSIONS OR CONTENT.
            </p>
            <p className="mb-4 text-gray-300">
              IN NO EVENT SHALL MY TOTAL LIABILITY TO YOU FOR ALL CLAIMS EXCEED
              THE AMOUNT PAID BY YOU, IF ANY, FOR ACCESSING THE WEBSITE.
            </p>
          </section>
        </HologramContainer>

        <HologramContainer variant="glitch" className="p-6" intensity="low">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-pink">
              10. Third-Party Links
            </h2>
            <p className="mb-4 text-gray-300">
              This Website may contain links to third-party websites or services
              that are not owned or controlled by me. I have no control over and
              assume no responsibility for the content, privacy policies, or
              practices of any third-party websites or services. You further
              acknowledge and agree that I shall not be responsible or liable,
              directly or indirectly, for any damage or loss caused or alleged
              to be caused by or in connection with the use of or reliance on
              any such content, goods, or services available on or through any
              such websites or services.
            </p>
          </section>
        </HologramContainer>

        <div className="space-y-8">
          <HologramContainer variant="holo" className="p-6" intensity="low">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neon-purple">
                  11. Indemnification
                </h2>
                <p className="mb-4 text-gray-300">
                  You agree to defend, indemnify, and hold harmless me, my
                  affiliates, licensors, and service providers, and my and their
                  respective officers, directors, employees, contractors,
                  agents, licensors, suppliers, successors, and assigns from and
                  against any claims, liabilities, damages, judgments, awards,
                  losses, costs, expenses, or fees (including reasonable
                  attorneys&apos; fees) arising out of or relating to your
                  violation of these Terms or your use of the Website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neon-purple">
                  12. Governing Law
                </h2>
                <p className="mb-4 text-gray-300">
                  These Terms shall be governed and construed in accordance with
                  the laws of [Your Jurisdiction], without regard to its
                  conflict of law provisions. Any dispute arising from or
                  relating to these Terms shall be subject to the exclusive
                  jurisdiction of the courts in [Your Jurisdiction].
                </p>
              </section>
            </div>
          </HologramContainer>

          <HologramContainer variant="neon" className="p-6" intensity="low">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neon-cyan">
                  13. Changes to Terms
                </h2>
                <p className="mb-4 text-gray-300">
                  I reserve the right to modify or replace these Terms at any
                  time at my sole discretion. If a revision is material, I will
                  provide at least 30 days&apos; notice prior to any new terms
                  taking effect. What constitutes a material change will be
                  determined at my sole discretion. By continuing to access or
                  use the Website after those revisions become effective, you
                  agree to be bound by the revised Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neon-cyan">
                  14. Severability
                </h2>
                <p className="mb-4 text-gray-300">
                  If any provision of these Terms is held to be invalid or
                  unenforceable by a court, the remaining provisions of these
                  Terms will remain in effect.
                </p>
              </section>
            </div>
          </HologramContainer>

          <HologramContainer variant="glitch" className="p-6" intensity="low">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neon-pink">
                  15. Entire Agreement
                </h2>
                <p className="mb-4 text-gray-300">
                  These Terms constitute the entire agreement between you and me
                  regarding the Website and supersede all prior and
                  contemporaneous written or oral agreements between you and me.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neon-pink">
                  16. Contact Information
                </h2>
                <p className="mb-4 text-gray-300">
                  If you have any questions about these Terms, please contact me
                  at [contact@bogdanmihalca.com].
                </p>
              </section>
            </div>
          </HologramContainer>
        </div>
      </div>

      <DecoDivider className="my-8" variant="holo" />
    </div>
  );
}
