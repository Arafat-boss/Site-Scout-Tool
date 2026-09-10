"use client";

import React, { useState } from "react";
import { Search, MapPin, Briefcase, Filter, Sparkles, Check } from "lucide-react";

interface SearchFormProps {
  onSearch: (params: {
    location: string;
    niche: string;
    targetCms: string[];
    limit: number;
  }) => void;
  isLoading: boolean;
}

const POPULAR_LOCATIONS = ["Miami, FL", "London, UK", "New York, NY", "Toronto, Canada", "Dhaka, Bangladesh", "Sydney, Australia"];
const POPULAR_NICHES = ["Dentists", "Real Estate", "Roofing", "Restaurants", "Lawyers", "Photography", "Gyms & Fitness"];

const CMS_OPTIONS = [
  { id: "Wix", name: "Wix" },
  { id: "Squarespace", name: "Squarespace" },
  { id: "WordPress", name: "WordPress" },
  { id: "Shopify", name: "Shopify" },
  { id: "Webflow", name: "Webflow" },
];

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [location, setLocation] = useState("Miami, FL");
  const [niche, setNiche] = useState("Dentists");
  const [targetCms, setTargetCms] = useState<string[]>(["Wix", "Squarespace", "WordPress", "Shopify", "Webflow"]);
  const [limit, setLimit] = useState(30);

  const toggleCms = (cmsId: string) => {
    setTargetCms(prev => {
      if (prev.includes(cmsId)) {
        if (prev.length === 1) return prev;
        return prev.filter(item => item !== cmsId);
      } else {
        return [...prev, cmsId];
      }
    });
  };

  const selectAllCms = () => {
    if (targetCms.length === CMS_OPTIONS.length) {
      setTargetCms(["Wix", "Squarespace"]);
    } else {
      setTargetCms(CMS_OPTIONS.map(c => c.id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim() || !niche.trim() || isLoading) return;

    onSearch({
      location: location.trim(),
      niche: niche.trim(),
      targetCms,
      limit,
    });
  };

  return (
    <div className="w-full glass-card rounded-md p-6 sm:p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 relative overflow-hidden mb-10 transition-colors">
      <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
        {/* Main Search Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Location Input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />
              Target Location / City
            </label>
            <div className="relative">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Miami, FL or London, UK"
                required
                className="w-full h-11 pl-4 pr-10 text-sm bg-zinc-100 dark:bg-zinc-900/90 border border-zinc-300 dark:border-zinc-700/80 rounded text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-900 dark:focus:border-white focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white transition-all"
              />
            </div>
            {/* Quick Location Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {POPULAR_LOCATIONS.map((loc) => (
                <button
                  type="button"
                  key={loc}
                  onClick={() => setLocation(loc)}
                  className="px-2 py-0.5 text-[11px] bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-sm transition-colors border border-zinc-200 dark:border-zinc-800 cursor-pointer"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Niche / Business Category Input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />
              Business Niche / Category
            </label>
            <div className="relative">
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. Dentists, Real Estate, Roofing"
                required
                className="w-full h-11 pl-4 pr-10 text-sm bg-zinc-100 dark:bg-zinc-900/90 border border-zinc-300 dark:border-zinc-700/80 rounded text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-900 dark:focus:border-white focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white transition-all"
              />
            </div>
            {/* Quick Niche Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {POPULAR_NICHES.map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setNiche(n)}
                  className="px-2 py-0.5 text-[11px] bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-sm transition-colors border border-zinc-200 dark:border-zinc-800 cursor-pointer"
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CMS Selection Filters */}
        <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              Target CMS Filters
            </span>
            <button
              type="button"
              onClick={selectAllCms}
              className="text-[11px] text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-medium transition-colors cursor-pointer"
            >
              {targetCms.length === CMS_OPTIONS.length ? "Filter Wix & Squarespace" : "Select All Platforms"}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {CMS_OPTIONS.map((cms) => {
              const isSelected = targetCms.includes(cms.id);
              return (
                <button
                  type="button"
                  key={cms.id}
                  onClick={() => toggleCms(cms.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold transition-all border cursor-pointer ${
                    isSelected
                      ? "bg-zinc-900 dark:bg-white text-white dark:text-black border-zinc-900 dark:border-white shadow-sm font-bold"
                      : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-xs flex items-center justify-center border transition-all ${
                      isSelected
                        ? "bg-white dark:bg-black border-white dark:border-black text-black dark:text-white"
                        : "border-zinc-300 dark:border-zinc-700 bg-zinc-200 dark:bg-zinc-800"
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <span>{cms.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Row & Submit Button */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400 w-full sm:w-auto">
            <span>Result Scan Depth:</span>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-2.5 py-1 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
            >
              <option value={15}>15 Sites</option>
              <option value={30}>30 Sites (Recommended)</option>
              <option value={50}>50 Sites (Deep Scan)</option>
              <option value={100}>100 Sites (Full City Sweep)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto h-11 px-6 rounded bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" />
                <span>Scanning Google & Analyzing CMS...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4 stroke-[2.5]" />
                <span>Discover & Scout Leads</span>
                <Sparkles className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
