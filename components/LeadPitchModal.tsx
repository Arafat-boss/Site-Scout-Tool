"use client";

import React, { useState } from "react";
import { X, Sparkles, Copy, Check, ExternalLink, ShieldAlert, Send } from "lucide-react";
import { EnrichedLead } from "@/app/api/scout/route";
import { generatePitchProposal } from "@/lib/pitch-generator";

interface LeadPitchModalProps {
  lead: EnrichedLead | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LeadPitchModal: React.FC<LeadPitchModalProps> = ({ lead, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !lead) return null;

  const proposal = generatePitchProposal(lead);

  const handleCopy = () => {
    const fullText = `Subject: ${proposal.subject}\n\n${proposal.body}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenEmail = () => {
    const emailTo = lead.emails[0] || "";
    const mailtoUrl = `mailto:${emailTo}?subject=${encodeURIComponent(proposal.subject)}&body=${encodeURIComponent(proposal.body)}`;
    window.open(mailtoUrl, "_blank");
  };

  const getCmsBadgeColor = (cms: string) => {
    switch (cms) {
      case "Wix":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "Squarespace":
        return "bg-violet-500/20 text-violet-300 border-violet-500/40";
      case "WordPress":
        return "bg-blue-500/20 text-blue-300 border-blue-500/40";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/40";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl glass-dropdown rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-white/10 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/5 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-violet-500/20 text-amber-300 border border-white/10">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white">{lead.name}</h3>
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-lg border ${getCmsBadgeColor(lead.cms)}`}>
                {lead.cms}
              </span>
            </div>
            <a
              href={lead.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-400 hover:underline flex items-center gap-1 mt-0.5"
            >
              <span>{lead.website}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Key Weaknesses / Pitch Angle */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            Detected Redesign & Optimization Angles
          </h4>
          <ul className="space-y-1.5">
            {proposal.keyIssues.map((issue, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Outreach Proposal Preview */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Subject Line
            </label>
            <input
              type="text"
              readOnly
              value={proposal.subject}
              className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-white/10 rounded-xl text-white font-medium focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Personalized Cold Email / Outreach Message
            </label>
            <textarea
              readOnly
              rows={8}
              value={proposal.body}
              className="w-full p-3.5 text-xs bg-slate-950 border border-white/10 rounded-xl text-slate-200 font-mono focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-400">
            {lead.emails[0] ? `Recipient: ${lead.emails[0]}` : "No email detected (use contact form or LinkedIn)"}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-white/10 flex items-center gap-1.5 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-300" />
                  <span>Copy Message</span>
                </>
              )}
            </button>
            <button
              onClick={handleOpenEmail}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/25 flex items-center gap-1.5 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Open in Mail</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
