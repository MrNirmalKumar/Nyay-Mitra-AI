"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Send,
  Mic,
  MicOff,
  Sparkles,
  RotateCcw,
  Paperclip,
  FileText,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Gavel,
  BookMarked,
  CheckCircle2,
  FolderLock,
  Scale,
  Copy,
  Check,
} from "lucide-react";
import { StructuredLegalGuidance, NoticePrefill } from "@/lib/ai/demo-scenarios";
import { LegalDisclaimer } from "../ui/LegalDisclaimer";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  intent?: "legal" | "non-legal" | "ambiguous";
  isLegalIssue?: boolean;
  nonLegalResponse?: string;
  clarificationQuestion?: string;
  guidance?: StructuredLegalGuidance;
  noticePrefill?: NoticePrefill;
  isDemoMode?: boolean;
  scenarioId?: string;
  timestamp: string;
}

const EXAMPLE_QUERIES = [
  {
    label: "Tenant Security Deposit",
    text: "My landlord is refusing to return my security deposit even though I moved out and there is no major damage to the property.",
  },
  {
    label: "Unlawful Termination & Notice Pay",
    text: "My company terminated me without giving me proper notice and has not paid my final salary.",
  },
  {
    label: "Defective Product & Warranty Denial",
    text: "I purchased an expensive laptop online which was defective on arrival, and the seller/company is refusing to refund or replace it.",
  },
  {
    label: "3 Months Unpaid Salary",
    text: "My employer has delayed my salary for the past 3 months and is refusing to clear my dues.",
  },
];

export const ChatInterface: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q");
  const queryTriggeredRef = useRef(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [checkedEvidence, setCheckedEvidence] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Load evidence state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nyay_mitra_evidence");
      if (saved) {
        try {
          setCheckedEvidence(JSON.parse(saved));
        } catch (e) {}
      }
    }
  }, []);

  const toggleEvidence = (item: string) => {
    const newState = { ...checkedEvidence, [item]: !checkedEvidence[item] };
    setCheckedEvidence(newState);
    if (typeof window !== "undefined") {
      localStorage.setItem("nyay_mitra_evidence", JSON.stringify(newState));
    }
  };

  // Initialize Web Speech API for voice recognition if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-IN"; // Indian English

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Handle URL query param from Landing page
  useEffect(() => {
    if (initialQuery && !queryTriggeredRef.current && messages.length === 0) {
      queryTriggeredRef.current = true;
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Speech recognition start failed:", err);
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMessageId = "user-" + Date.now();
    const userMsg: ChatMessage = {
      id: userMessageId,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to process consultation");
      }

      const data = await res.json();

      // Non-legal or ambiguous intent path
      if (!data.isLegalIssue) {
        const assistantMsg: ChatMessage = {
          id: "ai-" + Date.now(),
          role: "assistant",
          content:
            data.intent === "ambiguous"
              ? data.clarificationQuestion ||
                "Could you please clarify who is involved and what specific action occurred?"
              : data.nonLegalResponse ||
                "This doesn't appear to be a legal issue. I can help with legal questions involving tenancy, employment, consumers, contracts, online fraud, and similar matters.",
          intent: data.intent || "non-legal",
          isLegalIssue: false,
          nonLegalResponse: data.nonLegalResponse,
          clarificationQuestion: data.clarificationQuestion,
          isDemoMode: data.isDemoMode,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        return;
      }

      const assistantMsg: ChatMessage = {
        id: "ai-" + Date.now(),
        role: "assistant",
        content: data.guidance?.understanding || "",
        intent: "legal",
        isLegalIssue: true,
        guidance: data.guidance,
        noticePrefill: data.suggestedNoticePrefill,
        isDemoMode: data.isDemoMode,
        scenarioId: data.scenarioId,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      const isTimeout = err.name === "AbortError";
      const errorMsg: ChatMessage = {
        id: "err-" + Date.now(),
        role: "assistant",
        content: isTimeout 
          ? "The AI engine took too long to respond. Please check if the Python backend is running on port 8000 and try again."
          : `I encountered an issue processing your query: ${err.message || "Unknown error"}. Please check your connection or backend logs.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setInput("");
  };

  const copyAdvice = (message: ChatMessage) => {
    if (!message.guidance) return;
    const g = message.guidance;
    const text = `NYAY MITRA AI - LEGAL CLARITY REPORT
Problem: ${g.understanding}
Legal Domain: ${g.legalArea}

Rights:
${(g.possibleRights || []).map((r, i) => `${i + 1}. ${r}`).join("\n")}

Laws & Statutes:
${(g.relevantLaws || []).map((l) => `- ${l.provision} of ${l.act}: ${l.details}`).join("\n")}

Next Steps:
${(g.nextSteps || []).map((s, i) => `${i + 1}. ${s}`).join("\n")}

Disclaimer: General information only. Not substitute for a qualified lawyer.`;

    navigator.clipboard.writeText(text);
    setCopiedId(message.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const bridgeToNotice = (noticePrefill?: NoticePrefill) => {
    if (noticePrefill) {
      // Store in sessionStorage so /notices can automatically load it
      if (typeof window !== "undefined") {
        sessionStorage.setItem("nyay_notice_prefill", JSON.stringify(noticePrefill));
      }
    }
    router.push("/notices");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 w-full flex flex-col flex-1">
      {/* Top Header & Clear Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E3A5F] flex items-center gap-2.5">
            <Scale className="w-6 h-6 text-gold-400" />
            <span>AI Legal Consultation</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Explain your legal problem in plain language. Nyay Mitra identifies rights, laws, and next steps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-rose-400 bg-white border border-slate-200 hover:border-rose-500/30 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Consultation</span>
            </button>
          )}
        </div>
      </div>

      {/* Global Non-intrusive Disclaimer */}
      <div className="my-3">
        <LegalDisclaimer compact />
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto min-h-[380px] max-h-[600px] py-4 space-y-6">
        {messages.length === 0 ? (
          /* Empty State / Welcome Guide */
          <div className="py-6 sm:py-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-white border border-gold-500/30 flex items-center justify-center mx-auto text-gold-400 shadow-gold-glow">
              <Gavel className="w-8 h-8" />
            </div>

            <div className="max-w-lg mx-auto space-y-2">
              <h2 className="text-lg sm:text-xl font-bold text-[#1E3A5F]">
                How Can Nyay Mitra Help You Today?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Describe any dispute with your landlord, employer, online seller, bank, or consumer provider. Speak or type in simple words.
              </p>
            </div>

            {/* Suggested Hackathon Scenarios */}
            <div className="max-w-2xl mx-auto text-left space-y-3 pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span>Try an example legal issue (Judge Demo Scenarios):</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {EXAMPLE_QUERIES.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q.text)}
                    className="p-3 text-left rounded-xl bg-white border border-slate-200 hover:border-amber-500/40 hover:bg-slate-50 transition-all group shadow-sm"
                  >
                    <span className="text-xs font-semibold text-gold-400 group-hover:text-gold-300 block mb-1">
                      {q.label}
                    </span>
                    <span className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      &ldquo;{q.text}&rdquo;
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Message Flow */
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              {/* User Bubble */}
              {msg.role === "user" ? (
                <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-tr-none p-4 bg-white border border-slate-200 text-slate-800 shadow-sm">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <span className="text-[11px] font-semibold text-gold-300">You (Citizen)</span>
                    <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              ) : (
                /* Assistant Structured Legal Guidance */
                <div className="w-full max-w-3xl rounded-2xl rounded-tl-none p-5 sm:p-6 bg-white border border-slate-200 text-slate-700 shadow-elevated space-y-6">
                  {/* Header with Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        msg.intent === "ambiguous"
                          ? "bg-amber-500/20 border border-amber-500/40 text-amber-400"
                          : msg.isLegalIssue === false
                          ? "bg-blue-500/20 border border-blue-500/40 text-blue-400"
                          : "bg-gold-500/20 border border-gold-500/40 text-gold-400"
                      }`}>
                        {msg.intent === "ambiguous" ? (
                          <HelpCircle className="w-4 h-4" />
                        ) : msg.isLegalIssue === false ? (
                          <Sparkles className="w-4 h-4" />
                        ) : (
                          <Scale className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-800">
                          {msg.intent === "ambiguous"
                            ? "Clarification Needed"
                            : msg.isLegalIssue === false
                            ? "Nyay Mitra Assistant"
                            : "Nyay Mitra Legal Analysis"}
                        </span>
                        {msg.isDemoMode && msg.isLegalIssue !== false && (
                          <span className="ml-2 px-2 py-0.5 text-[10px] font-medium rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300">
                            Demo Engine
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {msg.guidance && (
                        <button
                          onClick={() => copyAdvice(msg)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded text-xs text-slate-500 hover:text-rose-800 bg-slate-200 hover:bg-slate-100 transition-colors"
                          title="Copy structured guidance"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      )}
                      <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                    </div>
                  </div>

                  {msg.isLegalIssue === false ? (
                    msg.intent === "ambiguous" ? (
                      /* Ambiguous query: Short clarification question */
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-950/30 border border-amber-500/40">
                          <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                          <div className="space-y-1.5">
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                              Context Required Before Legal Analysis
                            </span>
                            <p className="text-sm text-slate-800 leading-relaxed font-medium">
                              {msg.clarificationQuestion || msg.content}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 pl-1">
                          Please reply with these details so Nyay Mitra AI can identify the specific Indian statute (e.g. Tenancy, Labour, or Consumer Protection) and practical next steps.
                        </p>
                      </div>
                    ) : (
                      /* Clear non-legal message: natural friendly response */
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-200/60 border border-slate-300">
                          <Sparkles className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                          <p className="text-sm text-slate-700 leading-relaxed">
                            {msg.nonLegalResponse || msg.content}
                          </p>
                        </div>
                        <p className="text-xs text-slate-500 pl-1">
                          Nyay Mitra AI is ready to help if you ever face a legal problem with a landlord, employer, seller, bank, or government authority.
                        </p>
                      </div>
                    )
                  ) : msg.guidance ? (
                    <div className="space-y-6 text-sm">
                      {/* --- PART 1: RISK SCORE GAUGE --- */}
                      {msg.guidance.riskScore && (
                        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-inner space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
                                Legal Risk Assessment
                              </div>
                              <div className="flex items-center gap-2">
                                <div className={`text-2xl font-black ${
                                  msg.guidance.riskScore.overallScore >= 75 ? "text-rose-500" :
                                  msg.guidance.riskScore.overallScore >= 50 ? "text-orange-400" :
                                  msg.guidance.riskScore.overallScore >= 25 ? "text-amber-400" :
                                  "text-emerald-400"
                                }`}>
                                  {msg.guidance.riskScore.overallScore}/100
                                </div>
                                <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                                  msg.guidance.riskScore.overallScore >= 75 ? "bg-rose-500/10 border-rose-500/30 text-rose-400" :
                                  msg.guidance.riskScore.overallScore >= 50 ? "bg-orange-500/10 border-orange-500/30 text-orange-400" :
                                  msg.guidance.riskScore.overallScore >= 25 ? "bg-amber-500/10 border-amber-500/30 text-amber-400" :
                                  "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                }`}>
                                  {msg.guidance.riskScore.label}
                                </span>
                              </div>
                            </div>
                            
                            {/* Visual Meter */}
                            <div className="w-full sm:w-48 h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
                              <div className="h-full bg-rose-500 transition-all" style={{ width: `${Math.max(0, msg.guidance.riskScore.overallScore)}%` }} />
                            </div>
                          </div>
                          
                          {/* Accordion: Why this score? */}
                          <details className="group border border-slate-200 rounded-xl bg-slate-50">
                            <summary className="px-4 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer flex justify-between items-center outline-none">
                              <span>Why this score? (Factor Breakdown)</span>
                              <span className="transition-transform group-open:rotate-180">▼</span>
                            </summary>
                            <div className="px-4 pb-4 pt-1 border-t border-slate-200/60 text-xs text-slate-600 space-y-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <div className="text-slate-500 font-medium">Urgency</div>
                                  <div>{msg.guidance.riskScore.urgency}</div>
                                </div>
                                <div>
                                  <div className="text-slate-500 font-medium">Severity</div>
                                  <div>{msg.guidance.riskScore.severity}</div>
                                </div>
                                <div>
                                  <div className="text-slate-500 font-medium">Evidence Strength</div>
                                  <div>{msg.guidance.riskScore.evidenceStrength}</div>
                                </div>
                                <div>
                                  <div className="text-slate-500 font-medium">Recurrence & Imbalance</div>
                                  <div>{msg.guidance.riskScore.recurrence} | {msg.guidance.riskScore.powerImbalance}</div>
                                </div>
                              </div>
                            </div>
                          </details>
                        </div>
                      )}
                      {/* Section A: Understanding */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-gold-400 font-semibold text-xs tracking-wider uppercase">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>A. Understanding Your Problem</span>
                        </div>
                        <p className="text-slate-700 pl-6 leading-relaxed">
                          {msg.guidance.understanding}
                        </p>
                      </div>

                      {/* Section B: Legal Area */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-gold-400 font-semibold text-xs tracking-wider uppercase">
                          <Gavel className="w-4 h-4" />
                          <span>B. Legal Area / Domain</span>
                        </div>
                        <div className="pl-6">
                          <span className="inline-block px-3 py-1 rounded-lg bg-slate-200 border border-slate-300 text-slate-800 font-medium text-xs">
                            {msg.guidance.legalArea}
                          </span>
                        </div>
                        {/* Jurisdiction Note */}
                        {msg.guidance.jurisdictionNote && (
                          <div className="pl-6 mt-2 p-3 rounded-xl bg-amber-950/30 border border-amber-700/40 text-xs text-amber-200 leading-relaxed">
                            {msg.guidance.jurisdictionNote}
                          </div>
                        )}
                      </div>

                      {/* Section C: Possible Legal Rights */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs tracking-wider uppercase">
                          <Scale className="w-4 h-4" />
                          <span>C. Your Potential Legal Rights</span>
                        </div>
                        {msg.guidance?.possibleRights?.length ? (
                          <ul className="pl-6 space-y-2">
                            {msg.guidance.possibleRights.map((right, rIdx) => (
                              <li key={rIdx} className="flex items-start gap-2.5 text-slate-600">
                                <span className="w-5 h-5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-xs flex items-center justify-center shrink-0 mt-0.5">
                                  {rIdx + 1}
                                </span>
                                <span className="leading-relaxed">{right}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>

                      {/* Section D: Relevant Law / Provision */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gold-400 font-semibold text-xs tracking-wider uppercase">
                          <BookMarked className="w-4 h-4" />
                          <span>D. Relevant Indian Laws &amp; Provisions</span>
                        </div>
                        {msg.guidance?.relevantLaws?.length ? (
                          <div className="pl-6 grid grid-cols-1 gap-2.5">
                            {msg.guidance.relevantLaws.map((law, lIdx) => (
                              <div
                                key={lIdx}
                                className="p-3 rounded-xl bg-slate-200/60 border border-slate-300/80 space-y-1"
                              >
                                <div className="flex items-center justify-between text-xs gap-2 flex-wrap">
                                  <span className="font-bold text-slate-800">{law.act}</span>
                                  <span className="font-mono px-2 py-0.5 rounded bg-white text-gold-300 text-[11px] border border-gold-500/20">
                                    {law.provision}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed">{law.details}</p>
                                {law.sourceUrl && (
                                  <a
                                    href={law.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] text-blue-400 hover:text-blue-300 underline"
                                  >
                                    Source ↗
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>

                      {/* Section E: What You Should Do Next */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>E. Practical Next Steps for You</span>
                        </div>
                        {msg.guidance?.nextSteps?.length ? (
                          <ol className="pl-6 space-y-2">
                            {msg.guidance.nextSteps.map((step, sIdx) => (
                              <li key={sIdx} className="flex items-start gap-2.5 text-slate-600">
                                <span className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">
                                  {sIdx + 1}
                                </span>
                                <span className="leading-relaxed">{step}</span>
                              </li>
                            ))}
                          </ol>
                        ) : null}
                      </div>

                      {/* --- PART 2: AUTO EVIDENCE CHECKER --- */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs tracking-wider uppercase">
                          <FolderLock className="w-4 h-4" />
                          <span>F. Evidence &amp; Documents to Gather</span>
                        </div>
                        
                        {msg.guidance?.evidenceChecklist && msg.guidance.evidenceChecklist.length > 0 ? (
                          <div className="space-y-4 bg-white/60 p-4 rounded-xl border border-slate-200">
                            {/* Progress Bar */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-xs text-slate-500 font-medium">
                                <span>Collection Progress</span>
                                <span>
                                  {msg.guidance.evidenceChecklist.filter(e => checkedEvidence[`${msg.id}-${e.item}`]).length} of {msg.guidance.evidenceChecklist.length} collected
                                </span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-500 transition-all duration-500"
                                  style={{ 
                                    width: `${(msg.guidance.evidenceChecklist.filter(e => checkedEvidence[`${msg.id}-${e.item}`]).length / msg.guidance.evidenceChecklist.length) * 100}%` 
                                  }}
                                />
                              </div>
                            </div>
                            
                            {/* Checklist */}
                            <div className="space-y-2.5 pt-1">
                              {msg.guidance.evidenceChecklist.map((ev, eIdx) => {
                                const checkKey = `${msg.id}-${ev.item}`;
                                const isChecked = !!checkedEvidence[checkKey];
                                
                                return (
                                  <div 
                                    key={eIdx} 
                                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                                      isChecked 
                                        ? "bg-blue-500/10 border-blue-500/30" 
                                        : "bg-slate-950 border-slate-200 hover:border-slate-300"
                                    }`}
                                    onClick={() => toggleEvidence(checkKey)}
                                  >
                                    <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                      isChecked 
                                        ? "bg-blue-500 border-blue-500 text-slate-800" 
                                        : "border-slate-600"
                                    }`}>
                                      {isChecked && <Check className="w-2.5 h-2.5" />}
                                    </div>
                                    <div className="space-y-1 select-none w-full">
                                      <div className={`text-sm font-semibold transition-colors ${isChecked ? "text-blue-300" : "text-slate-700"}`}>
                                        {ev.item}
                                      </div>
                                      <div className="text-[11px] text-slate-500">
                                        <span className="font-semibold text-slate-500">Why: </span>{ev.why}
                                      </div>
                                      <div className="text-[11px] text-slate-500">
                                        <span className="font-semibold text-slate-500">How: </span>{ev.how}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            
                            <button
                              onClick={() => {
                                const collected = msg.guidance!.evidenceChecklist!
                                  .filter(e => checkedEvidence[`${msg.id}-${e.item}`])
                                  .map(e => `- ${e.item}`)
                                  .join("\\n");
                                if(collected) {
                                  navigator.clipboard.writeText("Evidence Collected:\\n" + collected);
                                  alert("Evidence summary copied! Paste this into the Draft Notice context.");
                                } else {
                                  alert("Please check at least one item first.");
                                }
                              }}
                              className="w-full mt-2 py-2 text-xs font-semibold rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/30 transition-colors flex items-center justify-center gap-1.5"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              Generate Evidence Summary
                            </button>
                          </div>
                        ) : msg.guidance?.documentsEvidence?.length ? (
                          <ul className="pl-6 space-y-1">
                            {msg.guidance.documentsEvidence.map((doc, dIdx) => (
                              <li key={dIdx} className="flex items-start gap-2 text-slate-600 text-xs sm:text-sm">
                                <span className="text-blue-400">&bull;</span>
                                <span>{doc}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>

                      {/* --- PART 3: SIMILAR CASES --- */}
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs tracking-wider uppercase">
                          <BookMarked className="w-4 h-4" />
                          <span>G. Similar Cases in Indian Context</span>
                        </div>
                        
                        {msg.guidance?.similarCases && msg.guidance.similarCases.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {msg.guidance.similarCases.map((caseItem, cIdx) => (
                              <div key={cIdx} className="p-4 bg-white border border-slate-300/60 rounded-xl flex flex-col gap-2 shadow-sm hover:border-slate-600 transition-colors">
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="font-semibold text-slate-700 text-sm leading-tight">{caseItem.title}</h4>
                                  <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-500 border border-slate-300/50">
                                    {caseItem.id}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                                  {caseItem.description}
                                </p>
                                <div className="pt-2 mt-auto border-t border-slate-200/80">
                                  <div className="text-[11px] font-medium text-emerald-400 mb-1">Resolution:</div>
                                  <p className="text-xs text-slate-600 leading-relaxed">
                                    {caseItem.resolution}
                                  </p>
                                </div>
                                <div className="p-2 mt-2 bg-purple-500/10 border border-purple-500/20 rounded text-[11px] text-purple-300">
                                  <span className="font-semibold text-purple-400">Match Reason:</span> {caseItem.matchReason}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 bg-slate-50 border border-slate-200 border-dashed rounded-xl flex items-center justify-center text-slate-500 text-xs text-center leading-relaxed">
                            No closely matching precedent or past scenarios found for this specific query.<br/>Consult a local advocate for a bespoke legal strategy.
                          </div>
                        )}
                      </div>

                      {/* Section G: When to Consider Professional Help */}
                      {msg.guidance?.professionalHelp ? (
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 text-slate-600">
                          <div className="font-semibold text-slate-700 flex items-center gap-1.5 text-amber-300">
                            <AlertCircle className="w-4 h-4" />
                            <span>G. When to Engage a Qualified Advocate:</span>
                          </div>
                          <p className="leading-relaxed text-slate-500">
                            {msg.guidance.professionalHelp}
                          </p>
                        </div>
                      ) : null}

                      {/* Follow-up Questions Alert (if any) */}
                      {msg.guidance.followupQuestions && msg.guidance.followupQuestions.length > 0 && (
                        <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/60 space-y-2">
                          <div className="flex items-center gap-2 text-blue-300 font-semibold text-xs uppercase tracking-wide">
                            <HelpCircle className="w-4 h-4 text-blue-400" />
                            <span>Clarifying Questions for Greater Accuracy:</span>
                          </div>
                          <ul className="space-y-1.5 text-xs text-blue-200 pl-6">
                            {msg.guidance.followupQuestions.map((fq, fIdx) => (
                              <li key={fIdx} className="list-disc">
                                {fq}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* BRIDGE TO LEGAL NOTICE GENERATION */}
                      <div className="pt-2 border-t border-slate-200">
                        <div className="p-4 rounded-xl bg-[#1E3A5F] border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <span className="font-bold text-white text-sm flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gold-400" />
                              Ready to take formal action?
                            </span>
                            <p className="text-xs text-slate-500">
                              Generate a legal demand notice template. You will need to fill in your personal details and verify the facts.
                              {msg.isDemoMode && (
                                <span className="ml-1 text-amber-400 font-medium">(Demo template — replace all sample fields with your actual information.)</span>
                              )}
                            </p>
                          </div>
                          <button
                            onClick={() => bridgeToNotice(msg.noticePrefill)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-navy-950 font-bold text-xs sm:text-sm shadow-gold-glow shrink-0 transition-all"
                          >
                            <span>Generate Legal Notice</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600 leading-relaxed">{msg.content}</p>
                  )}
                </div>
              )}
            </div>
          ))
        )}

        {/* Skeleton Loading Indicator */}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 shrink-0 mt-1">
              <Scale className="w-4 h-4 animate-spin" />
            </div>
            <div className="w-full max-w-3xl p-5 sm:p-6 rounded-2xl rounded-tl-none bg-white border border-slate-200 shadow-elevated space-y-6">
              {/* Fake Risk Score Gauge Loading */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-slate-200 rounded-md w-32 animate-pulse"></div>
                  <div className="h-6 bg-slate-200 rounded-md w-16 animate-pulse"></div>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full animate-pulse"></div>
              </div>
              
              <div className="h-4 bg-slate-200 rounded-md w-1/3 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-200 rounded-md w-full animate-pulse"></div>
                <div className="h-3 bg-slate-200 rounded-md w-5/6 animate-pulse"></div>
              </div>
              <div className="h-4 bg-slate-200 rounded-md w-1/4 animate-pulse pt-2"></div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-200 rounded-md w-full animate-pulse"></div>
                <div className="h-3 bg-slate-200 rounded-md w-4/5 animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="mt-4 pt-3 border-t border-slate-200 space-y-3">
        {/* Active Speech Recognition Banner */}
        {isListening && (
          <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-600 animate-pulse">
            <span className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              Listening to voice input in Indian English... Speak now.
            </span>
            <button
              onClick={toggleListening}
              className="font-bold underline hover:text-rose-800"
            >
              Stop
            </button>
          </div>
        )}

        <div className="relative flex items-center gap-2">
          {/* File Upload / Document Scanner Shortcut */}
          <button
            onClick={() => router.push("/documents")}
            className="p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-rose-800 transition-colors"
            title="Scan Agreement / Upload Document"
            aria-label="Upload document"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Voice Mic Button (Web Speech API) */}
          <button
            onClick={toggleListening}
            className={`p-3 rounded-xl border transition-all ${
              isListening
                ? "bg-rose-500 text-slate-800 border-rose-400 shadow-lg scale-105"
                : "bg-white border-slate-200 text-slate-500 hover:text-amber-600 hover:border-gold-500/30"
            }`}
            title={speechSupported ? "Voice Input (Speak your legal problem)" : "Voice input not supported on this browser"}
            aria-label="Toggle voice input"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Textarea / Input */}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Describe your legal issue (e.g., landlord not returning deposit, salary delay, defective item)..."
            rows={1}
            className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500 text-sm text-slate-800 placeholder-slate-500 outline-none resize-none transition-all"
          />

          {/* Send Button */}
          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || loading}
            className="p-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-navy-950 font-bold disabled:opacity-40 disabled:cursor-not-allowed shadow-gold-glow transition-all"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span>Press Enter to send &bull; Shift + Enter for new line</span>
          <span className="flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-amber-500" />
            General info only &bull; Not a lawyer
          </span>
        </div>
      </div>
    </div>
  );
};
