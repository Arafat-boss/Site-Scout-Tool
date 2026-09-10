"use client";

import React, { useState } from "react";
import { Loader2, AlertCircle, Mail, Phone, Cpu, ArrowRight } from "lucide-react";
import { TechDetectionResult } from "@/lib/cms-detector";

export const QuickUrlInspector: React.FC = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TechDetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInspect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const wappKey = typeof window !== "undefined" ? localStorage.getItem("site_scout_wappalyzer_key") || undefined : undefined;
      const res = await fetch("/api/inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), wappalyzerApiKey: wappKey }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to inspect website");
      }

      setResult(data.result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Inspection failed");
    } finally {
      setLoading(false);
    }
  };

  const getCmsBadgeColor = (cms: string) => {
    switch (cms) {
      case "Wix":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "Squarespace":
        return "bg-violet-500/20 text-violet-300 border-violet-500/40";
      case "WordPress":
        return "bg-blue-500/20 text-blue-300 border-blue-500/40";
      case "Shopify":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      case "Webflow":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/40";
    }
  };

  return (
    <div className="w-full glass-card rounded-2xl p-5 mb-8 border border-violet-500/20 shadow-xl shadow-violet-950/20">
      <div className="flex items-center gap-2 mb-3">
        <Cpu className="w-4 h-4 text-violet-400" />
        <h3 className="text-sm font-semibold text-white tracking-wide uppercase">
          Quick Single Website Inspector
        </h3>
      </div>
      <p className="text-xs text-slate-400 mb-4">
        Paste any direct website URL to instantly sniff its CMS, Wappalyzer signatures, contact info, and response speed.
      </p>

      <form onSubmit={handleInspect} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="e.g. https://example-business.com"
            className="w-full h-11 px-4 text-sm bg-slate-900/90 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="h-11 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <span>Inspect Tech</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-300">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Detected CMS</span>
            <div className="mt-2 flex items-center gap-2">
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${getCmsBadgeColor(result.cms)}`}>
                {result.cms}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {result.confidence}% confidence
              </span>
            </div>
            <span className="text-[11px] text-slate-500 mt-2">
              Latency: {result.responseTimeMs}ms
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 md:col-span-2">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Tech Stack & Tags</span>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {result.technologies.length > 0 ? (
                result.technologies.map((tech, i) => (
                  <span key={i} className="px-2 py-0.5 text-[11px] bg-white/5 border border-white/10 rounded-md text-slate-200">
                    {tech}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">No third-party signatures found</span>
              )}
            </div>
            {(result.emails.length > 0 || result.phones.length > 0) && (
              <div className="mt-3 pt-2 border-t border-white/5 flex flex-wrap gap-3 text-xs text-slate-300">
                {result.emails[0] && (
                  <span className="flex items-center gap-1 text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" />
                    {result.emails[0]}
                  </span>
                )}
                {result.phones[0] && (
                  <span className="flex items-center gap-1 text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    {result.phones[0]}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
