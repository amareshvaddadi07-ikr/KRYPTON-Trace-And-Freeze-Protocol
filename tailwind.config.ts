import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFBF7",
        card: "#FFFFFF",
        border: "#FFEAD5",
        "border-subtle": "#F4E5D8",
        brand: {
          50: "#FFF6ED",
          100: "#FFEAD5",
          200: "#FFD4AB",
          300: "#FFB575",
          400: "#FF8C42",
          500: "#FF6B1A", // primary orange
          600: "#EA540C",
          700: "#C23C0A",
          800: "#9A3110",
          900: "#7C2B10",
        },
        primary: {
          DEFAULT: "#FF6B1A",
          hover: "#EA540C",
          light: "#FFF4EB",
        },
        secondary: {
          DEFAULT: "#FF8C42",
          light: "#FFF2E5",
        },
        foreground: "#111111",
        muted: {
          DEFAULT: "#6B7280",
          light: "#9CA3AF",
          dark: "#4B5563",
        },
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0, 0, 0, 0.04)",
        "soft-hover": "0 12px 36px rgba(255, 107, 26, 0.08), 0 4px 16px rgba(0, 0, 0, 0.03)",
        card: "0 8px 30px rgba(0, 0, 0, 0.04)",
        dropdown: "0 10px 40px -10px rgba(0, 0, 0, 0.08)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      fontFamily: {
        sans: ["'Inter Tight'", "Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'JetBrains Mono'", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
