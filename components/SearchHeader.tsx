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
    <header className="w-full border-b border-zinc-800 bg-black/90 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-white text-black flex items-center justify-center shadow-sm">
            <Globe2 className="w-5 h-5 text-black stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">
                Site Scout
              </span>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-700">
                Wappalyzer Core
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
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
                ? "bg-white text-black border-white shadow-sm font-semibold"
                : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Quick URL Inspector</span>
            <span className="sm:hidden">Inspect</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-all"
            title="API & Scraping Settings"
          >
            <Settings className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};
