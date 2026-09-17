import React from "react";
import Link from "next/link";
import { Scale, ExternalLink, Heart, ShieldCheck } from "lucide-react";
import { LegalDisclaimer } from "../ui/LegalDisclaimer";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-100 dark:bg-navy-950 text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/80 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-500 to-amber-600 flex items-center justify-center text-navy-950">
                <Scale className="w-4 h-4 font-bold" />
              </div>
              <span className="font-bold text-lg text-slate-800 dark:text-white">
                Nyay Mitra <span className="text-gold-500 dark:text-gold-400">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              AI-powered legal guidance for every Indian citizen. Understand your legal rights in plain language, take the right step, and draft professional notices with confidence.
            </p>
            <div className="flex items-center gap-2 text-xs text-gold-400/90 font-medium">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>Ethical AI &bull; No Hallucinated Laws &bull; Citizen-First</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-slate-800 dark:text-white text-sm font-semibold tracking-wider uppercase">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/chat" className="hover:text-gold-300 transition-colors">
                  AI Legal Consultation
                </Link>
              </li>
              <li>
                <Link href="/notices" className="hover:text-gold-300 transition-colors">
                  Legal Notice Generator
                </Link>
              </li>
              <li>
                <Link href="/rights" className="hover:text-gold-300 transition-colors">
                  Indian Citizen Rights Guide
                </Link>
              </li>
              <li>
                <Link href="/documents" className="hover:text-gold-300 transition-colors">
                  Document Clause Scanner
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold-300 transition-colors">
                  Mission & Responsible AI
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency Statutory Helplines */}
          <div className="space-y-3">
            <h3 className="text-slate-800 dark:text-white text-sm font-semibold tracking-wider uppercase">Official Helplines</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <span>National Consumer Helpline</span>
                <span className="font-mono text-emerald-400 font-semibold">1915</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Cyber Crime Financial Fraud</span>
                <span className="font-mono text-blue-400 font-semibold">1930</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Free Legal Aid (NALSA)</span>
                <span className="font-mono text-gold-400 font-semibold">15100</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Women Helpline (National)</span>
                <span className="font-mono text-purple-400 font-semibold">1091</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Emergency Police / Rescue</span>
                <span className="font-mono text-rose-400 font-semibold">112</span>
              </li>
            </ul>
          </div>

          {/* Official Indian Portals */}
          <div className="space-y-3">
            <h3 className="text-slate-800 dark:text-white text-sm font-semibold tracking-wider uppercase">Government Portals</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.indiacode.nic.in"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-gold-300 transition-colors"
                >
                  <span>India Code (National Acts)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://edaakhil.nic.in"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-gold-300 transition-colors"
                >
                  <span>e-Daakhil (Consumer Filing)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-gold-300 transition-colors"
                >
                  <span>National Cyber Crime Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://nalsa.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-gold-300 transition-colors"
                >
                  <span>NALSA (National Legal Services)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Global Legal Disclaimer */}
        <div className="mb-8">
          <LegalDisclaimer />
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
          <p>&copy; {new Date().getFullYear()} Nyay Mitra AI &bull; Built with civic responsibility for Indian Citizens.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for accessible justice.
          </p>
        </div>
      </div>
    </footer>
  );
};
