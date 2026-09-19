import React from "react";
import { ShieldAlert, PhoneCall } from "lucide-react";

interface LegalDisclaimerProps {
  compact?: boolean;
  className?: string;
}

export const LegalDisclaimer: React.FC<LegalDisclaimerProps> = ({ compact = false, className = "" }) => {
  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700/90 ${className}`}>
        <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>
          <strong>Legal Disclaimer:</strong> Nyay Mitra AI provides general legal information & drafting assistance. It is not a substitute for advice from a qualified legal professional.
        </span>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-xl bg-white/80 border border-slate-200 text-slate-600 shadow-subtle ${className}`}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-600 shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-sm">
          <div className="font-semibold text-slate-800 flex items-center gap-2">
            Important Legal Information & Regulatory Disclaimer
          </div>
          <p className="text-slate-500 leading-relaxed text-xs sm:text-sm">
            Nyay Mitra AI provides general legal information and drafting assistance. It is not a substitute for advice from a qualified legal professional. No attorney-client relationship is created by using this platform.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 text-rose-600 font-medium">
              <PhoneCall className="w-3.5 h-3.5" /> Emergencies / Crime: Dial 112
            </span>
            <span className="flex items-center gap-1.5 text-blue-600 font-medium">
              <PhoneCall className="w-3.5 h-3.5" /> Cyber Fraud: Dial 1930
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <PhoneCall className="w-3.5 h-3.5" /> National Consumer Helpline: Dial 1915
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
