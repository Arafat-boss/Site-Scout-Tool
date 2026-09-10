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
      case "Squarespace":
        return "bg-zinc-900 dark:bg-white text-white dark:text-black font-bold border-zinc-900 dark:border-white shadow-sm";
      case "WordPress":
      case "Shopify":
      case "Webflow":
        return "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700";
      default:
        return "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800";
    }
  };

  return (
    <div className="w-full glass-card rounded-md p-5 mb-8 border border-zinc-200 dark:border-zinc-800 shadow-xl transition-all">
      <div className="flex items-center gap-2 mb-3">
        <Cpu className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-wide uppercase">
          Quick Single Website Inspector
        </h3>
      </div>
      <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-4">
        Paste any direct website URL to instantly sniff its CMS, Wappalyzer signatures, contact info, and response speed.
      </p>

      <form onSubmit={handleInspect} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="e.g. https://example-business.com"
            className="w-full h-11 px-4 text-sm bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-500 transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="h-11 px-6 rounded bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-current" />
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
        <div className="mt-4 p-3 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-zinc-500 dark:text-zinc-400" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="mt-5 pt-4 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-300">
          <div className="p-3.5 rounded bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Detected CMS</span>
            <div className="mt-2 flex items-center gap-2">
              <span className={`px-2.5 py-1 text-xs font-medium rounded-sm border ${getCmsBadgeColor(result.cms)}`}>
                {result.cms}
              </span>
              <span className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">
                {result.confidence}% confidence
              </span>
            </div>
            <span className="text-[11px] text-zinc-500 mt-2 font-mono">
              Latency: {result.responseTimeMs}ms
            </span>
          </div>

          <div className="p-3.5 rounded bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 md:col-span-2">
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Tech Stack & Tags</span>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {result.technologies.length > 0 ? (
                result.technologies.map((tech, i) => (
                  <span key={i} className="px-2 py-0.5 text-[11px] bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-sm text-zinc-800 dark:text-zinc-300 font-mono shadow-xs">
                    {tech}
                  </span>
                ))
              ) : (
                <span className="text-xs text-zinc-500 italic">No third-party signatures found</span>
              )}
            </div>
            {(result.emails.length > 0 || result.phones.length > 0) && (
              <div className="mt-3 pt-2 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-3 text-xs text-zinc-700 dark:text-zinc-300 font-mono">
                {result.emails[0] && (
                  <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                    <Mail className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                    {result.emails[0]}
                  </span>
                )}
                {result.phones[0] && (
                  <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                    <Phone className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
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
