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
      <div className="glass-card rounded-md p-4 border border-zinc-200 dark:border-zinc-800 relative overflow-hidden group transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Total Scanned</span>
          <div className="p-1.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <Globe2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">{total}</span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">websites</span>
        </div>
      </div>

      {/* Wix Detected */}
      <div className="glass-card rounded-md p-4 border border-zinc-200 dark:border-zinc-800 relative overflow-hidden group transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Wix Sites</span>
          <div className="p-1.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">{wix}</span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            {total > 0 ? `${Math.round((wix / total) * 100)}%` : "0%"}
          </span>
        </div>
      </div>

      {/* Squarespace Detected */}
      <div className="glass-card rounded-md p-4 border border-zinc-200 dark:border-zinc-800 relative overflow-hidden group transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Squarespace</span>
          <div className="p-1.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <Cpu className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">{squarespace}</span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            {total > 0 ? `${Math.round((squarespace / total) * 100)}%` : "0%"}
          </span>
        </div>
      </div>

      {/* WordPress & Others */}
      <div className="glass-card rounded-md p-4 border border-zinc-200 dark:border-zinc-800 relative overflow-hidden group transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">WP / Others</span>
          <div className="p-1.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
            {otherPlatformsCount}
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">platforms</span>
        </div>
      </div>
    </div>
  );
};
