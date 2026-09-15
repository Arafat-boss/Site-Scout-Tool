"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  X,
  Star,
  User,
  Share2,
  Info,
  ExternalLink,
  Navigation,
  Globe2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  RotateCcw,
  Check,
  Phone,
  Clock,
  MapPin,
  Compass
} from "lucide-react";
import { SearchHeader } from "@/components/SearchHeader";
import { SettingsModal } from "@/components/SettingsModal";
import { MapPlace } from "@/app/api/map-search/route";

type MapViewType = "m" | "k" | "p";

const QUICK_SEARCH_CHIPS = [
  "yoga London, UK",
  "salon London, UK",
  "dentist Miami, FL",
  "restaurants New York",
  "coffee Tokyo",
  "gyms Los Angeles",
];

export default function MapPage() {
  const [queryInput, setQueryInput] = useState<string>("yoga London, UK");
  const [activeQuery, setActiveQuery] = useState<string>("yoga London, UK");
  const [results, setResults] = useState<MapPlace[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<MapPlace | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  // Filters
  const [minRating, setMinRating] = useState<number | null>(null);
  const [openNowOnly, setOpenNowOnly] = useState<boolean>(false);
  const [hasWebsiteOnly, setHasWebsiteOnly] = useState<boolean>(false);

  // Map state
  const [mapType, setMapType] = useState<MapViewType>("m");
  const [zoomLevel, setZoomLevel] = useState<number>(14);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isIframeLoading, setIsIframeLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  // Fetch results whenever activeQuery changes
  useEffect(() => {
    let isCancelled = false;
    async function fetchPlaces() {
      setIsLoading(true);
      setIsIframeLoading(true);
      try {
        const res = await fetch(`/api/map-search?query=${encodeURIComponent(activeQuery)}`);
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled && data.results) {
            setResults(data.results);
            if (data.results.length > 0) {
              setSelectedPlace(data.results[0]);
            } else {
              setSelectedPlace(null);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load map results:", err);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
          setIsIframeLoading(false);
        }
      }
    }

    fetchPlaces();
    return () => {
      isCancelled = true;
    };
  }, [activeQuery]);

  // Handle Search Submission: resets selected place so map centers on new search query
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = queryInput.trim();
    if (!trimmed) return;
    setSelectedPlace(null);
    setZoomLevel(14);
    setIsLoading(true);
    setIsIframeLoading(true);
    setActiveQuery(trimmed);
  };

  // Select Quick Chip
  const handleSelectQuickChip = (chip: string) => {
    setQueryInput(chip);
    setSelectedPlace(null);
    setZoomLevel(14);
    setIsLoading(true);
    setIsIframeLoading(true);
    setActiveQuery(chip);
  };

  // Handle Card Click: zooms in and centers map on the exact business
  const handleSelectCard = (place: MapPlace) => {
    setSelectedPlace(place);
    setZoomLevel(16);
    setIsIframeLoading(true);
  };

  // Handle Clear Search
  const handleClearSearch = () => {
    setQueryInput("");
  };

  // Share Query / Link
  const handleShare = () => {
    const directUrl = selectedPlace
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          selectedPlace.lat && selectedPlace.lon
            ? `${selectedPlace.lat},${selectedPlace.lon}`
            : `${selectedPlace.name}, ${selectedPlace.address}`
        )}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeQuery)}`;
    navigator.clipboard.writeText(directUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filtered results
  const filteredResults = results.filter((p) => {
    if (minRating && p.rating < minRating) return false;
    if (openNowOnly && !p.openStatus.toLowerCase().includes("open")) return false;
    if (hasWebsiteOnly && !p.website) return false;
    return true;
  });

  // Calculate dynamic target for Google Map embed
  // If a place is selected, center on its exact coordinates or name + address
  const mapTargetQuery = selectedPlace
    ? selectedPlace.lat && selectedPlace.lon
      ? `${selectedPlace.lat},${selectedPlace.lon}`
      : `${selectedPlace.name}, ${selectedPlace.address}`
    : activeQuery;

  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    mapTargetQuery
  )}&t=${mapType}&z=${zoomLevel}&ie=UTF8&iwloc=&output=embed`;

  const externalGoogleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    mapTargetQuery
  )}`;

  // Render Stars Component
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.4;
    return (
      <div className="flex items-center gap-0.5 text-amber-500">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < fullStars
                ? "fill-amber-400 text-amber-400"
                : i === fullStars && hasHalf
                ? "fill-amber-200 text-amber-400"
                : "text-zinc-300 dark:text-zinc-700"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`h-screen flex flex-col bg-zinc-100 dark:bg-black overflow-hidden ${isFullscreen ? "fixed inset-0 z-50" : ""}`}>
      {/* Top Navbar */}
      {!isFullscreen && <SearchHeader onOpenSettings={() => setIsSettingsModalOpen(true)} />}

      {/* Main Google Maps Two-Column Layout */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* ============================================================ */}
        {/* LEFT RESULTS SIDEBAR PANEL (Matching Google Maps UI)         */}
        {/* ============================================================ */}
        <aside
          className={`h-full bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col transition-all duration-300 z-30 shadow-xl ${
            sidebarOpen
              ? "w-full sm:w-[410px] md:w-[440px] shrink-0"
              : "-ml-full sm:-ml-[410px] md:-ml-[440px] w-0 pointer-events-none"
          }`}
        >
          {/* 1. Google Maps Search Bar & Controls */}
          <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 sticky top-0 z-10 space-y-2.5">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Search Google Maps (e.g. yoga London, UK)..."
                className="w-full pl-4 pr-20 py-2.5 text-sm rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300/80 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner transition-all"
              />
              <div className="absolute right-2 flex items-center gap-1">
                {queryInput && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="p-2 text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Quick Suggestions Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[11px]">
              {QUICK_SEARCH_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleSelectQuickChip(chip)}
                  className={`px-2 py-1 rounded-md transition-all shrink-0 cursor-pointer ${
                    activeQuery.toLowerCase() === chip.toLowerCase()
                      ? "bg-blue-600 text-white font-semibold"
                      : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white border border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* 2. Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              <button
                type="button"
                onClick={() => setMinRating(minRating === 4.0 ? null : 4.0)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full border transition-all shrink-0 cursor-pointer font-medium ${
                  minRating
                    ? "bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-600 dark:text-blue-400 font-semibold"
                    : "border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }`}
              >
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>Rating {minRating ? "4.0+" : "▾"}</span>
              </button>

              <button
                type="button"
                onClick={() => setOpenNowOnly(!openNowOnly)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full border transition-all shrink-0 cursor-pointer font-medium ${
                  openNowOnly
                    ? "bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-600 dark:text-blue-400 font-semibold"
                    : "border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }`}
              >
                <Clock className="w-3 h-3 text-zinc-500" />
                <span>Hours {openNowOnly ? "(Open)" : "▾"}</span>
              </button>

              <button
                type="button"
                onClick={() => setHasWebsiteOnly(!hasWebsiteOnly)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full border transition-all shrink-0 cursor-pointer font-medium ${
                  hasWebsiteOnly
                    ? "bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-600 dark:text-blue-400 font-semibold"
                    : "border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }`}
              >
                <Globe2 className="w-3 h-3 text-zinc-500" />
                <span>Has Website</span>
              </button>
            </div>
          </div>

          {/* 3. Results Header Banner */}
          <div className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between bg-zinc-50/70 dark:bg-zinc-900/30">
            <div className="flex items-center gap-1.5 text-xs text-zinc-800 dark:text-zinc-200 font-medium">
              <span className="font-semibold">Results</span>
              <span className="text-[11px] text-zinc-500">({filteredResults.length})</span>
              <Info className="w-3.5 h-3.5 text-zinc-400" />
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              title="Share Location"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>

          {/* 4. Scrollable List of Result Cards */}
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
            {isLoading ? (
              <div className="p-8 flex flex-col items-center justify-center space-y-3">
                <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-medium text-zinc-500">
                  Searching Google Maps for "{activeQuery}"...
                </p>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">No places found</p>
                <p className="text-xs text-zinc-500">Try changing your filters or searching another keyword or city.</p>
              </div>
            ) : (
              filteredResults.map((place) => {
                const isSelected = selectedPlace?.id === place.id;
                return (
                  <div
                    key={place.id}
                    onClick={() => handleSelectCard(place)}
                    className={`p-3.5 sm:p-4 transition-all cursor-pointer flex gap-3 ${
                      isSelected
                        ? "bg-blue-50/70 dark:bg-blue-950/40 border-l-4 border-l-blue-600 shadow-xs"
                        : "hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
                    }`}
                  >
                    {/* Card Body */}
                    <div className="flex-1 flex flex-col justify-between space-y-1.5 min-w-0">
                      <div>
                        {/* Title */}
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                            {place.name}
                          </h3>
                        </div>

                        {/* Rating and Reviews */}
                        <div className="flex items-center gap-1.5 mt-0.5 text-xs">
                          <span className="font-bold text-zinc-800 dark:text-zinc-200">{place.rating}</span>
                          {renderStars(place.rating)}
                          <span className="text-zinc-500 dark:text-zinc-400">({place.reviewsCount.toLocaleString()})</span>
                        </div>

                        {/* Category & Address */}
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate mt-0.5">
                          {place.category} · {place.address}
                        </p>

                        {/* Open Status */}
                        <p className="text-xs font-medium mt-0.5">
                          {place.openStatus.toLowerCase().includes("open") ? (
                            <span className="text-emerald-600 dark:text-emerald-400">{place.openStatus}</span>
                          ) : (
                            <span className="text-red-500">{place.openStatus}</span>
                          )}
                        </p>
                      </div>

                      {/* Phone Number */}
                      {place.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 pt-0.5">
                          <Phone className="w-3 h-3 text-zinc-400" />
                          <span className="text-[11px] font-mono">{place.phone}</span>
                        </div>
                      )}

                      {/* Review Quote / Snippet */}
                      {place.quote && (
                        <div className="flex items-start gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 pt-1">
                          <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                            <User className="w-2.5 h-2.5" />
                          </div>
                          <p className="italic text-[11px] leading-snug line-clamp-2">
                            "{place.quote}"
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="pt-2 flex items-center gap-2 flex-wrap">
                        {/* Scout Lead Tech Button */}
                        <Link
                          href={`/?location=${encodeURIComponent(place.address)}&niche=${encodeURIComponent(place.category)}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Scout Tech</span>
                        </Link>

                        {/* Website Link */}
                        {place.website && (
                          <a
                            href={place.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          >
                            <Globe2 className="w-3 h-3" />
                            <span>Website</span>
                          </a>
                        )}

                        {/* External Google Maps Button */}
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            place.lat && place.lon ? `${place.lat},${place.lon}` : `${place.name}, ${place.address}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Maps</span>
                        </a>
                      </div>
                    </div>

                    {/* Thumbnail Image (Right side of card) */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 shadow-xs">
                      <img
                        src={place.imageUrl}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Sidebar Toggle Handle (< / >) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-1/2 -translate-y-1/2 z-40 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 p-1.5 rounded-r-md shadow-md text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-all cursor-pointer"
          style={{
            left: sidebarOpen ? (typeof window !== "undefined" && window.innerWidth < 640 ? "100%" : "440px") : "0px",
          }}
          title={sidebarOpen ? "Collapse sidebar" : "Expand results sidebar"}
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {/* ============================================================ */}
        {/* RIGHT INTERACTIVE GOOGLE MAP EMBED                           */}
        {/* ============================================================ */}
        <main className="flex-1 h-full relative bg-zinc-200 dark:bg-zinc-900">
          {/* Top Floating Map Controls */}
          <div className="absolute top-3 left-4 right-4 z-20 flex items-center justify-between pointer-events-none gap-2">
            {/* Search this area floating button */}
            <button
              onClick={() => {
                setSelectedPlace(null);
                setIsIframeLoading(true);
                setActiveQuery(queryInput);
              }}
              className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700 shadow-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 text-blue-500" />
              <span>Search this area</span>
            </button>

            {/* Map Mode Buttons & Fullscreen */}
            <div className="pointer-events-auto flex items-center gap-1.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-md text-xs">
              <button
                type="button"
                onClick={() => setMapType("m")}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  mapType === "m"
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                Map
              </button>
              <button
                type="button"
                onClick={() => setMapType("k")}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  mapType === "k"
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                Satellite
              </button>
              <button
                type="button"
                onClick={() => setMapType("p")}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  mapType === "p"
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                Terrain
              </button>

              <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1" />

              <a
                href={externalGoogleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
                title="Open directly on Google Maps website"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors cursor-pointer"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Floating Selected Place Info Card (Top-Left of Map, matching Google Maps screenshot) */}
          {selectedPlace && (
            <div className="absolute top-14 left-4 z-20 max-w-sm w-full bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl pointer-events-auto">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                    {selectedPlace.name}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                    {selectedPlace.address}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-xs">
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{selectedPlace.rating}</span>
                    {renderStars(selectedPlace.rating)}
                    <span className="text-zinc-400">({selectedPlace.reviewsCount})</span>
                  </div>
                </div>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    selectedPlace.lat && selectedPlace.lon
                      ? `${selectedPlace.lat},${selectedPlace.lon}`
                      : `${selectedPlace.name}, ${selectedPlace.address}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm shrink-0"
                  title="Get Directions on Google Maps"
                >
                  <Navigation className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* Map Loading Overlay */}
          {isIframeLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xs transition-opacity">
              <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Pinpointing {selectedPlace ? selectedPlace.name : activeQuery}...
              </p>
            </div>
          )}

          {/* Interactive Google Map Iframe with Dynamic Unique Key */}
          <iframe
            key={`${mapTargetQuery}-${mapType}-${zoomLevel}`}
            src={mapEmbedUrl}
            title="Google Maps Interactive View"
            onLoad={() => setIsIframeLoading(false)}
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          {/* Zoom In / Zoom Out Controls */}
          <div className="absolute bottom-6 right-4 z-20 flex flex-col gap-1 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-lg">
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
          </div>
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSave={() => {}}
      />
    </div>
  );
}
