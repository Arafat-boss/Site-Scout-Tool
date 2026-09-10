"use client";

import React, { useState } from "react";
import { X, Key, ShieldCheck, Check, Cpu } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (keys: { serpApiKey?: string; serperApiKey?: string; wappalyzerApiKey?: string }) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [serpApiKey, setSerpApiKey] = useState(() => {
    return typeof window !== "undefined" ? localStorage.getItem("site_scout_serp_key") || "" : "";
  });
  const [serperApiKey, setSerperApiKey] = useState(() => {
    return typeof window !== "undefined" ? localStorage.getItem("site_scout_serper_key") || "" : "";
  });
  const [wappalyzerApiKey, setWappalyzerApiKey] = useState(() => {
    return typeof window !== "undefined" ? localStorage.getItem("site_scout_wappalyzer_key") || "" : "";
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("site_scout_serp_key", serpApiKey.trim());
      localStorage.setItem("site_scout_serper_key", serperApiKey.trim());
      localStorage.setItem("site_scout_wappalyzer_key", wappalyzerApiKey.trim());
    }
    onSave({
      serpApiKey: serpApiKey.trim() || undefined,
      serperApiKey: serperApiKey.trim() || undefined,
      wappalyzerApiKey: wappalyzerApiKey.trim() || undefined,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("site_scout_serp_key");
      localStorage.removeItem("site_scout_serper_key");
      localStorage.removeItem("site_scout_wappalyzer_key");
    }
    setSerpApiKey("");
    setSerperApiKey("");
    setWappalyzerApiKey("");
    onSave({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg glass-dropdown rounded-2xl p-6 shadow-2xl relative border border-zinc-800 bg-zinc-950 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-900 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-lg bg-zinc-900 text-white border border-zinc-800">
            <Key className="w-5 h-5 text-zinc-300" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Engine & API Settings</h3>
            <p className="text-xs text-zinc-400">Optional API keys for scaling searches</p>
          </div>
        </div>

        <div className="my-4 p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-zinc-300" />
          <span>
            <strong>100% Free Engine is Active:</strong> Site Scout automatically uses the built-in free web scraper & Wappalyzer scanner without needing any API keys.
          </span>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Wappalyzer API Key */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-zinc-400" />
              Official Wappalyzer API Key (Optional)
            </label>
            <input
              type="password"
              value={wappalyzerApiKey}
              onChange={(e) => setWappalyzerApiKey(e.target.value)}
              placeholder="Paste Wappalyzer v2 API Key"
              className="w-full h-10 px-3 text-xs bg-black border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 font-mono"
            />
            <p className="text-[11px] text-zinc-500 mt-1 font-mono">
              Connects directly to <code>api.wappalyzer.com/v2/lookup/</code> for official technology lookups.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              SerpApi Key (Optional)
            </label>
            <input
              type="password"
              value={serpApiKey}
              onChange={(e) => setSerpApiKey(e.target.value)}
              placeholder="Paste SerpApi Private Key"
              className="w-full h-10 px-3 text-xs bg-black border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 font-mono"
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              Provides Google Maps Direct API results.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Serper.dev Key (Optional)
            </label>
            <input
              type="password"
              value={serperApiKey}
              onChange={(e) => setSerperApiKey(e.target.value)}
              placeholder="Paste Serper API Key"
              className="w-full h-10 px-3 text-xs bg-black border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 font-mono"
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              Includes 2,500 free queries upon registration.
            </p>
          </div>

          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
            >
              Reset to Free Default
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-white text-black hover:bg-zinc-200 shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-black" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Configuration</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
