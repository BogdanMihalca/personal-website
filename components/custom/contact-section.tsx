"use client";
import { motion, useInView } from "framer-motion";
import { Github, Instagram, Linkedin, Mail, Send } from "lucide-react";
import { useRef, useState } from "react";
import { CyberpunkButton } from "./cyber-button";
import { GlitchText } from "./glitch-text";
import { HologramContainer } from "./hologram-container";
import { DecoDivider } from "./deco-divider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const socialLinks = [
  {
    name: "GitHub",
    icon: <Github className="w-5 h-5" />,
    url: "https://github.com/BogdanMihalca",
    color: "green-300",
  },
  {
    name: "LinkedIn",
    icon: <Linkedin className="w-5 h-5" />,
    url: "https://www.linkedin.com/in/bogdan-mihalca-76b2b7b3/",
    color: "neon-cyan",
  },
  {
    name: "Instagram",
    icon: <Instagram className="w-5 h-5" />,
    url: "https://www.instagram.com/mihalcabogdan/",
    color: "neon-pink",
  },
];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSubmitSuccess(true);
      form.reset();
    } catch (error) {
      setSubmitError("Failed to send your message. Please try again later.");
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-20 bg-space-black/30 overflow-hidden"
      id="contact"
    >
      <DecoDivider className="top-0 left-0 absolute opacity-70" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <div className="inline-block relative p-6">
            <GlitchText
              color="cyan"
              intensity="medium"
              className="text-xl md:text-2xl font-cyber"
            >
              Contact.ME
            </GlitchText>
            <div className="absolute -inset-2 bg-neon-cyan/15 blur-xl rounded-lg -z-10"></div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 text-neon-blue/80 max-w-2xl mx-auto"
          >
            Have a question or want to work together? Drop me a message below or
            connect with me on social media.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full"
          >
            <HologramContainer variant="neon" className="p-6 rounded-sm">
              <div className="mb-6">
                <h3 className="text-neon-cyan text-xl mb-2 flex items-center">
                  <span className="text-neon-pink mr-2">[</span>
                  <GlitchText color="cyan" intensity="low">
                    MESSAGE_PROTOCOL
                  </GlitchText>
                  <span className="text-neon-pink ml-2">]</span>
                </h3>
                <div className="h-[1px] w-full bg-gradient-to-r from-neon-cyan via-neon-pink to-transparent mb-4" />
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neon-cyan flex items-center">
                          <span className="text-neon-pink mr-1">&gt;</span> NAME
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your name"
                            className="border-neon-blue/30 focus-visible:border-neon-cyan focus-visible:ring-neon-cyan/30 bg-black/30"
                            {...field}
                            style={{
                              borderColor: "rgba(96, 165, 250, 0.3)",
                              outline: "none",
                            }}
                          />
                        </FormControl>
                        <FormMessage className="text-neon-pink" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neon-cyan flex items-center">
                          <span className="text-neon-pink mr-1">&gt;</span>{" "}
                          EMAIL
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your email"
                            className="border-neon-blue/30 focus-visible:border-neon-cyan focus-visible:ring-neon-cyan/30 bg-black/30"
                            {...field}
                            style={{
                              borderColor: "rgba(96, 165, 250, 0.3)",
                              outline: "none",
                            }}
                          />
                        </FormControl>
                        <FormMessage className="text-neon-pink" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neon-cyan flex items-center">
                          <span className="text-neon-pink mr-1">&gt;</span>{" "}
                          MESSAGE
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Your message here..."
                            className="border-neon-blue/30 focus-visible:border-neon-cyan focus-visible:ring-neon-cyan/30 bg-black/30 min-h-[120px]"
                            {...field}
                            style={{
                              borderColor: "rgba(96, 165, 250, 0.3)",
                              outline: "none",
                            }}
                          />
                        </FormControl>
                        <FormMessage className="text-neon-pink" />
                      </FormItem>
                    )}
                  />

                  {submitError && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-3 bg-red-900/30 border border-red-500 text-red-300 rounded-sm"
                    >
                      {submitError}
                    </motion.div>
                  )}

                  {submitSuccess && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-3 bg-green-900/30 border border-green-500 text-green-300 rounded-sm"
                    >
                      Message sent successfully! I&apos;ll get back to you soon.
                    </motion.div>
                  )}

                  <div
                    className="cf-turnstile"
                    data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                    data-theme="dark"
                    data-size="normal"
                    data-callback="onSuccess"
                  ></div>

                  <div className="pt-2">
                    <CyberpunkButton
                      type="submit"
                      disabled={isSubmitting}
                      loading={isSubmitting}
                      icon={<Send className="w-4 h-4" />}
                      variant="primary"
                    >
                      {isSubmitting ? "SENDING" : "SEND MESSAGE"}
                    </CyberpunkButton>
                  </div>
                </form>
              </Form>
            </HologramContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-full"
          >
            <HologramContainer variant="holo" className="p-6 h-full rounded-sm">
              <div className="mb-6">
                <h3 className="text-neon-pink text-xl mb-2 flex items-center">
                  <span className="text-neon-cyan mr-2">[</span>
                  <GlitchText color="fuchsia" intensity="low">
                    Contact
                  </GlitchText>
                  <span className="text-neon-cyan ml-2">]</span>
                </h3>
                <div className="h-[1px] w-full bg-gradient-to-r from-neon-pink via-neon-cyan to-transparent mb-4" />
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-neon-cyan mb-4 font-cyber text-lg">
                    DIRECT CONTACT
                  </h4>
                  <motion.a
                    href="mailto:contact@bogdanmihalca.com"
                    className="flex items-center space-x-3 p-3  bg-black/20 rounded-sm hover:bg-black/40 transition-all group"
                    whileHover={{ x: 5, backgroundColor: "rgba(0,0,0,0.4)" }}
                  >
                    <div className="bg-neon-cyan/20 p-2 rounded-sm group-hover:bg-neon-cyan/30 transition-colors">
                      <Mail className="text-neon-cyan w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-neon-blue group-hover:text-neon-cyan transition-colors">
                        contact@bogdanmihalca.com
                      </p>
                    </div>
                  </motion.a>
                </div>

                <div>
                  <h4 className="text-neon-cyan mb-4 font-cyber text-lg">
                    SOCIAL NETWORKS
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {socialLinks.map((link, index) => (
                      <motion.a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center p-3 bg-black/30 rounded-sm transition-all duration-300 group border border-transparent hover:border-cyan-500/30"
                        whileHover={{
                          y: -5,
                          boxShadow: "0 10px 15px -3px rgba(0, 255, 255, 0.2)",
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={
                          isInView
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 20 }
                        }
                        transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      >
                        {link.name === "GitHub" && (
                          <div className="bg-green-300/20 p-2 rounded-full group-hover:bg-green-300/30 transition-colors">
                            <Github className="w-5 h-5 text-green-300" />
                          </div>
                        )}
                        {link.name === "LinkedIn" && (
                          <div className="bg-cyan-400/20 p-2 rounded-full group-hover:bg-cyan-400/30 transition-colors">
                            <Linkedin className="w-5 h-5 text-cyan-400" />
                          </div>
                        )}
                        {link.name === "Instagram" && (
                          <div className="bg-pink-500/20 p-2 rounded-full group-hover:bg-pink-500/30 transition-colors">
                            <Instagram className="w-5 h-5 text-pink-500" />
                          </div>
                        )}
                        <span
                          className={`ml-3 text-sm transition-all duration-300 ${
                            link.name === "GitHub"
                              ? "text-green-300 group-hover:text-green-200"
                              : link.name === "LinkedIn"
                              ? "text-cyan-400 group-hover:text-cyan-300"
                              : "text-pink-500 group-hover:text-pink-400"
                          }`}
                        >
                          {link.name}
                        </span>
                      </motion.a>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-neon-blue/70 text-sm border-l-2 border-neon-cyan pl-4 italic">
                    &quot;Technology is best when it brings people
                    together.&quot;
                    <span className="block mt-1 text-neon-cyan">
                      - Matt Mullenweg
                    </span>
                  </p>
                </div>
              </div>
            </HologramContainer>
          </motion.div>
        </div>
      </div>

      <DecoDivider className="bottom-0 left-0 absolute" variant="holo" />
    </section>
  );
};

export { ContactSection };
