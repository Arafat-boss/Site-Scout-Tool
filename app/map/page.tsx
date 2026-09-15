"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Search,
  Layers,
  Compass,
  Maximize2,
  Minimize2,
  ExternalLink,
  Navigation,
  Crosshair,
  Copy,
  Check,
  Globe2,
  Building2,
  Sparkles,
  RotateCcw,
  Share2,
  Info
} from "lucide-react";
import { SearchHeader } from "@/components/SearchHeader";
import { SettingsModal } from "@/components/SettingsModal";

type MapViewType = "m" | "k" | "p" | "h";

const POPULAR_CITIES = [
  "Miami, FL",
  "New York, NY",
  "London, UK",
  "Dhaka, Bangladesh",
  "Tokyo, Japan",
  "Dubai, UAE",
  "Paris, France",
  "Sydney, Australia",
];

const BUSINESS_CATEGORIES = [
  "Dentists",
  "Web Agencies",
  "Restaurants",
  "Real Estate",
  "Lawyers",
  "Gyms & Fitness",
  "Coffee Shops",
  "Plumbers",
];

export default function MapPage() {
  const [queryInput, setQueryInput] = useState("Miami, FL");
  const [activeQuery, setActiveQuery] = useState("Miami, FL");
  const [mapType, setMapType] = useState<MapViewType>("m"); // 'm' = Roadmap, 'k' = Satellite, 'p' = Terrain, 'h' = Hybrid
  const [zoomLevel, setZoomLevel] = useState<number>(14);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isIframeLoading, setIsIframeLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [showDirections, setShowDirections] = useState<boolean>(false);
  const [directionsOrigin, setDirectionsOrigin] = useState<string>("");
  const [directionsDestination, setDirectionsDestination] = useState<string>("");
  const [isGeoLocating, setIsGeoLocating] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const constructMapEmbedUrl = () => {
    if (showDirections && (directionsOrigin || directionsDestination)) {
      const originParam = encodeURIComponent(directionsOrigin || activeQuery);
      const destParam = encodeURIComponent(directionsDestination || activeQuery);
      return `https://maps.google.com/maps?saddr=${originParam}&daddr=${destParam}&t=${mapType}&z=${zoomLevel}&ie=UTF8&output=embed`;
    }
    return `https://maps.google.com/maps?q=${encodeURIComponent(
      activeQuery
    )}&t=${mapType}&z=${zoomLevel}&ie=UTF8&iwloc=&output=embed`;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim()) return;
    setIsIframeLoading(true);
    setActiveQuery(queryInput.trim());
    setShowDirections(false);
  };

  const handleSelectQuery = (query: string) => {
    setQueryInput(query);
    setActiveQuery(query);
    setShowDirections(false);
    setIsIframeLoading(true);
  };

  const handleAppendCategory = (category: string) => {
    const combined = `${category} in ${activeQuery.split(" in ").pop() || activeQuery}`;
    setQueryInput(combined);
    setActiveQuery(combined);
    setShowDirections(false);
    setIsIframeLoading(true);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsGeoLocating(false);
        const coords = `${position.coords.latitude.toFixed(6)},${position.coords.longitude.toFixed(6)}`;
        setQueryInput(coords);
        setActiveQuery(coords);
        setIsIframeLoading(true);
        setStatusMessage("Located your current GPS position!");
        setTimeout(() => setStatusMessage(""), 3500);
      },
      (error) => {
        setIsGeoLocating(false);
        console.error(error);
        alert("Unable to retrieve location. Please check browser permissions.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleCopyLink = () => {
    const directUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeQuery)}`;
    navigator.clipboard.writeText(directUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard shortcut: Escape exits fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  const mapEmbedUrl = constructMapEmbedUrl();
  const googleMapsDirectUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeQuery)}`;

  return (
    <div className={`min-h-screen flex flex-col ${isFullscreen ? "overflow-hidden" : ""}`}>
      {/* Top Navbar */}
      <SearchHeader onOpenSettings={() => setIsSettingsModalOpen(true)} />

      {/* Main Map Content */}
      <main className={`flex-1 flex flex-col ${isFullscreen ? "fixed inset-0 z-50 bg-black pt-2 pb-2 px-2" : "max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6"}`}>
        {/* Header Toolbar & Controls */}
        <div className="flex flex-col gap-4 mb-4">
          {/* Top Bar: Title & Search */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white dark:bg-zinc-950 p-3 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors">
            {/* Search Input Form */}
            <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  placeholder="Search any city, place, address, or business (e.g. Miami, FL, Dentists in New York)..."
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-zinc-900 dark:text-white placeholder-zinc-400 transition-all"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2.5 text-xs font-semibold rounded-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Search Map</span>
              </button>

              <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={isGeoLocating}
                className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all shrink-0 cursor-pointer"
                title="Use Current Location"
              >
                <Crosshair className={`w-4 h-4 ${isGeoLocating ? "animate-spin text-emerald-500" : ""}`} />
              </button>
            </form>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              {/* Map Type Mode Switcher */}
              <div className="inline-flex rounded-lg border border-zinc-200 dark:border-zinc-800 p-0.5 bg-zinc-100 dark:bg-zinc-900 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setMapType("m")}
                  className={`px-2.5 py-1.5 rounded-md transition-all cursor-pointer ${
                    mapType === "m"
                      ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold shadow-xs"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                  title="Standard Map View"
                >
                  Map
                </button>
                <button
                  type="button"
                  onClick={() => setMapType("k")}
                  className={`px-2.5 py-1.5 rounded-md transition-all cursor-pointer ${
                    mapType === "k"
                      ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold shadow-xs"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                  title="Satellite Imagery"
                >
                  Satellite
                </button>
                <button
                  type="button"
                  onClick={() => setMapType("p")}
                  className={`px-2.5 py-1.5 rounded-md transition-all cursor-pointer ${
                    mapType === "p"
                      ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold shadow-xs"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                  title="Terrain Topography"
                >
                  Terrain
                </button>
              </div>

              {/* Directions Toggle */}
              <button
                type="button"
                onClick={() => setShowDirections(!showDirections)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                  showDirections
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
                title="Get Directions"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Directions</span>
              </button>

              {/* Scout This Location in App */}
              <Link
                href={`/?location=${encodeURIComponent(activeQuery)}`}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity shadow-xs"
                title="Scout Leads in this Location"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Scout Leads</span>
              </Link>

              {/* Open in Google Maps External Tab */}
              <a
                href={googleMapsDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                title="Open directly in Google Maps website"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Google Maps</span>
              </a>

              {/* Share / Copy Link */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer"
                title="Copy Map Link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>

              {/* Fullscreen Mode Toggle */}
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer"
                title={isFullscreen ? "Exit Fullscreen (Esc)" : "Expand Fullscreen"}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Directions Panel (Expandable) */}
          {showDirections && (
            <div className="bg-white dark:bg-zinc-950 p-3 sm:p-4 rounded-xl border border-emerald-500/30 dark:border-emerald-500/30 shadow-sm flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs shrink-0">
                <Navigation className="w-4 h-4" />
                <span>Google Route:</span>
              </div>
              <input
                type="text"
                placeholder="Origin / Starting point (e.g. Airport, Downtown)"
                value={directionsOrigin}
                onChange={(e) => setDirectionsOrigin(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
              />
              <span className="text-zinc-400 text-xs font-bold">→</span>
              <input
                type="text"
                placeholder="Destination (e.g. Hotel, Business Address)"
                value={directionsDestination}
                onChange={(e) => setDirectionsDestination(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setIsIframeLoading(true)}
                className="px-3 py-2 text-xs font-semibold rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer shrink-0"
              >
                Calculate Route
              </button>
            </div>
          )}

          {/* Preset Quick Chips: Cities & Lead Niches */}
          {!isFullscreen && (
            <div className="flex flex-col gap-2 bg-zinc-100/60 dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-zinc-500 dark:text-zinc-400 font-medium flex items-center gap-1 shrink-0">
                  <Globe2 className="w-3.5 h-3.5" /> Popular Cities:
                </span>
                {POPULAR_CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleSelectQuery(city)}
                    className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                      activeQuery.toLowerCase() === city.toLowerCase()
                        ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-xs"
                        : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-zinc-200/60 dark:border-zinc-800/60">
                <span className="text-zinc-500 dark:text-zinc-400 font-medium flex items-center gap-1 shrink-0">
                  <Building2 className="w-3.5 h-3.5" /> Scout Business Niches:
                </span>
                {BUSINESS_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleAppendCategory(cat)}
                    className="px-2 py-0.5 rounded-md bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:text-black dark:hover:text-white transition-all cursor-pointer text-[11px]"
                  >
                    + {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Status / Notification Alert */}
        {statusMessage && (
          <div className="mb-3 px-3 py-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
            <Check className="w-3.5 h-3.5" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Google Maps Interactive Container */}
        <div className={`relative w-full rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-900 shadow-lg ${
          isFullscreen ? "flex-1 h-full min-h-0" : "h-[650px] sm:h-[720px]"
        }`}>
          {/* Loading Placeholder */}
          {isIframeLoading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/70 dark:bg-zinc-950/70 backdrop-blur-sm transition-opacity">
              <div className="w-9 h-9 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Connecting to Google Maps engine...
              </p>
            </div>
          )}

          {/* Original Google Map Embed Iframe */}
          <iframe
            ref={iframeRef}
            src={mapEmbedUrl}
            title="Google Maps"
            onLoad={() => setIsIframeLoading(false)}
            className="w-full h-full border-0 filter contrast-100"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          {/* Floating HUD Badge: Location & Zoom Info */}
          <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-2 bg-white/90 dark:bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-md text-xs text-zinc-700 dark:text-zinc-300">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            <span className="font-semibold">{activeQuery}</span>
            <span className="text-zinc-400">•</span>
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-mono">
              {mapType === "k" ? "Satellite" : mapType === "p" ? "Terrain" : "Roadmap"}
            </span>
          </div>

          {/* Floating Zoom Controls */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 bg-white/90 dark:bg-black/90 backdrop-blur-md p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-md">
            <button
              onClick={() => {
                setZoomLevel((prev) => Math.min(prev + 1, 21));
                setIsIframeLoading(true);
              }}
              className="w-8 h-8 flex items-center justify-center font-bold text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors cursor-pointer"
              title="Zoom In"
            >
              +
            </button>
            <div className="h-px bg-zinc-200 dark:bg-zinc-800 w-full" />
            <button
              onClick={() => {
                setZoomLevel((prev) => Math.max(prev - 1, 3));
                setIsIframeLoading(true);
              }}
              className="w-8 h-8 flex items-center justify-center font-bold text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors cursor-pointer"
              title="Zoom Out"
            >
              −
            </button>
            <div className="h-px bg-zinc-200 dark:bg-zinc-800 w-full" />
            <button
              onClick={() => {
                setZoomLevel(14);
                setIsIframeLoading(true);
              }}
              className="w-8 h-8 flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors cursor-pointer"
              title="Reset Zoom to City Level"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Helpful Tips */}
        {!isFullscreen && (
          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400 px-1">
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-zinc-400" />
              <span>
                Tip: You can pan, drag, scroll to zoom, view Street View, or click businesses directly inside the Google Map.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-zinc-400">
                Official Google Maps Embed API Core
              </span>
            </div>
          </div>
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSave={() => {}}
      />

      {/* Footer */}
      {!isFullscreen && (
        <footer className="border-t border-zinc-200 dark:border-zinc-900 py-6 text-center text-xs text-zinc-500 transition-colors mt-8">
          Site Scout • Google Maps Lead Scouting Integration • 100% Free
        </footer>
      )}
    </div>
  );
}
