"use client";

import React from "react";
import Link from "next/link";
import { Scale, ExternalLink, Heart, ShieldCheck } from "lucide-react";
import { LegalDisclaimer } from "../ui/LegalDisclaimer";

const navy = "#1E3A5F";
const gold = "#B8935F";
const muted = "#6B7280";
const border = "#E5E3DD";

const colHead: React.CSSProperties = {
  fontSize: "0.6875rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#1A1A1A",
  marginBottom: "0.875rem",
};

const linkStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  color: muted,
  textDecoration: "none",
  display: "block",
  marginBottom: "0.5rem",
  transition: "color 0.15s",
};

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        background: "#FFFFFF",
        borderTop: `1px solid ${border}`,
        marginTop: "auto",
      }}
    >
      {/* Top brand strip */}
      <div style={{ background: navy, color: "#fff", padding: "2.5rem 0" }}>
        <div
          style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div
                style={{
                  width: 34, height: 34, borderRadius: "0.5rem",
                  background: gold, display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <Scale className="w-4 h-4" style={{ color: navy }} />
              </div>
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.125rem", fontWeight: 700, color: "#fff" }}>
                Nyay Mitra <span style={{ color: gold }}>AI</span>
              </span>
            </div>
            <p style={{ fontSize: "0.8125rem", color: "#94A3B8", lineHeight: 1.65 }}>
              AI-powered legal guidance for every Indian citizen. Understand your rights, take the right step, and draft professional notices with confidence.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: gold }}>
              <ShieldCheck style={{ width: 14, height: 14 }} />
              Ethical AI · No Hallucinated Laws · Citizen-First
            </div>
          </div>

          {/* Platform links */}
          <div>
            <div style={colHead}>Platform</div>
            {[
              { href: "/chat", label: "AI Legal Consultation" },
              { href: "/notices", label: "Legal Notice Generator" },
              { href: "/rights", label: "Citizen Rights Guide" },
              { href: "/documents", label: "Document Clause Scanner" },
              { href: "/advisors", label: "Find an Advocate" },
              { href: "/about", label: "Mission & Responsible AI" },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{ ...linkStyle, color: "#94A3B8" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = gold}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#94A3B8"}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Helplines */}
          <div>
            <div style={{ ...colHead, color: "#CBD5E1" }}>Official Helplines</div>
            {[
              { label: "National Consumer Helpline", number: "1915", color: "#34D399" },
              { label: "Cyber Crime Financial Fraud", number: "1930", color: "#60A5FA" },
              { label: "Free Legal Aid (NALSA)", number: "15100", color: gold },
              { label: "Women Helpline", number: "1091", color: "#C084FC" },
              { label: "Emergency Police / Rescue", number: "112", color: "#F87171" },
            ].map(h => (
              <div key={h.number} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.8125rem", color: "#94A3B8" }}>{h.label}</span>
                <span style={{ fontSize: "0.8125rem", fontWeight: 700, fontFamily: "monospace", color: h.color }}>{h.number}</span>
              </div>
            ))}
          </div>

          {/* Government portals */}
          <div>
            <div style={{ ...colHead, color: "#CBD5E1" }}>Government Portals</div>
            {[
              { href: "https://www.indiacode.nic.in", label: "India Code (National Acts)" },
              { href: "https://edaakhil.nic.in", label: "e-Daakhil (Consumer Filing)" },
              { href: "https://cybercrime.gov.in", label: "National Cyber Crime Portal" },
              { href: "https://nalsa.gov.in", label: "NALSA (Legal Services)" },
            ].map(l => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 4, ...linkStyle, color: "#94A3B8", marginBottom: "0.625rem" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = gold}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#94A3B8"}
              >
                {l.label} <ExternalLink style={{ width: 12, height: 12, opacity: 0.6 }} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "1.25rem 2rem" }}>
        <LegalDisclaimer />
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: `1px solid ${border}`, background: "#FAFAF8" }}>
        <div
          style={{ maxWidth: 1280, margin: "0 auto", padding: "0.875rem 2rem" }}
          className="flex flex-col sm:flex-row items-center justify-between gap-2"
        >
          <p style={{ fontSize: "0.75rem", color: muted }}>
            © {new Date().getFullYear()} Nyay Mitra AI · Built with civic responsibility for Indian citizens.
          </p>
          <p style={{ fontSize: "0.75rem", color: muted, display: "flex", alignItems: "center", gap: 4 }}>
            Engineered with <Heart style={{ width: 13, height: 13, color: "#EF4444", fill: "#EF4444" }} /> for accessible justice.
          </p>
        </div>
      </div>
    </footer>
  );
};
