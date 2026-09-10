"use client";

import React from "react";
import { Loader2, Radio } from "lucide-react";

interface LiveProgressProps {
  location: string;
  niche: string;
}

export const LiveProgress: React.FC<LiveProgressProps> = ({ location, niche }) => {
  return (
    <div className="w-full glass-card rounded-2xl p-6 mb-8 border border-zinc-800 bg-zinc-950/80 shadow-2xl relative overflow-hidden animate-in fade-in duration-300">
      {/* Animated Monochrome Light Bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-zinc-900 overflow-hidden">
        <div className="h-full bg-white w-1/3 animate-[pulse_1.5s_ease-in-out_infinite] transform translate-x-full duration-700" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <Radio className="w-5 h-5 text-white animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Scouting Live Leads in {location}</span>
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              Querying Google Search & Maps for <strong className="text-zinc-200">{niche}</strong>, analyzing source code for Wix & Squarespace signatures...
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 self-start sm:self-auto">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
          <span>Analyzing HTML & CDN headers</span>
        </div>
      </div>
    </div>
  );
};
