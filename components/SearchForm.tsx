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
  { id: "Wix", name: "Wix", color: "from-amber-500 to-yellow-400", badge: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
  { id: "Squarespace", name: "Squarespace", color: "from-violet-500 to-purple-400", badge: "bg-violet-500/20 text-violet-300 border-violet-500/40" },
  { id: "WordPress", name: "WordPress", color: "from-blue-500 to-cyan-400", badge: "bg-blue-500/20 text-blue-300 border-blue-500/40" },
  { id: "Shopify", name: "Shopify", color: "from-emerald-500 to-teal-400", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
  { id: "Webflow", name: "Webflow", color: "from-cyan-500 to-sky-400", badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" },
];

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [location, setLocation] = useState("Miami, FL");
  const [niche, setNiche] = useState("Dentists");
  const [targetCms, setTargetCms] = useState<string[]>(["Wix", "Squarespace"]);
  const [limit, setLimit] = useState(15);

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
    <div className="w-full glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 relative overflow-hidden mb-10">
      {/* Background Glow Accent */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 rounded-full blur-3xl pointer-events-none" />

      <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
        {/* Main Search Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Location Input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              Target Location / City
            </label>
            <div className="relative">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Miami, FL or London, UK"
                required
                className="w-full h-12 pl-4 pr-10 text-sm bg-slate-900/90 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
              />
            </div>
            {/* Quick Location Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {POPULAR_LOCATIONS.map((loc) => (
                <button
                  type="button"
                  key={loc}
                  onClick={() => setLocation(loc)}
                  className="px-2 py-0.5 text-[11px] bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Niche / Business Category Input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-violet-400" />
              Business Niche / Category
            </label>
            <div className="relative">
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. Dentists, Real Estate, Roofing"
                required
                className="w-full h-12 pl-4 pr-10 text-sm bg-slate-900/90 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all shadow-inner"
              />
            </div>
            {/* Quick Niche Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {POPULAR_NICHES.map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setNiche(n)}
                  className="px-2 py-0.5 text-[11px] bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CMS Selection Filters */}
        <div className="pt-2 border-t border-white/5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-fuchsia-400" />
              Target CMS Filters (Wappalyzer Detector)
            </span>
            <button
              type="button"
              onClick={selectAllCms}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              {targetCms.length === CMS_OPTIONS.length ? "Reset to Wix & Squarespace" : "Select All Platforms"}
            </button>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {CMS_OPTIONS.map((cms) => {
              const isSelected = targetCms.includes(cms.id);
              return (
                <button
                  type="button"
                  key={cms.id}
                  onClick={() => toggleCms(cms.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                    isSelected
                      ? `${cms.badge} shadow-md shadow-indigo-950/40 ring-1 ring-white/20`
                      : "bg-slate-900/60 text-slate-400 border-white/5 hover:border-white/20 hover:text-slate-200"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                      isSelected
                        ? "bg-white/20 border-white/40 text-white"
                        : "border-slate-600 bg-slate-800"
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
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-slate-400 w-full sm:w-auto">
            <span>Result Scan Depth:</span>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
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
            className="w-full sm:w-auto h-12 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 hover:from-indigo-500 hover:via-violet-500 hover:to-fuchsia-500 text-white font-semibold text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-indigo-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer animate-pulse-glow"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Scanning Google & Analyzing CMS...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Discover & Scout Leads</span>
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
