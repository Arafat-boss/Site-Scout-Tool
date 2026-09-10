"use client";

import React, { useState } from "react";
import { 
  Download, ExternalLink, Mail, Phone, Sparkles, 
  Search, LayoutGrid, Table as TableIcon, Star, AlertCircle, RefreshCw
} from "lucide-react";
import * as XLSX from "xlsx";
import { EnrichedLead } from "@/app/api/scout/route";

interface ResultsTableProps {
  leads: EnrichedLead[];
  onOpenPitch: (lead: EnrichedLead) => void;
  location: string;
  niche: string;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({
  leads = [],
  onOpenPitch,
  location,
  niche,
}) => {
  const [filterQuery, setFilterQuery] = useState("");
  const [activeCmsFilter, setActiveCmsFilter] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Filter leads based on live search and active CMS filter
  const filteredLeads = leads.filter((lead) => {
    const matchesQuery = 
      lead.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      lead.website.toLowerCase().includes(filterQuery.toLowerCase()) ||
      lead.cms.toLowerCase().includes(filterQuery.toLowerCase()) ||
      (lead.address && lead.address.toLowerCase().includes(filterQuery.toLowerCase()));

    const matchesCms = activeCmsFilter === "ALL" || lead.cms === activeCmsFilter;

    return matchesQuery && matchesCms;
  });

  const handleExportCSV = () => {
    if (filteredLeads.length === 0) return;

    const dataToExport = filteredLeads.map((l) => ({
      "Business Name": l.name,
      "Website": l.website,
      "Detected CMS": l.cms,
      "CMS Confidence": `${l.confidence}%`,
      "Phone": l.phone || "N/A",
      "Email": l.emails.join(", ") || "N/A",
      "Address": l.address || location,
      "Google Rating": l.rating || "N/A",
      "Reviews Count": l.reviewsCount || "N/A",
      "Technologies": l.technologies.join(", "),
      "Facebook": l.socials.facebook || "",
      "Instagram": l.socials.instagram || "",
      "LinkedIn": l.socials.linkedin || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SiteScout Leads");

    const fileName = `site_scout_${niche.replace(/\s+/g, "_")}_${location.replace(/\s+/g, "_")}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const getCmsBadgeColor = (cms: string) => {
    switch (cms) {
      case "Wix":
      case "Squarespace":
        return "bg-white text-black font-bold border-white";
      case "WordPress":
      case "Shopify":
      case "Webflow":
        return "bg-zinc-800 text-zinc-200 border-zinc-700";
      default:
        return "bg-zinc-900 text-zinc-400 border-zinc-800";
    }
  };

  if (!leads || leads.length === 0) {
    return (
      <div className="w-full glass-card rounded-3xl p-8 text-center border border-zinc-800 my-8">
        <AlertCircle className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
        <h4 className="text-base font-bold text-white">No websites discovered for &ldquo;{niche}&rdquo; in &ldquo;{location}&rdquo;</h4>
        <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
          Try expanding the location name (e.g. &ldquo;Miami, FL&rdquo; or &ldquo;London, UK&rdquo;) or trying broad categories like &ldquo;Dentists&rdquo;, &ldquo;Real Estate&rdquo;, or &ldquo;Restaurants&rdquo;.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-800 space-y-6">
      {/* Table Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Discovered Leads & Tech Profiles</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs bg-zinc-900 text-zinc-300 border border-zinc-800 font-mono">
              {filteredLeads.length} matches
            </span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Verified website CMS analysis for {niche} in {location}
          </p>
        </div>

        {/* Search, Filter & Export */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* In-table Search */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter by name, URL..."
              className="w-full sm:w-48 h-9 pl-9 pr-3 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                viewMode === "table" ? "bg-white text-black shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                viewMode === "cards" ? "bg-white text-black shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
              title="Cards View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Export to Excel */}
          <button
            onClick={handleExportCSV}
            className="h-9 px-4 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-black" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* CMS Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-850">
        <span className="text-[11px] font-semibold text-zinc-400 uppercase mr-1">Platform Filter:</span>
        {["ALL", "Wix", "Squarespace", "WordPress", "Shopify", "Webflow"].map((cms) => {
          const count = cms === "ALL" ? leads.length : leads.filter((l) => l.cms === cms).length;

          return (
            <button
              key={cms}
              onClick={() => setActiveCmsFilter(cms)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeCmsFilter === cms
                  ? "bg-white text-black border border-white font-bold"
                  : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              {cms} <span className="text-[10px] opacity-75 font-mono ml-1">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Results Render */}
      {filteredLeads.length === 0 ? (
        <div className="py-10 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800 p-6">
          <p className="text-xs text-zinc-300">
            0 {activeCmsFilter} websites in this batch of {leads.length} businesses.
          </p>
          <button
            onClick={() => setActiveCmsFilter("ALL")}
            className="mt-3 px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
            <span>Show All {leads.length} Discovered Websites</span>
          </button>
        </div>
      ) : viewMode === "table" ? (
        /* TABLE VIEW */
        <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-black/60">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-900 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-4">Business & Location</th>
                <th className="py-3.5 px-4">Website</th>
                <th className="py-3.5 px-4">Detected CMS</th>
                <th className="py-3.5 px-4">Tech Signatures</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4 text-right">Outreach Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850 font-sans">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-zinc-900/40 transition-colors group">
                  {/* Business Name */}
                  <td className="py-4 px-4 font-medium text-white max-w-[200px]">
                    <div className="font-semibold text-sm truncate text-white">{lead.name}</div>
                    <div className="text-[11px] text-zinc-400 truncate mt-0.5">{lead.address}</div>
                    {lead.rating && (
                      <div className="flex items-center gap-1 text-[11px] text-zinc-300 mt-1 font-mono">
                        <Star className="w-3 h-3 fill-zinc-300 text-zinc-300" />
                        <span>{lead.rating}</span>
                        {lead.reviewsCount && <span className="text-zinc-500">({lead.reviewsCount})</span>}
                      </div>
                    )}
                  </td>

                  {/* Website */}
                  <td className="py-4 px-4">
                    <a
                      href={lead.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-300 hover:text-white hover:underline flex items-center gap-1 font-mono text-[11px]"
                    >
                      <span className="truncate max-w-[160px]">{lead.website.replace(/https?:\/\//, '')}</span>
                      <ExternalLink className="w-3 h-3 shrink-0 text-zinc-400" />
                    </a>
                  </td>

                  {/* Detected CMS */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1 items-start">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${getCmsBadgeColor(lead.cms)}`}>
                        {lead.cms}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {lead.confidence}% match
                      </span>
                    </div>
                  </td>

                  {/* Tech Signatures */}
                  <td className="py-4 px-4 max-w-[220px]">
                    <div className="flex flex-wrap gap-1">
                      {lead.technologies.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 text-[10px] bg-zinc-900 border border-zinc-800 rounded text-zinc-300 font-mono">
                          {t}
                        </span>
                      ))}
                      {lead.technologies.length > 3 && (
                        <span className="px-1.5 py-0.5 text-[10px] bg-zinc-900 border border-zinc-800 rounded text-zinc-500 font-mono">
                          +{lead.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td className="py-4 px-4 text-[11px] space-y-1">
                    {lead.phone && lead.phone !== "Not found" ? (
                      <div className="flex items-center gap-1.5 text-zinc-200">
                        <Phone className="w-3 h-3 text-zinc-400 shrink-0" />
                        <span className="font-mono">{lead.phone}</span>
                      </div>
                    ) : null}
                    {lead.emails.length > 0 ? (
                      <div className="flex items-center gap-1.5 text-zinc-300">
                        <Mail className="w-3 h-3 text-zinc-400 shrink-0" />
                        <span className="truncate max-w-[140px] font-mono">{lead.emails[0]}</span>
                      </div>
                    ) : null}
                    {(!lead.phone || lead.phone === "Not found") && lead.emails.length === 0 && (
                      <span className="text-zinc-500 italic">No direct contact info</span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => onOpenPitch(lead)}
                      className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 hover:border-zinc-500 text-xs font-semibold flex items-center gap-1.5 ml-auto transition-all shadow-sm cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
                      <span>Pitch AI</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="glass-card rounded-2xl p-5 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-lg border ${getCmsBadgeColor(lead.cms)}`}>
                    {lead.cms}
                  </span>
                  {lead.rating && (
                    <div className="flex items-center gap-1 text-xs text-zinc-300 font-mono">
                      <Star className="w-3.5 h-3.5 fill-zinc-300 text-zinc-300" />
                      <span>{lead.rating}</span>
                    </div>
                  )}
                </div>

                <h4 className="text-sm font-bold text-white mt-3 line-clamp-1">{lead.name}</h4>
                <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">{lead.address}</p>

                <a
                  href={lead.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-mono text-zinc-300 hover:text-white hover:underline"
                >
                  <span className="truncate max-w-[200px]">{lead.website.replace(/https?:\/\//, '')}</span>
                  <ExternalLink className="w-3 h-3 shrink-0 text-zinc-400" />
                </a>

                {/* Tech tags */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {lead.technologies.slice(0, 4).map((tech, i) => (
                    <span key={i} className="px-2 py-0.5 text-[10px] bg-zinc-900 border border-zinc-800 rounded text-zinc-300 font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom contacts & Action */}
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
                <div className="text-xs text-zinc-400 font-mono truncate max-w-[140px]">
                  {lead.phone && lead.phone !== "Not found" ? lead.phone : lead.emails[0] || "Website Lead"}
                </div>
                <button
                  onClick={() => onOpenPitch(lead)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 hover:border-zinc-500 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
                  <span>Pitch</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
