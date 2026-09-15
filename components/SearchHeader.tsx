"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe2, Settings, Terminal, Sun, Moon, MapPin, Compass } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

interface SearchHeaderProps {
  onOpenSettings?: () => void;
  onToggleQuickInspect?: () => void;
  showQuickInspect?: boolean;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  onOpenSettings,
  onToggleQuickInspect,
  showQuickInspect = false,
}) => {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  return (
    <header className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/90 backdrop-blur-xl sticky top-0 z-40 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Globe2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
                  Site Scout
                </span>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700">
                  Core
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 hidden sm:block">
                Location & Lead Discovery Engine
              </p>
            </div>
          </Link>
        </div>

        {/* Central Navigation: Scout vs Map */}
        <nav className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900/90 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <Link
            href="/"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              pathname === "/"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Scout</span>
          </Link>

          <Link
            href="/map"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              pathname?.startsWith("/map")
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
            <span>Google Map</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold hidden sm:inline">
              LIVE
            </span>
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick URL Inspector Toggle (Optional) */}
          {onToggleQuickInspect && (
            <button
              onClick={onToggleQuickInspect}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-all border cursor-pointer ${
                showQuickInspect
                  ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-sm font-semibold"
                  : "bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white"
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Inspector</span>
            </button>
          )}

          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white transition-all cursor-pointer"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-3.5 h-3.5 text-zinc-300" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-zinc-700" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          {/* Settings Button */}
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white transition-all cursor-pointer"
              title="API & Scraping Settings"
            >
              <Settings className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
