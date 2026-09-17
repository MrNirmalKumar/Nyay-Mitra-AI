"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scale, MessageSquareText, FileText, BookOpen, FileSearch, Info, Menu, X, Sparkles, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/", icon: Scale },
    { label: "AI Consultation", href: "/chat", icon: MessageSquareText },
    { label: "Draft Notice", href: "/notices", icon: FileText },
    { label: "Citizen Rights", href: "/rights", icon: BookOpen },
    { label: "Analyze Document", href: "/documents", icon: FileSearch },
    { label: "About", href: "/about", icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-navy-950/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-amber-600 flex items-center justify-center shadow-gold-glow group-hover:scale-105 transition-transform">
              <Scale className="w-5 h-5 text-navy-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-800 dark:text-white tracking-tight group-hover:text-gold-600 dark:group-hover:text-gold-300 transition-colors">
                  Nyay Mitra <span className="text-gold-500 dark:text-gold-400">AI</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-slate-100 dark:bg-slate-800 text-gold-600 dark:text-gold-400 border border-gold-500/20">
                  India
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block tracking-wide">
                Understand Your Rights. Take the Right Step.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? "text-gold-600 dark:text-gold-400 border-b-2 border-gold-500 rounded-none"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-gold-500 dark:text-gold-400" : "text-slate-400"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action & Demo Badge */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Demo Mode Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-emerald-500/30 text-xs text-emerald-600 dark:text-emerald-400 shadow-sm" title="Demo Mode is ready out-of-the-box for instant hackathon judging">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-medium text-[11px]">Demo Ready</span>
            </div>

            </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/chat"
              className="px-2.5 py-1.5 rounded-lg bg-gold-500 text-navy-950 font-semibold text-xs flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chat</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-base font-medium ${
                    isActive
                      ? "bg-slate-100 dark:bg-slate-800 text-gold-600 dark:text-gold-400 border-l-4 border-gold-400"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-gold-500 dark:text-gold-400" : "text-slate-400"}`} />
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-3 px-4 flex items-center justify-between border-t border-slate-200/80 dark:border-slate-800/80">
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Demo Ready Mode
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                Indian Law Compliant
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
