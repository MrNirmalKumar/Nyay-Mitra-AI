"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Scale,
  MessageSquareText,
  FileText,
  BookOpen,
  FileSearch,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Gavel,
  BookMarked,
} from "lucide-react";
import { motion } from "framer-motion";
import { LiveDashboard } from "@/components/ui/LiveDashboard";

export default function Home() {
  const router = useRouter();
  const [quickInput, setQuickInput] = useState("");
  const [placeholderText, setPlaceholderText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const placeholders = [
    "Landlord is not returning my security deposit...",
    "My employer hasn't paid me for 3 months...",
    "I bought a defective laptop and the seller refuses return...",
    "How do I send a legal notice to my tenant for eviction?",
  ];

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentString = placeholders[placeholderIndex];

    if (isDeleting) {
      timeout = setTimeout(() => {
        setPlaceholderText(currentString.substring(0, placeholderText.length - 1));
      }, 30);
    } else {
      timeout = setTimeout(() => {
        setPlaceholderText(currentString.substring(0, placeholderText.length + 1));
      }, 60);
    }

    if (!isDeleting && placeholderText === currentString) {
      timeout = setTimeout(() => setIsDeleting(true), 2500);
    } else if (isDeleting && placeholderText === "") {
      setIsDeleting(false);
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
      timeout = setTimeout(() => {}, 500);
    }
    
    return () => clearTimeout(timeout);
  }, [placeholderText, isDeleting, placeholderIndex]);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    router.push(`/chat?q=${encodeURIComponent(quickInput.trim())}`);
  };

  const handleScenarioClick = (promptText: string) => {
    router.push(`/chat?q=${encodeURIComponent(promptText)}`);
  };

  return (
    <div className="w-full flex flex-col space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative pt-24 lg:pt-32 pb-20 overflow-hidden bg-slate-50 dark:bg-navy-950 min-h-[90vh] flex flex-col justify-center">
        {/* Subtle Pattern Background */}
        <div className="absolute inset-0 bg-grid-slate-200/[0.4] dark:bg-grid-slate-900/[0.04] bg-[size:32px_32px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Typography & CTAs */}
          <div className="text-left space-y-8 max-w-2xl">
            {/* Professional Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700/50 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Verified Indian Legal Intelligence</span>
            </motion.div>

            {/* Main Title & Tagline */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="space-y-6"
            >
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                Understand Your Rights. <br />
                <span className="text-teal-700 dark:text-teal-400">
                  Take the Right Step.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-xl">
                Nyay Mitra AI helps ordinary Indian citizens analyze contracts, generate professional legal demand notices, and understand their legal rights in plain language—without expensive fees.
              </p>
            </motion.div>

            {/* Quick Problem Input Box */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              onSubmit={handleQuickSubmit}
              className="relative flex flex-col sm:flex-row items-center p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-md focus-within:border-teal-500/50 dark:focus-within:border-teal-500/50 transition-all gap-2 max-w-xl"
            >
              <input
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder={placeholderText || "Describe your legal issue..."}
                className="w-full px-4 py-3.5 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-teal-700 dark:bg-teal-600 hover:bg-teal-800 dark:hover:bg-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shrink-0"
              >
                <span>Consult Nyay Mitra</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.form>

            {/* Trust Badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Verifiable Indian Statutes
              </span>
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-400 dark:text-slate-300" />
                No Account Required
              </span>
            </motion.div>
          </div>

          {/* Right Column: Live Platform Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden lg:block relative h-full min-h-[400px]"
          >
            {/* Decorative elements behind the card */}
            <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-2xl blur-2xl"></div>
            
            <div className="relative h-full z-10">
              <LiveDashboard />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="relative z-10 -mt-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: ShieldCheck,
              title: "Bank-Grade Security",
              desc: "Your legal data is encrypted and never shared. Built with ethical AI safeguards.",
            },
            {
              icon: FileText,
              title: "Instant Contract Scanning",
              desc: "Upload a rental or job agreement. We instantly highlight unfair or risky clauses.",
            },
            {
              icon: Gavel,
              title: "Advocate-Ready Notices",
              desc: "Generate professional legal demand notices in 2 minutes, ready to print or email.",
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-8 rounded-2xl flex flex-col gap-4 text-center items-center group cursor-pointer shadow-lg"
            >
              <div className="w-14 h-14 rounded-full bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:scale-110 group-hover:bg-teal-100 dark:group-hover:bg-teal-500/20 transition-all duration-300">
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* The Problem We Are Solving */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 relative overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-500 dark:text-rose-400">
                The Indian Justice Access Gap
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Millions of Citizens Suffer in Silence Because Law Feels Intimidating
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                When a landlord withholds ₹1,00,000, or an employer denies months of earned salary, ordinary citizens often give up. High initial advocate consultation costs, dense Latin legal jargon, and fear of prolonged litigation prevent citizens from enforcing their rightful claims.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                  <div className="font-bold text-rose-500 dark:text-rose-400 text-sm mb-1">Traditional Barrier</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Advocate fees starting at ₹5,000 just for initial drafting, with zero transparency on outcome probability.
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-teal-50 dark:bg-slate-950/70 border border-teal-100 dark:border-slate-800">
                  <div className="font-bold text-teal-700 dark:text-teal-400 text-sm mb-1">The Nyay Mitra Solution</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Instant, free plain-language legal clarity, actionable step-by-step roadmaps, and ready-to-serve statutory notices.
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-center space-y-4 p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                Key Civic Impact Metrics
              </h3>
              <div className="space-y-4">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white">85%</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">of tenancy and consumer disputes settle upon receiving a formal legal notice.</div>
                </div>
                <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white">15 Days</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Statutory standard compliance window to resolve grievances before filing cases.</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white">0 Hallucinations</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Statute-anchored framework verified against actual Indian central & state enactments.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
            Simple 4-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            How Nyay Mitra AI Guides You to Justice
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            From the moment you describe your dispute to holding a signed demand notice in hand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Describe Your Problem",
              desc: "Type or speak your situation in ordinary English or Hinglish without needing legal terminology.",
              icon: MessageSquareText,
            },
            {
              step: "02",
              title: "AI Analysis & Rights",
              desc: "System identifies your legal domain, checks applicable Indian acts, and asks targeted questions if info is missing.",
              icon: Scale,
            },
            {
              step: "03",
              title: "Structured Action Plan",
              desc: "Receive step-by-step guidance, list of tangible evidence to collect, and when to consult a lawyer.",
              icon: CheckCircle2,
            },
            {
              step: "04",
              title: "Generate Legal Notice",
              desc: "Use the automated notice generator to draft a legally sound demand notice in minutes.",
              icon: FileText,
            },
          ].map((item, idx) => (
            <div key={idx} className="relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-colors group shadow-sm hover:shadow-md">
              <div className="absolute -top-4 -right-4 text-7xl font-bold text-slate-100 dark:text-slate-800/30 group-hover:text-teal-50 dark:group-hover:text-teal-500/10 transition-colors pointer-events-none select-none">
                {item.step}
              </div>
              <item.icon className="w-8 h-8 text-teal-600 dark:text-teal-400 mb-4" />
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed relative z-10">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Try Example Scenarios */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-10">
        <div className="text-center space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Not sure where to start? Try these scenarios
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Click any common issue below to see how Nyay Mitra AI analyzes the problem instantly.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: "Tenancy Dispute",
              desc: "Landlord refusing to return my security deposit of ₹50,000.",
              prompt: "My landlord is refusing to return my security deposit of Rs. 50,000 even though I vacated the flat a month ago with proper notice.",
            },
            {
              title: "Employment Rights",
              desc: "Startup fired me without notice and withheld my salary.",
              prompt: "A startup fired me without any notice period and is refusing to pay my pending salary of 2 months.",
            },
            {
              title: "Consumer Protection",
              desc: "E-commerce app sent a fake product, rejecting my return.",
              prompt: "I bought a phone online but received a fake product. Customer care is rejecting my return request.",
            },
            {
              title: "Cyber Fraud",
              desc: "Lost money to a fake online job portal scam.",
              prompt: "I transferred money to a fake recruitment agency that promised a job but now their number is switched off.",
            }
          ].map((scenario, idx) => (
            <div 
              key={idx}
              onClick={() => handleScenarioClick(scenario.prompt)}
              className="p-5 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                  {scenario.title}
                </h3>
                <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-600 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">{scenario.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
