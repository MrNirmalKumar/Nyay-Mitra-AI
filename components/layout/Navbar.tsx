"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Scale, MessageSquareText, FileText, BookOpen,
  FileSearch, Info, Menu, X, Users,
} from "lucide-react";
import { useLang } from "@/lib/LangContext";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang, t } = useLang();

  const navItems = [
    { key: "nav.home", href: "/", icon: Scale },
    { key: "nav.chat", href: "/chat", icon: MessageSquareText },
    { key: "nav.notices", href: "/notices", icon: FileText },
    { key: "nav.rights", href: "/rights", icon: BookOpen },
    { key: "nav.documents", href: "/documents", icon: FileSearch },
    { key: "nav.about", href: "/about", icon: Info },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 w-full transition-shadow duration-200"
      style={{
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E5E3DD",
        boxShadow: scrolled ? "0 2px 12px rgba(0,0,0,0.06)" : "none",
      }}
    >
      {/* Top micro-strip */}
      <div
        style={{
          backgroundColor: "#1E3A5F",
          color: "#CBD5E1",
          fontSize: "0.6875rem",
          textAlign: "center",
          padding: "0.25rem 1rem",
          letterSpacing: "0.04em",
          fontWeight: 500,
        }}
      >
        Free AI-powered legal guidance for Indian citizens &nbsp;·&nbsp; No account required &nbsp;·&nbsp; Statute-verified answers
      </div>

      {/* Main nav row */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>
        <div className="flex items-center justify-between" style={{ height: 60 }}>

          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group" style={{ textDecoration: "none" }}>
            <div
              className="flex items-center justify-center rounded-lg group-hover:opacity-90 transition-opacity"
              style={{ width: 38, height: 38, background: "#1E3A5F" }}
            >
              <Scale className="w-5 h-5" style={{ color: "#B8935F" }} />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    color: "#1E3A5F",
                    letterSpacing: "-0.01em",
                    lineHeight: 1,
                  }}
                >
                  Nyay Mitra <span style={{ color: "#B8935F" }}>AI</span>
                </span>
              </div>
              <p style={{ fontSize: "0.6rem", color: "#9CA3AF", letterSpacing: "0.05em", textTransform: "uppercase", marginTop: 1, fontWeight: 500 }}>
                Legal Intelligence for India
              </p>
            </div>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center" style={{ gap: "0.125rem" }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link prefetch={true} key={item.href}
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    padding: "0.5rem 0.875rem",
                    fontSize: "0.8125rem",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#1E3A5F" : "#4B5563",
                    borderBottom: isActive ? "2px solid #B8935F" : "2px solid transparent",
                    textDecoration: "none",
                    transition: "color 0.15s, border-color 0.15s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => {
                    if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = "#1E3A5F";
                  }}
                  onMouseLeave={e => {
                    if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = "#4B5563";
                  }}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>

          {/* Right side: language toggle + CTA */}
          <div className="hidden lg:flex items-center" style={{ gap: "0.75rem" }}>
            {/* Language toggle — wired to LangContext */}
            <div
              className="flex items-center rounded-md overflow-hidden"
              style={{ border: "1px solid #E5E3DD", fontSize: "0.75rem" }}
            >
              <button
                onClick={() => setLang("en")}
                style={{
                  padding: "0.25rem 0.625rem",
                  background: lang === "en" ? "#1E3A5F" : "transparent",
                  color: lang === "en" ? "#fff" : "#6B7280",
                  fontWeight: 700, border: "none", cursor: "pointer",
                  transition: "background 0.15s",
                }}
              >
                EN
              </button>
              <button
                onClick={() => setLang("hi")}
                style={{
                  padding: "0.25rem 0.625rem",
                  background: lang === "hi" ? "#1E3A5F" : "transparent",
                  color: lang === "hi" ? "#fff" : "#6B7280",
                  fontWeight: 700, border: "none", cursor: "pointer",
                  transition: "background 0.15s",
                }}
              >
                हिं
              </button>
            </div>

            {/* Talk to Advocate */}
            <Link
              href="/advisors"
              className="flex items-center gap-1.5"
              style={{
                padding: "0.5rem 1rem",
                background: "#1E3A5F",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.8125rem",
                borderRadius: "0.5rem",
                textDecoration: "none",
                transition: "background 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#152d4a"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#1E3A5F"}
            >
              <Users className="w-3.5 h-3.5" />
              {t("nav.advocate")}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              href="/chat"
              style={{
                padding: "0.4rem 0.875rem",
                background: "#1E3A5F",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.75rem",
                borderRadius: "0.5rem",
                textDecoration: "none",
              }}
            >
              Chat
            </Link>
            <button
              onClick={() => setMobileOpen(p => !p)}
              aria-label="Toggle menu"
              style={{
                padding: "0.4rem",
                borderRadius: "0.5rem",
                color: "#4B5563",
                background: "transparent",
                border: "1px solid #E5E3DD",
                cursor: "pointer",
              }}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="lg:hidden"
          style={{ borderTop: "1px solid #E5E3DD", background: "#fff", padding: "0.75rem 1.5rem 1rem" }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link prefetch={true} key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.625rem 0.75rem",
                  borderRadius: "0.5rem",
                  color: isActive ? "#1E3A5F" : "#4B5563",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "0.9375rem",
                  textDecoration: "none",
                  background: isActive ? "#EEF2F7" : "transparent",
                  borderLeft: isActive ? "3px solid #B8935F" : "3px solid transparent",
                  marginBottom: "0.25rem",
                }}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
          <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid #E5E3DD" }}>
            <Link
              href="/advisors"
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                padding: "0.625rem 1rem",
                background: "#1E3A5F",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.875rem",
                borderRadius: "0.5rem",
                textAlign: "center",
                textDecoration: "none",
              }}
            >
              Talk to an Advocate
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

