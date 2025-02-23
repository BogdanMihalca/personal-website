"use client";
import React, { useState, useEffect } from "react";
import { Github, Linkedin, Instagram, Clock, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ComingSoonPage = () => {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setMounted(true);
    // Launch date - set to 30 days from now
    const launchDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Countdown timer
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Subscription failed. Please try again.");
      }

      setIsSubscribed(true);
      setEmail("");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const CountdownBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center bg-gray-800 rounded-lg p-4 w-24">
      <span className="text-3xl font-bold text-indigo-400">{value}</span>
      <span className="text-sm text-gray-400">{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center p-4">
      <div
        className={`space-y-8 text-center transform ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        } transition-all duration-1000`}
      >
        <div
          className={`inline-block bg-indigo-600 rounded-full px-4 py-1 text-sm font-medium ${
            mounted ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
          } transition-all duration-700 delay-300`}
        >
          Software Engineer
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 animate-gradient">
            Coming Soon
          </span>
        </h1>

        <p
          className={`text-xl text-gray-400 max-w-lg mx-auto ${
            mounted ? "opacity-100" : "opacity-0"
          } transition-opacity duration-1000 delay-500`}
        >
          Something amazing is in the works. I&apos;m crafting a digital
          experience that will be worth the wait.
        </p>

        {/* Countdown Timer */}
        <div className="flex flex-wrap justify-center gap-4 my-8">
          <CountdownBox value={timeLeft.days} label="Days" />
          <CountdownBox value={timeLeft.hours} label="Hours" />
          <CountdownBox value={timeLeft.minutes} label="Minutes" />
          <CountdownBox value={timeLeft.seconds} label="Seconds" />
        </div>

        <div
          className={`max-w-md mx-auto ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          } transition-all duration-1000 delay-700`}
        >
          {error && (
            <Alert
              variant="destructive"
              className="mb-4 bg-red-900/20 border-red-900"
            >
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-indigo-500 transition-colors"
                required
                disabled={isLoading}
              />
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  "Notify Me"
                )}
              </button>
            </form>
          ) : (
            <div className="text-green-500 font-medium animate-fade-in flex items-center justify-center gap-2">
              <Clock className="w-5 h-5" />
              Thanks for subscribing! I&apos;ll keep you posted.
            </div>
          )}
        </div>

        <div
          className={`flex justify-center space-x-6 ${
            mounted ? "scale-100 opacity-100" : "scale-95 opacity-0"
          } transition-all duration-1000 delay-1000`}
        >
          {[
            {
              icon: Instagram,
              href: "https://www.instagram.com/mihalcabogdan/",
              label: "Instagram",
            },
            {
              icon: Github,
              href: "https://github.com/BogdanMihalca",
              label: "GitHub",
            },
            {
              icon: Linkedin,
              href: "https://www.linkedin.com/in/bogdan-mihalca-76b2b7b3/",
              label: "LinkedIn",
            },
          ].map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors group relative"
              aria-label={label}
            >
              <Icon className="w-6 h-6" />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                {label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
