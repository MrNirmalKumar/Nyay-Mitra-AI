"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      id="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={`
        relative inline-flex items-center justify-center
        w-9 h-9 rounded-lg
        border transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400
        ${
          theme === "dark"
            ? "bg-slate-800 border-slate-700 text-gold-300 hover:bg-slate-700 hover:border-gold-500/40"
            : "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100 hover:border-amber-300"
        }
      `}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 hover:rotate-12" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-300" />
      )}
    </button>
  );
}
