"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Printer,
  Calendar,
  AlertCircle,
  Building,
  User,
  ShieldCheck,
} from "lucide-react";
import { DEMO_SCENARIOS, NoticePrefill } from "@/lib/ai/demo-scenarios";
import { generateLegalNoticePDF } from "@/lib/pdf/generator";

export const NoticeForm: React.FC = () => {
  const [formData, setFormData] = useState<NoticePrefill>({
    noticeType: "",
    senderName: "",
    senderAddress: "",
    senderPhone: "",
    senderEmail: "",
    recipientName: "",
    recipientDesignation: "",
    recipientCompany: "",
    recipientAddress: "",
    jurisdiction: "",
    transactionDate: "",
    amountInvolved: "",
    disputeDescription: "",
    legalBasis: "",
    reliefRequested: "",
    deadlineDays: 15,
  });

  const [draftText, setDraftText] = useState("");
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [isDemoLoaded, setIsDemoLoaded] = useState(false);
  const [timelineEvents, setTimelineEvents] = useState<{date: string, description: string}[]>([]);

  // Check if there is prefill data from the AI chat consultation.
  // If /notices is opened directly (no prefill), start with a blank form — do NOT auto-load demo data.
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("nyay_notice_prefill");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setFormData(parsed);
          setIsDemoLoaded(!!parsed.senderName?.includes("Demo Sample"));
          generateDraft(parsed);
          sessionStorage.removeItem("nyay_notice_prefill");
        } catch (e) {
          console.error("Failed to parse prefill data", e);
        }
      }
      // Do NOT fallback to a demo scenario for direct access — leave the form blank.
    }
  }, []);

  const loadScenario = (scenario: typeof DEMO_SCENARIOS[0]) => {
    setFormData(scenario.noticePrefill);
    setIsDemoLoaded(true);
    generateDraft(scenario.noticePrefill);
  };

  const addTimelineEvent = () => setTimelineEvents([...timelineEvents, { date: "", description: "" }]);
  const removeTimelineEvent = (idx: number) => setTimelineEvents(timelineEvents.filter((_, i) => i !== idx));
  const updateTimelineEvent = (idx: number, field: "date" | "description", value: string) => {
    const updated = [...timelineEvents];
    updated[idx][field] = value;
    setTimelineEvents(updated);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "deadlineDays" ? Number(value) : value,
    }));
  };

  const generateDraft = async (dataToUse?: NoticePrefill) => {
    const data = dataToUse || formData;
    setGenerating(true);

    try {
      const res = await fetch("/api/notices/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Generation failed");
      const resData = await res.json();
      setDraftText(resData.draftText);
    } catch (err) {
      console.error(err);
      // Client-side fallback generation (safe — no fabricated fees or criminal threats)
      const today = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const jurisdictionLine = data.jurisdiction
        ? `\nApplicable Jurisdiction / State: ${data.jurisdiction}`
        : "";
      const deadlineClause = data.deadlineDays && data.deadlineDays > 0
        ? `\n4. COMPLIANCE TIMELINE:\n   You are requested to address the above demands within ${data.deadlineDays} days of receipt of this notice.`
        : "";
      const clientDraft = `LEGAL DEMAND NOTICE
(To be sent via Speed Post with Acknowledgement Due and/or Registered Email)

Date: ${today}${jurisdictionLine}

TO:
${data.recipientName}${data.recipientDesignation ? `, ${data.recipientDesignation}` : ""}
${data.recipientCompany ? `${data.recipientCompany}\n` : ""}${data.recipientAddress}

FROM:
${data.senderName}
${data.senderAddress}
${data.senderPhone ? `Phone: ${data.senderPhone}` : ""}${data.senderEmail ? ` | Email: ${data.senderEmail}` : ""}

SUBJECT: NOTICE IN THE MATTER OF ${data.noticeType.toUpperCase()}${data.amountInvolved ? ` — ${data.amountInvolved}` : ""}

Sir / Madam,

I hereby bring the following matter to your attention and request your prompt response:

1. BACKGROUND AND FACTS:
${data.transactionDate ? `   a) The relevant events took place on / around: ${data.transactionDate}.\n` : ""}
   ${data.disputeDescription}

2. LEGAL BASIS:
   ${data.legalBasis}

3. RELIEF / ACTION REQUESTED:
   ${data.reliefRequested}
${deadlineClause}

Please treat this notice as a formal communication and respond accordingly. A copy of this notice is retained for record purposes.

Yours faithfully,

___________________________
${data.senderName}
(Sender)

---
Note: This notice reflects only the facts as provided by the sender. If you believe any information is incorrect, please communicate in writing at the earliest.
Nyay Mitra AI — General legal drafting assistance. Not a substitute for qualified legal counsel.`;
      setDraftText(clientDraft);

    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draftText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    generateLegalNoticePDF(
      {
        title: formData.noticeType,
        senderName: formData.senderName || "Complainant",
        senderAddress: formData.senderAddress || "Address not provided",
        senderPhone: formData.senderPhone,
        senderEmail: formData.senderEmail,
        recipientName: formData.recipientName || "Opposite Party",
        recipientDesignation: formData.recipientDesignation,
        recipientCompany: formData.recipientCompany,
        recipientAddress: formData.recipientAddress || "Address not provided",
        jurisdiction: formData.jurisdiction,
        date: new Date().toLocaleDateString("en-IN"),
        amountInvolved: formData.amountInvolved,
        disputeDescription: formData.disputeDescription,
        legalBasis: formData.legalBasis,
        reliefRequested: formData.reliefRequested,
        deadlineDays: formData.deadlineDays,
        fullDraftText: draftText,
      },
      `${formData.noticeType.replace(/\s+/g, "_")}_Legal_Notice.pdf`
    );
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${formData.noticeType} - Legal Notice</title>
            <style>
              body { font-family: 'Times New Roman', serif; padding: 40px; line-height: 1.6; color: #111; }
              pre { white-space: pre-wrap; font-family: inherit; }
            </style>
          </head>
          <body>
            <pre>${draftText}</pre>
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gold-500/15 border border-gold-500/30 text-amber-600">
              Statutory Drafting Tool
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Advocate Format
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E3A5F] mt-1">
            Professional Legal Notice Generator
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Draft an authoritative, legally grounded demand notice formatted in accordance with Indian procedural practice. Review, customize, copy, and download as PDF.
          </p>
        </div>

        {/* Demo Preset Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Load Demo Template:</span>
          <div className="flex flex-wrap gap-1.5">
            {DEMO_SCENARIOS.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => loadScenario(scenario)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 hover:border-gold-500/40 text-slate-600 hover:text-amber-600 transition-all"
              >
                [Demo] {scenario.category.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Split-Screen Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Inputs (7 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-subtle space-y-5">
            <h2 className="text-base font-bold text-[#1E3A5F] flex items-center gap-2 border-b border-slate-200 pb-3">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>1. Notice & Dispute Details</span>
            </h2>

            {/* Demo Data Warning */}
            {isDemoLoaded && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Demo Data loaded.</strong> All fields are illustrative sample content. Replace every field with your actual details before sending this notice. Do not send this notice with placeholder values.
                </span>
              </div>
            )}

            {/* Notice Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Notice Type / Purpose *
              </label>
              <input
                type="text"
                name="noticeType"
                value={formData.noticeType}
                onChange={handleInputChange}
                placeholder="e.g. Demand for Refund of Security Deposit, Unpaid Salary Arrears"
                className="w-full px-3.5 py-2 rounded-xl bg-[#F8F6F0] border border-slate-200 focus:border-gold-500 text-sm text-slate-800 outline-none"
              />
            </div>

            {/* Sender Details */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Sender (Your Details)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    name="senderName"
                    value={formData.senderName}
                    onChange={handleInputChange}
                    placeholder="Your Full Name"
                    className="w-full px-3 py-2 rounded-lg bg-[#F8F6F0] border border-slate-200 text-sm text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="senderPhone"
                    value={formData.senderPhone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-lg bg-[#F8F6F0] border border-slate-200 text-sm text-slate-800 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="senderEmail"
                    value={formData.senderEmail}
                    onChange={handleInputChange}
                    placeholder="yourname@example.com"
                    className="w-full px-3 py-2 rounded-lg bg-[#F8F6F0] border border-slate-200 text-sm text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Postal Address *</label>
                  <input
                    type="text"
                    name="senderAddress"
                    value={formData.senderAddress}
                    onChange={handleInputChange}
                    placeholder="House/Flat No, Street, City, State, PIN"
                    className="w-full px-3 py-2 rounded-lg bg-[#F8F6F0] border border-slate-200 text-sm text-slate-800 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" /> Recipient (Opposite Party Details)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Recipient / Officer Name *</label>
                  <input
                    type="text"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleInputChange}
                    placeholder="Opposite Party / Landlord / MD"
                    className="w-full px-3 py-2 rounded-lg bg-[#F8F6F0] border border-slate-200 text-sm text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Company / Entity (If Any)</label>
                  <input
                    type="text"
                    name="recipientCompany"
                    value={formData.recipientCompany || ""}
                    onChange={handleInputChange}
                    placeholder="Company or Organization Name"
                    className="w-full px-3 py-2 rounded-lg bg-[#F8F6F0] border border-slate-200 text-sm text-slate-800 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Official Address *</label>
                <input
                  type="text"
                  name="recipientAddress"
                  value={formData.recipientAddress}
                  onChange={handleInputChange}
                  placeholder="Premises address or Registered Corporate Office"
                  className="w-full px-3 py-2 rounded-lg bg-[#F8F6F0] border border-slate-200 text-sm text-slate-800 outline-none"
                />
              </div>
              {/* Jurisdiction / State */}
              <div>
                <label className="block text-xs text-slate-500 mb-1">Jurisdiction / State <span className="text-amber-400">(Important for tenancy &amp; labour law)</span></label>
                <input
                  type="text"
                  name="jurisdiction"
                  value={formData.jurisdiction || ""}
                  onChange={handleInputChange}
                  placeholder="e.g. Karnataka, Maharashtra, Delhi NCT"
                  className="w-full px-3 py-2 rounded-lg bg-[#F8F6F0] border border-slate-200 text-sm text-slate-800 outline-none"
                />
              </div>
            </div>

            {/* Financials & Dates */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Transaction / Move-out Date</label>
                  <input
                    type="text"
                    name="transactionDate"
                    value={formData.transactionDate}
                    onChange={handleInputChange}
                    placeholder="e.g. 1st March 2024"
                    className="w-full px-3 py-2 rounded-lg bg-[#F8F6F0] border border-slate-200 text-sm text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Amount Involved (INR)</label>
                  <input
                    type="text"
                    name="amountInvolved"
                    value={formData.amountInvolved}
                    onChange={handleInputChange}
                    placeholder="₹ 1,20,000/-"
                    className="w-full px-3 py-2 rounded-lg bg-[#F8F6F0] border border-slate-200 text-sm text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Compliance Days</label>
                  <select
                    name="deadlineDays"
                    value={formData.deadlineDays}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg bg-[#F8F6F0] border border-slate-200 text-sm text-slate-800 outline-none"
                  >
                    <option value={7}>7 Days (Urgent)</option>
                    <option value={15}>15 Days (Standard Statutory)</option>
                    <option value={30}>30 Days</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Narrative Facts */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Statement of Disputed Facts *
                </label>
                <textarea
                  name="disputeDescription"
                  rows={3}
                  value={formData.disputeDescription}
                  onChange={handleInputChange}
                  placeholder="State the facts chronologically..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0] border border-slate-200 text-sm text-slate-800 outline-none resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Statutory / Legal Basis *
                </label>
                <textarea
                  name="legalBasis"
                  rows={2}
                  value={formData.legalBasis}
                  onChange={handleInputChange}
                  placeholder="e.g. Model Tenancy Act 2021 Section 13; Indian Contract Act 1872 Section 73..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0] border border-slate-200 text-sm text-slate-800 outline-none resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Specific Relief / Demand *
                </label>
                <textarea
                  name="reliefRequested"
                  rows={2}
                  value={formData.reliefRequested}
                  onChange={handleInputChange}
                  placeholder="e.g. Full refund of ₹1,20,000 with 12% interest per annum..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0] border border-slate-200 text-sm text-slate-800 outline-none resize-y"
                />
              </div>
            </div>

            {/* Regenerate Button */}
            <div className="pt-2">
              <button
                onClick={() => generateDraft()}
                disabled={generating}
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-100 border border-slate-200 text-amber-600 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${generating ? "animate-spin" : ""}`} />
                <span>Update / Regenerate Legal Notice Draft</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Legal Notice Preview & Actions (6 Cols) */}
        <div className="lg:col-span-6 space-y-4 sticky top-24">
          <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
              <span className="text-xs font-bold text-[#1E3A5F] uppercase tracking-wider">
                Live Legal Notice Preview
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditingDraft(!isEditingDraft)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200 bg-slate-100 border border-slate-200 transition-colors"
              >
                {isEditingDraft ? "Done Editing" : "Edit In-Place"}
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>

              <button
                onClick={handlePrint}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
                title="Print Notice"
              >
                <Printer className="w-4 h-4" />
              </button>

              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-navy-950 shadow-gold-glow transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
            </div>
          </div>

          {/* Paper Document Preview Container */}
          <div className="rounded-2xl bg-white text-slate-900 p-6 sm:p-8 shadow-2xl border border-slate-300 min-h-[550px] max-h-[720px] overflow-y-auto font-serif text-sm leading-relaxed">
            {/* Header Stamp */}
            <div className="text-center pb-4 border-b-2 border-navy-900/20 mb-6">
              <h3 className="font-bold tracking-widest text-sm text-navy-950 uppercase">
                FORMAL LEGAL DEMAND NOTICE
              </h3>
              <p className="text-[11px] text-slate-600 tracking-wider">
                ISSUED UNDER CIVIL PROCEDURE & RELEVANT STATUTORY CODES
              </p>
            </div>

            {isEditingDraft ? (
              <textarea
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                rows={22}
                className="w-full p-2 font-mono text-xs text-slate-900 bg-slate-50 border border-slate-300 rounded outline-none focus:ring-1 focus:ring-gold-500 leading-relaxed"
              />
            ) : (
              <div className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-slate-800 select-text">
                {draftText || "Fill the form or choose a demo scenario on the left to generate the notice draft."}
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            <span>
              Tip: Serve notice via India Post Speed Post with Acknowledgment Due (A.D.) and registered email.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
