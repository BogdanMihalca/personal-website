"use client";
import { useState } from "react";
import { GlitchText } from "@/components/custom/glitch-text";
import { DecoDivider } from "@/components/custom/deco-divider";
import { HologramContainer } from "@/components/custom/hologram-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  requestType: z.string().min(1, {
    message: "Please select a deletion request type.",
  }),
  details: z.string().min(10, {
    message: "Details must be at least 10 characters.",
  }),
  confirmation: z.boolean().refine((val) => val === true, {
    message: "You must confirm that you are the owner of this data.",
  }),
});

const DataDeletionPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      requestType: "",
      details: "",
      confirmation: false,
    },
  });

  // eslint-disable-next-line
  async function onSubmit(values: any) {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/data-deletion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to send deletion request");
      }

      setSubmitSuccess(true);
      form.reset();
    } catch (error) {
      setSubmitError("Failed to submit your request. Please try again later.");
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 pt-32">
      <div className="mb-8 text-center">
        <GlitchText
          className="text-4xl font-bold tracking-wider mb-2"
          intensity="medium"
        >
          DATA DELETION POLICY
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
              This Data Deletion Policy outlines the procedures and
              responsibilities for the deletion of personal data collected by
              this website. We are committed to ensuring that your personal
              information is handled in accordance with applicable data
              protection laws and regulations, including GDPR, CCPA, and other
              relevant privacy frameworks.
            </p>
            <p className="text-gray-300">
              We respect your right to control your personal information and
              provide transparent processes for requesting the deletion of your
              data from our systems.
            </p>
          </section>
        </HologramContainer>

        <HologramContainer variant="holo" className="p-6" intensity="medium">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-purple">
              Data We Collect
            </h2>
            <p className="mb-4 text-gray-300">
              We may collect and process the following types of personal
              information:
            </p>
            <ul className="list-disc list-inside text-gray-300 ml-4 space-y-2">
              <li>Identity information (name, username)</li>
              <li>Contact information (email address, phone number)</li>
              <li>
                Technical data (IP address, browser information, device details)
              </li>
              <li>Usage data (how you interact with our website)</li>
              <li>Communication preferences and marketing choices</li>
            </ul>
          </section>
        </HologramContainer>

        <HologramContainer variant="neon" className="p-6" intensity="low">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-cyan">
              Data Retention
            </h2>
            <p className="mb-4 text-gray-300">
              We retain your personal information only for as long as necessary
              to fulfill the purposes for which we collected it, including to
              satisfy legal requirements, resolve disputes, and enforce our
              agreements. Different types of data may be kept for different
              periods based on operational and legal considerations.
            </p>
          </section>
        </HologramContainer>

        <HologramContainer variant="holo" className="p-6" intensity="low">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-purple">
              Data Deletion Procedures
            </h2>
            <p className="mb-4 text-gray-300">
              If you wish to request the deletion of your personal data, you
              may:
            </p>
            <ol className="list-decimal list-inside text-gray-300 ml-4 space-y-2">
              <li>Submit a request through our contact form below</li>
              <li>Email us directly at privacy@example.com</li>
              <li>
                Use the account deletion option in your profile settings (if
                applicable)
              </li>
            </ol>
            <p className="mt-4 text-gray-300">
              Upon receiving your request, we will:
            </p>
            <ul className="list-disc list-inside text-gray-300 ml-4 space-y-2">
              <li>Verify your identity to ensure data security</li>
              <li>Process your request within 30 days</li>
              <li>Notify you when the deletion is complete</li>
              <li>Provide a confirmation of data removal</li>
            </ul>
          </section>
        </HologramContainer>

        <HologramContainer variant="neon" className="p-6" intensity="medium">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neon-cyan">
              Exceptions to Deletion
            </h2>
            <p className="mb-4 text-gray-300">
              In some circumstances, we may be unable to delete certain
              information due to:
            </p>
            <ul className="list-disc list-inside text-gray-300 ml-4 space-y-2">
              <li>Legal obligations requiring data retention</li>
              <li>
                Legitimate business purposes (with appropriate safeguards)
              </li>
              <li>
                Technical limitations (including backup systems that cycle
                periodically)
              </li>
              <li>Anonymized data that no longer identifies you</li>
            </ul>
            <p className="mt-4 text-gray-300">
              We will clearly explain any limitations to your deletion request
              and provide alternative solutions where possible.
            </p>
          </section>
        </HologramContainer>

        <HologramContainer variant="holo" className="p-6 mb-8" intensity="high">
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-neon-purple">
              Data Deletion Request
            </h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Your Name"
                              className="bg-black/20 border border-neon-purple/30 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-neon-pink text-xs mt-1" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Your Email"
                              className="bg-black/20 border border-neon-purple/30 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-neon-pink text-xs mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="requestType"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <select
                            className="w-full p-2 bg-black/20 border border-neon-purple/30 text-white rounded-md focus:outline-none"
                            {...field}
                          >
                            <option value="">
                              Select Deletion Request Type
                            </option>
                            <option value="full-account">
                              Full Account Deletion
                            </option>
                            <option value="specific-data">
                              Specific Data Only
                            </option>
                            <option value="marketing-data">
                              Marketing Data Only
                            </option>
                            <option value="other">
                              Other (Please Specify)
                            </option>
                          </select>
                        </FormControl>
                        <FormMessage className="text-neon-pink text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="details"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Please provide details about your data deletion request, including any specific information you want removed and relevant identifiers (usernames, account IDs, etc.)"
                            className="min-h-[150px] bg-black/20 border border-neon-purple/30 text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-neon-pink text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmation"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <FormControl>
                            <input
                              type="checkbox"
                              id="confirm"
                              className="mr-2 accent-neon-purple"
                              checked={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <label
                            htmlFor="confirm"
                            className="text-gray-300 text-sm"
                          >
                            I confirm that I am the owner of this data and
                            understand that deletion may be permanent
                          </label>
                        </div>
                        <FormMessage className="text-neon-pink text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  {submitError && (
                    <div className="p-3 bg-red-900/30 border border-red-500 text-red-300 rounded-sm">
                      {submitError}
                    </div>
                  )}

                  {submitSuccess && (
                    <div className="p-3 bg-green-900/30 border border-green-500 text-green-300 rounded-sm">
                      Your data deletion request has been submitted
                      successfully. You will receive an email confirmation
                      shortly.
                    </div>
                  )}

                  <div className="text-center md:text-left">
                    <Button
                      type="submit"
                      className="bg-neon-purple hover:bg-neon-purple/80 text-white px-8 py-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Processing..."
                        : "Submit Deletion Request"}
                    </Button>
                  </div>
                </div>

                <div className="border-t border-neon-purple/20 pt-4 mt-4">
                  <p className="text-sm text-gray-400">
                    After submitting your request, you will receive an email
                    confirmation with a reference number. We will process your
                    request within 30 days as required by applicable privacy
                    regulations.
                  </p>
                </div>
              </form>
            </Form>
          </section>
        </HologramContainer>

        <div className="text-center mt-8 mb-12">
          <p className="text-gray-400 text-sm">
            For urgent data concerns, please email:{" "}
            <span className="text-neon-cyan">contact@bogdanmihalca.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataDeletionPage;
