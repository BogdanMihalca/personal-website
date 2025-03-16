import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },

        cyber: {
          black: "#0a0a0f",
        },
        neon: {
          cyan: "#00f3ff",
          purple: "#bc13fe",
          pink: "#ff00ff",
          green: "#39ff14",
          yellow: "#f0ff00",
        },
        "space-black": "#0A0E17",
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "space-grid":
          "repeating-linear-gradient(#222222 0 1px, transparent 1px 40px), repeating-linear-gradient(90deg, #222222 0 1px, transparent 1px 40px)",
        "space-gradient":
          "radial-gradient(ellipse at top, #222222 0%, #000 70%)",
        starfield:
          'radial-gradient(ellipse at center, theme("colors.neon.cyan/0.1") 0%, transparent 70%)',
        scanline: "linear-gradient(transparent 50%, rgba(0, 0, 0, 0.5) 50%)",
        "neon-grid":
          'repeating-linear-gradient(90deg, theme("colors.neon.cyan") 0 1px, transparent 1px 40px), repeating-linear-gradient(0deg, theme("colors.neon.cyan") 0 1px, transparent 1px 40px)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")], // eslint-disable-line @typescript-eslint/no-require-imports
} satisfies Config;
