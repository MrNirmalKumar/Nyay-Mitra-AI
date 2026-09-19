import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // keep for potential future dark mode
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand navy
        navy: {
          50: "#EEF2F7",
          100: "#DDEAF3",
          200: "#BBD4E7",
          300: "#88B3D0",
          400: "#4E8DB8",
          500: "#2B6A9A",
          600: "#1E5480",
          700: "#1A4268",
          800: "#173450",
          900: "#0F1E30",
          DEFAULT: "#1E3A5F",
          950: "#0B1520",
        },
        // Maroon secondary
        maroon: {
          50: "#FDF2F4",
          100: "#FBE4E8",
          200: "#F7C9D1",
          300: "#F09AAB",
          400: "#E56A7F",
          500: "#C94060",
          600: "#A92845",
          700: "#8C1E36",
          800: "#7A1F2B",
          900: "#5E1822",
          DEFAULT: "#7A1F2B",
        },
        // Muted gold
        gold: {
          50: "#FDF6ED",
          100: "#FAECD9",
          200: "#F4D9B3",
          300: "#EEC28C",
          400: "#D9A86A",
          500: "#B8935F",
          600: "#9E7A47",
          700: "#7F6038",
          800: "#634A2C",
          900: "#4A3822",
          DEFAULT: "#B8935F",
        },
        // Page backgrounds
        cream: {
          50: "#FDFCFA",
          100: "#F7F6F2",
          200: "#F2F0EB",
          300: "#E8E6E0",
          400: "#D8D5CE",
          DEFAULT: "#F7F6F2",
        },
      },
      fontFamily: {
        sans:  ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
        display: ["Playfair Display", "Georgia", "serif"],
      },
      boxShadow: {
        "card":  "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-md": "0 4px 12px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.04)",
        "card-lg": "0 12px 28px rgba(0,0,0,0.09), 0 4px 8px rgba(0,0,0,0.04)",
        "navy":  "0 4px 16px rgba(30,58,95,0.2)",
      },
      borderColor: {
        DEFAULT: "#E5E3DD",
      },
    },
  },
  plugins: [],
};
export default config;
