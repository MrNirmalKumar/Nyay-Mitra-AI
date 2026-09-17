import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#f0f4fd",
          100: "#e0e9fb",
          200: "#c0d4f7",
          300: "#90b5f1",
          400: "#5a8fe8",
          500: "#326ede",
          600: "#2153c3",
          700: "#1b42a0",
          800: "#193782",
          900: "#0a1128",
          950: "#050814",
        },
        gold: {
          50: "#fdfbf7",
          100: "#faf5eb",
          200: "#f3e7ce",
          300: "#ebd4a7",
          400: "#dfbd7b",
          500: "#c5a059",
          600: "#b08a45",
          700: "#8e6d36",
          800: "#735730",
          900: "#60482b",
        },
      },
      boxShadow: {
        'subtle': '0 2px 8px -2px rgba(10, 17, 40, 0.05), 0 1px 4px -1px rgba(10, 17, 40, 0.03)',
        'elevated': '0 12px 28px -6px rgba(10, 17, 40, 0.09), 0 4px 12px -2px rgba(10, 17, 40, 0.04)',
        'gold-glow': '0 0 20px -3px rgba(197, 160, 89, 0.35)',
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
