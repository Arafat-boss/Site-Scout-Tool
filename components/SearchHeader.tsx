"use client";

import React from "react";
import { Globe2, Settings, Terminal } from "lucide-react";

interface SearchHeaderProps {
  onOpenSettings: () => void;
  onToggleQuickInspect: () => void;
  showQuickInspect: boolean;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  onOpenSettings,
  onToggleQuickInspect,
  showQuickInspect,
}) => {
  return (
    <header className="w-full border-b border-white/10 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-fuchsia-500 p-0.5 shadow-lg shadow-indigo-500/25">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Globe2 className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Site Scout
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Wappalyzer Core
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Location & CMS Lead Discovery Engine
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onToggleQuickInspect}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all border ${
              showQuickInspect
                ? "bg-violet-500/20 text-violet-300 border-violet-500/40 shadow-sm shadow-violet-500/20"
                : "bg-slate-900/80 text-slate-300 border-white/10 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Quick URL Inspector</span>
            <span className="sm:hidden">Inspect</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900/80 text-slate-300 border border-white/10 hover:bg-slate-800 hover:text-white transition-all"
            title="API & Scraping Settings"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};
