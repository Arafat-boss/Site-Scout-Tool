"use client";

import React, { useState } from "react";
import { SearchHeader } from "@/components/SearchHeader";
import { SearchForm } from "@/components/SearchForm";
import { QuickUrlInspector } from "@/components/QuickUrlInspector";
import { LiveProgress } from "@/components/LiveProgress";
import { StatsCards } from "@/components/StatsCards";
import { ResultsTable } from "@/components/ResultsTable";
import { LeadPitchModal } from "@/components/LeadPitchModal";
import { SettingsModal } from "@/components/SettingsModal";
import { EnrichedLead } from "@/app/api/scout/route";
import { Globe2, Sparkles, Layers } from "lucide-react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [filteredLeads, setFilteredLeads] = useState<EnrichedLead[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    wix: 0,
    squarespace: 0,
    wordpress: 0,
    shopify: 0,
    webflow: 0,
    others: 0,
  });
  const [searchParams, setSearchParams] = useState({
    location: "Miami, FL",
    niche: "Dentists",
  });
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedPitchLead, setSelectedPitchLead] = useState<EnrichedLead | null>(null);
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [showQuickInspect, setShowQuickInspect] = useState(false);
  const [apiKeys, setApiKeys] = useState<{ serpApiKey?: string; serperApiKey?: string; wappalyzerApiKey?: string }>({});

  const handleSearch = async (params: {
    location: string;
    niche: string;
    targetCms: string[];
    limit: number;
  }) => {
    setIsLoading(true);
    setHasSearched(true);
    setSearchParams({ location: params.location, niche: params.niche });

    const storedSerp = typeof window !== "undefined" ? localStorage.getItem("site_scout_serp_key") || apiKeys.serpApiKey : undefined;
    const storedSerper = typeof window !== "undefined" ? localStorage.getItem("site_scout_serper_key") || apiKeys.serperApiKey : undefined;
    const storedWapp = typeof window !== "undefined" ? localStorage.getItem("site_scout_wappalyzer_key") || apiKeys.wappalyzerApiKey : undefined;

    try {
      const response = await fetch("/api/scout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: params.location,
          niche: params.niche,
          targetCms: params.targetCms,
          limit: params.limit,
          serpApiKey: storedSerp,
          serperApiKey: storedSerper,
          wappalyzerApiKey: storedWapp,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to search leads");
      }

      setFilteredLeads(data.leads || []);
      setStats(data.stats || {
        total: 0,
        wix: 0,
        squarespace: 0,
        wordpress: 0,
        shopify: 0,
        webflow: 0,
        others: 0,
      });
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenPitch = (lead: EnrichedLead) => {
    setSelectedPitchLead(lead);
    setIsPitchModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header */}
      <SearchHeader
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onToggleQuickInspect={() => setShowQuickInspect(!showQuickInspect)}
        showQuickInspect={showQuickInspect}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Quick URL Inspector Toggle Section */}
        {showQuickInspect && <QuickUrlInspector />}

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Wappalyzer CMS Detection Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Find Local Websites Built on{" "}
            <span className="bg-gradient-to-r from-amber-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Wix & Squarespace
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Search any city and niche to uncover local business websites, detect their CMS technology stack, extract contact info, and generate high-converting client outreach pitches.
          </p>
        </div>

        {/* Search & Filter Form */}
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />

        {/* Live Scouting Status */}
        {isLoading && <LiveProgress location={searchParams.location} niche={searchParams.niche} />}

        {/* Analytics & Stats Cards (Shown after search) */}
        {hasSearched && !isLoading && <StatsCards stats={stats} />}

        {/* Results Data Table */}
        {hasSearched && !isLoading && (
          <ResultsTable
            leads={filteredLeads}
            onOpenPitch={handleOpenPitch}
            location={searchParams.location}
            niche={searchParams.niche}
          />
        )}

        {/* Initial Empty State / Feature Highlights (When no search run yet) */}
        {!hasSearched && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="glass-card rounded-2xl p-6 border border-white/10 relative overflow-hidden group hover:border-indigo-500/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-4">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Location & Niche Scout</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Query local businesses across any city worldwide. Pulls company names, website domains, phone numbers, and addresses.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-white/10 relative overflow-hidden group hover:border-violet-500/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Wappalyzer CMS Detection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sniffs HTML signatures, static asset CDNs, meta tags, and headers to identify Wix, Squarespace, WordPress, and Shopify.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-white/10 relative overflow-hidden group hover:border-amber-500/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">AI Pitch Proposal Generator</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instant tailored cold outreach emails pinpointing Wix/Squarespace bottlenecks to pitch custom redesign services.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSave={(keys) => setApiKeys(keys)}
      />

      {/* AI Lead Pitch Modal */}
      <LeadPitchModal
        lead={selectedPitchLead}
        isOpen={isPitchModalOpen}
        onClose={() => {
          setIsPitchModalOpen(false);
          setSelectedPitchLead(null);
        }}
      />

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        Site Scout • Built for Web Designers & Lead Generation • 100% Free & Open Engine
      </footer>
    </div>
  );
}
