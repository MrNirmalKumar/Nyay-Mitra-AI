import React from "react";
import Link from "next/link";
import {
  Scale,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Heart,
  ExternalLink,
  Users,
  Code2,
  Database,
  Cpu,
  Layers,
} from "lucide-react";
import { LegalDisclaimer } from "@/components/ui/LegalDisclaimer";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-8 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-500 to-amber-600 flex items-center justify-center mx-auto text-navy-950 shadow-gold-glow">
          <Scale className="w-7 h-7 font-bold" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            About Nyay Mitra AI
          </h1>
          <p className="text-base sm:text-lg text-gold-400 font-medium max-w-xl mx-auto">
            &ldquo;Understand Your Rights. Take the Right Step.&rdquo;
          </p>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            AI-powered legal guidance specifically engineered for the 1.4 billion citizens of India.
          </p>
        </div>
      </div>

      {/* Mission & Problem Statement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-subtle">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
            Our Mission
          </span>
          <h2 className="text-xl font-bold text-white">Democratizing Access to Justice</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            In India, justice often feels like a luxury reserved for those who can afford high advocate fees and navigate intimidating court chambers. Nyay Mitra AI exists to bridge this gap by placing a knowledgeable, objective, and plain-language legal clarity companion in every citizen&apos;s pocket.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-subtle">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-400">
            The Problem We Solve
          </span>
          <h2 className="text-xl font-bold text-white">The Fear of Jargon & High Costs</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            When tenants lose security deposits or employees suffer arbitrary termination, they often do not know if their rights were actually violated. Nyay Mitra turns complex legal provisions into simple language and concrete next steps, empowering citizens to resolve disputes peacefully before entering courtrooms.
          </p>
        </div>
      </div>

      {/* Responsible AI Framework */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Ethical Engineering
          </span>
          <h2 className="text-2xl font-bold text-white">Our Responsible AI Guardrails</h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Legal assistance requires zero tolerance for hallucination or reckless advice. Here is how Nyay Mitra protects citizens:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-gold-400 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>No Fabricated Laws or Citations</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              We never invent fake case numbers or statutory provisions to seem smart. All legal references in Nyay Mitra are verifiable Indian central or state enactments.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-gold-400 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Strict Non-Lawyer Identification</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The AI never pretends to be an advocate or guarantees specific legal outcomes. It is a legal informational guidance tool, not legal representation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-gold-400 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Focused Follow-up Inquiries</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              When essential factual details are missing from a user&apos;s story, the system asks clarifying questions before presenting firm guidance.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-gold-400 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Emergency & High-Risk Routing</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              For domestic violence, criminal arrest, or cyber extortion, Nyay Mitra immediately routes citizens to official emergency numbers (112, 1930, 1091, DLSA).
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack & Architecture */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-400 flex items-center gap-1.5">
            <Code2 className="w-4 h-4" /> Hackathon Architecture
          </span>
          <h2 className="text-2xl font-bold text-white">Full-Stack Technical Architecture</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-white font-bold">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Next.js 14 App Router</span>
            </div>
            <p className="text-slate-400">TypeScript, Tailwind CSS, modern responsive UI, SSR & API routes.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-white font-bold">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>MySQL + Prisma ORM</span>
            </div>
            <p className="text-slate-400">Prisma schema for users, conversations, messages, documents, and notices with resilience.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-white font-bold">
              <Cpu className="w-4 h-4 text-gold-400" />
              <span>OpenAI & Demo Engine</span>
            </div>
            <p className="text-slate-400">Seamless dual-mode engine: live LLM when API key present; 4 realistic demo flows out-of-the-box.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-white font-bold">
              <Scale className="w-4 h-4 text-purple-400" />
              <span>Voice & PDF Generation</span>
            </div>
            <p className="text-slate-400">Browser Web Speech recognition and jsPDF advocate letterhead exporter.</p>
          </div>
        </div>
      </div>

      {/* Mandatory Statutory Disclaimer */}
      <div>
        <LegalDisclaimer />
      </div>
    </div>
  );
}
