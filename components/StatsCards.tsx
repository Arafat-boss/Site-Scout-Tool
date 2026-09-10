"use client";

import React from "react";
import { Globe2, Layers, Cpu, Activity } from "lucide-react";

interface StatsCardsProps {
  stats?: {
    total?: number;
    wix?: number;
    squarespace?: number;
    wordpress?: number;
    shopify?: number;
    webflow?: number;
    others?: number;
  };
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats = {} }) => {
  const total = stats?.total || 0;
  const wix = stats?.wix || 0;
  const squarespace = stats?.squarespace || 0;
  const wordpress = stats?.wordpress || 0;
  const shopify = stats?.shopify || 0;
  const webflow = stats?.webflow || 0;
  const others = stats?.others || 0;

  const otherPlatformsCount = wordpress + shopify + webflow + others;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
      {/* Total Scanned */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Scanned</span>
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Globe2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{total}</span>
          <span className="text-xs text-slate-400">websites</span>
        </div>
      </div>

      {/* Wix Detected */}
      <div className="glass-card rounded-2xl p-4 border border-amber-500/20 bg-amber-950/10 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-amber-300/80 uppercase tracking-wider">Wix Sites</span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-amber-300 tracking-tight">{wix}</span>
          <span className="text-xs text-amber-400/70 font-mono">
            {total > 0 ? `${Math.round((wix / total) * 100)}%` : "0%"}
          </span>
        </div>
      </div>

      {/* Squarespace Detected */}
      <div className="glass-card rounded-2xl p-4 border border-violet-500/20 bg-violet-950/10 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-violet-300/80 uppercase tracking-wider">Squarespace</span>
          <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <Cpu className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-violet-300 tracking-tight">{squarespace}</span>
          <span className="text-xs text-violet-400/70 font-mono">
            {total > 0 ? `${Math.round((squarespace / total) * 100)}%` : "0%"}
          </span>
        </div>
      </div>

      {/* WordPress & Others */}
      <div className="glass-card rounded-2xl p-4 border border-blue-500/20 bg-blue-950/10 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-blue-300/80 uppercase tracking-wider">WP / Others</span>
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-blue-300 tracking-tight">
            {otherPlatformsCount}
          </span>
          <span className="text-xs text-blue-400/70">platforms</span>
        </div>
      </div>
    </div>
  );
};
