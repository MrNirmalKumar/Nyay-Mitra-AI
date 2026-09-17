"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { LEGAL_RIGHTS_DATA, CATEGORIES, LegalRight } from "@/lib/data/rights-data";

export default function RightsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRights = LEGAL_RIGHTS_DATA.filter((right) => {
    const matchesCategory =
      selectedCategory === "All Categories" || right.category === selectedCategory;
    const matchesQuery =
      searchQuery.trim() === "" ||
      right.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      right.simpleExplanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      right.applicableLaws.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase())) ||
      right.possibleRights.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesQuery;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gold-500/15 border border-gold-500/30 text-gold-400">
            Citizen Empowerment Repository
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Verified Indian Statutes
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Indian Citizen Legal Rights Directory
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl">
          Search and understand your fundamental, contractual, and statutory rights under Indian law in plain, everyday language. Every entry is cross-referenced with official enactments from India Code.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by topic, act, or issue (e.g. deposit, termination, cyber fraud, POSH, salary)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 focus:border-gold-500 text-sm text-white placeholder-slate-500 outline-none shadow-subtle"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-gold-500 text-navy-950 font-bold shadow-gold-glow"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Rights Grid */}
      <div className="space-y-6">
        {filteredRights.length > 0 ? (
          filteredRights.map((right) => (
            <div
              key={right.id}
              className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-5 shadow-subtle"
            >
              {/* Top Meta */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-slate-800 text-gold-400 border border-gold-500/20">
                  {right.category}
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={right.sourceReference.url || "https://www.indiacode.nic.in"}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-gold-300 transition-colors"
                  >
                    <span>{right.sourceReference.authority}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </div>
              </div>

              {/* Title & Plain Explanation */}
              <div className="space-y-2">
                <h2 className="text-lg sm:text-xl font-bold text-white">{right.title}</h2>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                  {right.simpleExplanation}
                </p>
              </div>

              {/* Rights & Next Steps Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Rights List */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Your Specific Protections
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {right.possibleRights.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-gold-400 font-bold">&bull;</span>
                        <span className="leading-relaxed">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Practical Steps */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5" /> Practical Next Steps
                  </span>
                  <ol className="space-y-1.5 text-xs text-slate-300">
                    {right.practicalNextSteps.map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{s}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Applicable Laws */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-400 font-semibold">Statutory Basis:</span>
                  {right.applicableLaws.map((law, lIdx) => (
                    <span
                      key={lIdx}
                      className="px-2.5 py-1 rounded bg-slate-950 text-slate-300 border border-slate-800 font-mono text-[11px]"
                    >
                      {law}
                    </span>
                  ))}
                </div>

                {/* Consultation Link */}
                <Link
                  href={`/chat?q=${encodeURIComponent(`I have an issue regarding: ${right.title}. How should I proceed?`)}`}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-gold-400 text-xs font-semibold border border-gold-500/30 hover:border-gold-500/60 transition-all shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Consult AI on this Right</span>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 rounded-2xl bg-slate-900 text-center space-y-3">
            <BookOpen className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No Matching Rights Found</h3>
            <p className="text-xs text-slate-400">
              Try changing your search query or selecting &ldquo;All Categories&rdquo;.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
