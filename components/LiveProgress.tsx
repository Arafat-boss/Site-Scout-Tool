"use client";

import React from "react";
import { Loader2, Radio } from "lucide-react";

interface LiveProgressProps {
  location: string;
  niche: string;
}

export const LiveProgress: React.FC<LiveProgressProps> = ({ location, niche }) => {
  return (
    <div className="w-full glass-card rounded-2xl p-6 mb-8 border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/60 shadow-2xl relative overflow-hidden animate-in fade-in duration-300">
      {/* Animated Light Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-amber-400 w-1/3 animate-[pulse_1s_ease-in-out_infinite] transform translate-x-full duration-700" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Radio className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </span>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Scouting Live Leads in {location}</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Querying Google Search & Maps for <strong className="text-slate-200">{niche}</strong>, analyzing source code for Wix & Squarespace signatures...
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-indigo-300 self-start sm:self-auto">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Analyzing HTML & CDN headers</span>
        </div>
      </div>
    </div>
  );
};
