"use client";

import React, { useState } from "react";
import {
  FileSearch,
  UploadCloud,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Users,
  IndianRupee,
  HelpCircle,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Activity,
  Timer,
} from "lucide-react";
import { AnalyzedDocumentResult } from "@/app/api/documents/analyze/route";
import Link from "next/link";

const SAMPLE_DOCS = [
  {
    name: "Sample Rent Agreement (Bengaluru Tenancy)",
    type: "Residential Tenancy Agreement",
    text: `RESIDENTIAL LEASE AGREEMENT
This Agreement of Tenancy is entered into on 1st Day of July 2023 at Bengaluru between:
LESSOR / LANDLORD: Mr. Suresh Kumar, residing at No. 12, Indiranagar, Bengaluru.
LESSEE / TENANT: Mr. Rahul Sharma, employed at TechCorp Solutions, Bengaluru.

WHEREAS the Lessor is absolute owner of Flat No. 402, Green Glen Layout, Bellandur, Bengaluru.
TERMS AND CONDITIONS:
1. TENURE: The lease shall be for 11 months commencing from 1st July 2023.
2. MONTHLY RENT: The Lessee agrees to pay Rs. 45,000/- per month on or before 5th of every English calendar month.
3. SECURITY DEPOSIT: The Lessee has paid an interest-free refundable deposit of Rs. 1,20,000/-.
4. UNILATERAL DEDUCTION CLAUSE: The Landlord reserves sole discretion to deduct repainting, cleaning, and repair expenses without providing third-party contractor bills or vendor invoices.
5. DISCONNECTION OF UTILITIES: In the event of rent delay exceeding 10 days, the Landlord shall have the immediate right to disconnect electricity and water amenities to the premises.
6. LOCK-IN PERIOD: The tenant must observe a mandatory 6 months lock-in period. Vacating prior to lock-in shall cause forfeiture of 100% of the security deposit.
7. NOTICE PERIOD: 1 month written notice prior to vacating.

IN WITNESS WHEREOF the parties have signed below:
Lessor: [Signed]          Lessee: [Signed]`,
  },
  {
    name: "Sample Offer & Termination Letter (Gurugram)",
    type: "Employment Contract & Termination Notice",
    text: `APEX INNOVATIONS PRIVATE LIMITED
Regd Office: Tower A, Cyber City, Gurugram, Haryana - 122002

Date: 15th January 2024
To: Ms. Pooja Verma
Emp ID: AI-4029 | Designation: Senior Product Analyst

SUBJECT: SUMMARY TERMINATION OF EMPLOYMENT SERVICES

Dear Ms. Pooja,
This letter serves as formal notification that your employment with Apex Innovations Pvt Ltd is terminated with immediate effect as of close of business today, 15th January 2024.

TERMS OF SEPARATION & RESTRAINTS:
1. NOTICE PERIOD WAIVER: The company exercises its option to dispense with the contractual 60-day notice period. No salary in lieu of notice shall be provided.
2. WITHHOLDING OF ARREARS: Earned wages for the month of December 2023 and 15 days of January 2024, along with accrued leave encashment, are withheld pending internal administrative audits.
3. NON-COMPETE COVENANT: Under Section 14 of your original employment contract, you are strictly prohibited from seeking employment or consulting with any competitor or software technology company across India for a period of 12 months from this date.
4. CONFIDENTIALITY: All company data must be handed over.

For Apex Innovations Pvt Ltd,
Head of Human Resources & Legal`,
  },
];

export const DocumentUploader: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("General Legal Document");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalyzedDocumentResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setFileName(file.name);
    setFileType(file.type || "text/plain");

    // Check for image files to accurately explain OCR limitation
    if (file.type.startsWith("image/")) {
      setErrorMsg(
        "Notice: Image files require server-side OCR which is not enabled in this lightweight browser client. Please upload a .txt file, paste the document text below, or test with our sample agreements."
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInputText(text);
    };
    reader.readAsText(file);
  };

  const loadSample = (sample: typeof SAMPLE_DOCS[0]) => {
    setErrorMsg(null);
    setFileName(sample.name);
    setFileType(sample.type);
    setInputText(sample.text);
    triggerAnalysis(sample.name, sample.type, sample.text);
  };

  const triggerAnalysis = async (name?: string, type?: string, text?: string) => {
    const textToAnalyze = text || inputText;
    if (!textToAnalyze || textToAnalyze.trim().length < 20) {
      setErrorMsg("Please provide at least 20 characters of document text to analyze.");
      return;
    }

    setAnalyzing(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/documents/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: name || fileName || "Uploaded_Document.txt",
          fileType: type || fileType || "Legal Document",
          textContent: textToAnalyze,
          fileSize: textToAnalyze.length,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze document");
      }

      setResult(data.analysis);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to analyze document.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-400">
            Document Intelligence & Risk Scanner
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1E3A5F]">
          Legal Agreement & Contract Analyzer
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-3xl">
          Upload or paste your rent agreement, employment letter, salary document, or notice. Nyay Mitra identifies parties, critical dates, financial obligations, and red-flags unlawful or unfair clauses under Indian statutes.
        </p>
      </div>

      {/* Quick Sample Presets */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Test Instant Sample Contracts:</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_DOCS.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => loadSample(sample)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-100 text-amber-600 border border-gold-500/20 hover:border-gold-500/50 transition-all"
            >
              {sample.name}
            </button>
          ))}
        </div>
      </div>

      {/* Upload Box / Input Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
            <h2 className="text-sm font-bold text-[#1E3A5F] flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-amber-600" />
              <span>Upload or Paste Document</span>
            </h2>

            {/* Drag & Drop File Input */}
            <label className="border-2 border-dashed border-slate-200 hover:border-gold-500/50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50">
              <UploadCloud className="w-8 h-8 text-slate-500 mb-2" />
              <span className="text-xs font-semibold text-slate-700">
                Click to upload text document (.txt, .md, .doc)
              </span>
              <span className="text-[11px] text-slate-500 mt-1">
                (Note: Scanned photo OCR is clearly flagged if unsupported)
              </span>
              <input
                type="file"
                accept=".txt,.md,.doc,.json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {fileName && (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8F6F0] border border-slate-200 text-xs">
                <span className="text-slate-600 font-medium truncate max-w-[220px]">
                  {fileName}
                </span>
                <span className="text-amber-600 text-[11px] uppercase">{fileType}</span>
              </div>
            )}

            {/* Paste Text directly */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Or Paste Document Content:
              </label>
              <textarea
                rows={10}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste clauses, lease terms, or contract text here..."
                className="w-full p-3 rounded-xl bg-[#F8F6F0] border border-slate-200 focus:border-gold-500 text-xs font-mono text-slate-700 outline-none resize-y"
              />
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Analyze CTA */}
            <button
              onClick={() => triggerAnalysis()}
              disabled={analyzing || !inputText.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-navy-950 font-bold text-sm shadow-gold-glow flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <FileSearch className={`w-4 h-4 ${analyzing ? "animate-spin" : ""}`} />
              <span>{analyzing ? "Scanning Clauses..." : "Analyze Document"}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Analysis Results (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="space-y-6 animate-fadeIn">
                            {/* Threat & Urgency Meter */}
              {(result as any).riskScore !== undefined && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-amber-600" /> Legal Risk Score
                      </span>
                      <div className="text-3xl font-extrabold text-[#1E3A5F]">
                        {(result as any).riskScore}<span className="text-lg text-slate-400">/100</span>
                      </div>
                    </div>
                    {/* Visual Gauge (Simple CSS Circle or Bar) */}
                    <div className="relative w-16 h-16 rounded-full flex items-center justify-center text-rose-500 font-bold bg-rose-50 border-4 border-rose-500">
                      High
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Timer className="w-3.5 h-3.5 text-blue-500" /> Respond By
                      </span>
                      <div className="text-3xl font-extrabold text-[#1E3A5F]">
                        {(result as any).respondByDays} <span className="text-lg text-slate-400">Days</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                      <Timer className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              )}

              {/* Summary Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-gold-500/15 text-amber-600 border border-gold-500/30">
                    {result.fileType}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Analysis Complete
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#1E3A5F]">Executive Plain-Language Summary</h3>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {result.aiSummary}
                </p>

                {/* Parties Identified */}
                <div className="pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2">
                    <Users className="w-3.5 h-3.5 text-blue-400" /> Parties Identified:
                  </span>
                  {result.parties?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {result.parties.map((p, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-lg bg-slate-100 text-xs font-medium text-slate-700 border border-slate-200"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">None detected</span>
                  )}
                </div>
              </div>

              {/* Red-Flagged Risky / Unlawful Clauses */}
              {result.flaggedClauses?.length ? (
                <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
                  <h3 className="text-base font-bold text-[#1E3A5F] flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                    <span>Flagged Clauses & Legal Vulnerabilities ({result.flaggedClauses.length})</span>
                  </h3>

                  <div className="space-y-3">
                    {result.flaggedClauses.map((clause, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-[#F8F6F0]/80 border border-slate-200 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-slate-800">{clause.clauseName}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              clause.riskLevel === "high"
                                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                : clause.riskLevel === "medium"
                                ? "bg-amber-500/20 text-amber-700 border border-amber-500/30"
                                : "bg-blue-500/20 text-blue-700 border border-blue-500/30"
                            }`}
                          >
                            {clause.riskLevel} Risk
                          </span>
                        </div>

                        <div className="text-xs font-mono text-slate-500 italic bg-white p-2 rounded border border-slate-200">
                          &ldquo;{clause.textExcerpt}&rdquo;
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed pt-1">
                          <strong className="text-amber-600 font-semibold">Legal Impact: </strong>
                          {clause.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Dates & Financial Obligations Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Important Dates */}
                {result.keyDates?.length ? (
                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" /> Key Dates & Tenures
                    </span>
                    <ul className="space-y-2 text-xs">
                      {result.keyDates.map((d, idx) => (
                        <li key={idx} className="p-2 rounded bg-slate-50 border border-slate-200">
                          <div className="font-bold text-slate-700">{d.label}: <span className="text-amber-600 font-normal">{d.date}</span></div>
                          <div className="text-slate-500 mt-0.5">{d.implication}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {/* Financial Terms */}
                {result.financialTerms?.length ? (
                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <IndianRupee className="w-3.5 h-3.5 text-emerald-400" /> Financial Commitments
                    </span>
                    <ul className="space-y-2 text-xs">
                      {result.financialTerms.map((f, idx) => (
                        <li key={idx} className="p-2 rounded bg-slate-50 border border-slate-200">
                          <div className="font-bold text-slate-700">{f.item}: <span className="text-emerald-300 font-normal">{f.amount}</span></div>
                          <div className="text-slate-500 mt-0.5">{f.condition}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              {/* Redressal Action Bridge */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#1E3A5F] to-[#162D4A] border border-gold-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-[#1E3A5F]">Discovered an unfair clause or dispute?</h4>
                  <p className="text-xs text-slate-500">Consult with Nyay Mitra AI or generate a legal notice to safeguard your rights.</p>
                </div>
                <Link
                  href="/chat"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-bold shrink-0 transition-all shadow-gold-glow"
                >
                  <span>Consult in AI Chat</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="p-10 rounded-2xl bg-white/80 border border-slate-200 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-500">
                <FileSearch className="w-7 h-7" />
              </div>
              <div className="max-w-sm mx-auto space-y-1">
                <h3 className="text-base font-bold text-[#1E3A5F]">No Document Analyzed Yet</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Upload an agreement or choose one of the sample contracts on the top left to see real-time clause extraction, date monitoring, and risk detection.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
