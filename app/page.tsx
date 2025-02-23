"use client";
import React, { useState, useEffect } from "react";
import { Github, Linkedin, Instagram } from "lucide-react";

const ComingSoonPage = () => {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsSubscribed(true);
    setEmail("");

    await fetch("api/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center p-4">
      {/* Main content container with fade-in animation */}
      <div
        className={`space-y-8 text-center transform ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        } transition-all duration-1000`}
      >
        {/* Developer tag with slide-in animation */}
        <div
          className={`inline-block bg-indigo-600 rounded-full px-4 py-1 text-sm font-medium ${
            mounted ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
          } transition-all duration-700 delay-300`}
        >
          Software Engineer
        </div>

        {/* Main heading with typing animation */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
            Coming Soon
          </span>
        </h1>

        {/* Subtitle with fade-in animation */}
        <p
          className={`text-xl text-gray-400 max-w-lg mx-auto ${
            mounted ? "opacity-100" : "opacity-0"
          } transition-opacity duration-1000 delay-500`}
        >
          Something amazing is in the works. I&apos;m crafting a digital
          experience that will be worth the wait.
        </p>

        {/* Newsletter form with slide-up animation */}
        <div
          className={`max-w-md mx-auto ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          } transition-all duration-1000 delay-700`}
        >
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
              />
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors font-medium"
              >
                Notify Me
              </button>
            </form>
          ) : (
            <div className="text-green-500 font-medium animate-fade-in">
              Thanks for subscribing! I&apos;ll keep you posted.
            </div>
          )}
        </div>

        {/* Social links with pop-in animation */}
        <div
          className={`flex justify-center space-x-6 ${
            mounted ? "scale-100 opacity-100" : "scale-95 opacity-0"
          } transition-all duration-1000 delay-1000`}
        >
          <a
            href="https://www.instagram.com/mihalcabogdan/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Instagram className="w-6 h-6" />
          </a>
          <a
            href="https://github.com/BogdanMihalca"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Github className="w-6 h-6" />
          </a>
          <a
            href="https://www.linkedin.com/in/bogdan-mihalca-76b2b7b3/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Linkedin className="w-6 h-6" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
