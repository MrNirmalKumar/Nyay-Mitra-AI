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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Scale className="w-5 h-5 text-white font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-800 dark:text-white tracking-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  Nyay Mitra <span className="text-teal-500 dark:text-teal-400">AI</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400 border border-teal-500/20">
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
                      ? "text-teal-700 dark:text-teal-400 border-b-2 border-teal-600 rounded-none"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-teal-600 dark:text-teal-400" : "text-slate-400"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action & Demo Badge */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* Language Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-800">
              <button className="px-2.5 py-1 text-xs font-bold rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm">EN</button>
              <button className="px-2.5 py-1 text-xs font-bold rounded-md text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">HI</button>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Talk to an Advocate Button */}
            <Link
              href="/advisors"
              className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-navy-950 font-semibold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
            >
              Talk to an Advocate
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/chat"
              className="px-2.5 py-1.5 rounded-lg bg-teal-600 text-white font-semibold text-xs flex items-center gap-1"
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
                      ? "bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-400 border-l-4 border-teal-600"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-teal-600 dark:text-teal-400" : "text-slate-400"}`} />
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-3 pb-2 px-4 flex flex-col gap-3 border-t border-slate-200/80 dark:border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Language / भाषा</span>
                <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-800">
                  <button className="px-3 py-1 text-xs font-bold rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm">EN</button>
                  <button className="px-3 py-1 text-xs font-bold rounded-md text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">HI</button>
                </div>
              </div>
              <Link
                href="/advisors"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-navy-950 font-semibold text-sm text-center"
              >
                Talk to an Advocate
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
