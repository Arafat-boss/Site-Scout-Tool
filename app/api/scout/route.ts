import { NextRequest, NextResponse } from "next/server";
import { discoverBusinesses, BusinessCandidate } from "@/lib/search-engine";
import { inspectWebsite, TechDetectionResult } from "@/lib/cms-detector";

export interface EnrichedLead extends BusinessCandidate {
  id: string;
  cms: TechDetectionResult["cms"];
  confidence: number;
  technologies: string[];
  title?: string;
  description?: string;
  emails: string[];
  phones: string[];
  socials: TechDetectionResult["socials"];
  responseTimeMs: number;
  inspectStatus: TechDetectionResult["status"];
  inspectError?: string;
}

/**
 * Concurrency helper to run async tasks in controlled batches
 */
async function mapConcurrent<T, R>(items: T[], concurrency: number, fn: (item: T, idx: number) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let currentIndex = 0;

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (currentIndex < items.length) {
      const idx = currentIndex++;
      try {
        results[idx] = await fn(items[idx], idx);
      } catch {
        // Fallback for failed item
        results[idx] = null as unknown as R;
      }
    }
  });

  await Promise.all(workers);
  return results.filter(Boolean);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      location = "Miami, FL",
      niche = "Dentists",
      targetCms = ["Wix", "Squarespace"],
      limit = 15,
      serpApiKey,
      serperApiKey,
      wappalyzerApiKey,
    } = body;

    if (!location || !niche) {
      return NextResponse.json({ error: "Location and Niche are required" }, { status: 400 });
    }

    // Step 1: Discover Business Candidates
    const candidates = await discoverBusinesses({
      location,
      niche,
      limit: Math.min(limit, 30),
      serpApiKey,
      serperApiKey,
    });

    if (!candidates || candidates.length === 0) {
      return NextResponse.json({
        success: true,
        totalFound: 0,
        leads: [],
        stats: { total: 0, wix: 0, squarespace: 0, wordpress: 0, shopify: 0, webflow: 0, others: 0 },
      });
    }

    // Step 2: Inspect Websites Concurrently
    const enrichedLeads = await mapConcurrent<BusinessCandidate, EnrichedLead>(
      candidates,
      5, // 5 concurrent website scans
      async (candidate, idx) => {
        // Run CMS and tech stack detection (with optional Wappalyzer API)
        const techInfo = await inspectWebsite(candidate.website, 7000, wappalyzerApiKey);

        // Merge discovered phone numbers with scraped ones
        const mergedPhones = Array.from(new Set([
          ...(candidate.phone ? [candidate.phone] : []),
          ...techInfo.phones,
        ]));

        return {
          id: `lead-${Date.now()}-${idx}`,
          name: candidate.name,
          website: candidate.website,
          address: candidate.address || location,
          phone: mergedPhones[0] || candidate.phone || "Not found",
          rating: candidate.rating,
          reviewsCount: candidate.reviewsCount,
          source: candidate.source,
          cms: techInfo.cms,
          confidence: techInfo.confidence,
          technologies: techInfo.technologies,
          title: techInfo.title,
          description: techInfo.description,
          emails: techInfo.emails,
          phones: mergedPhones,
          socials: techInfo.socials,
          responseTimeMs: techInfo.responseTimeMs,
          inspectStatus: techInfo.status,
          inspectError: techInfo.error,
        };
      }
    );

    // Calculate stats
    const stats = {
      total: enrichedLeads.length,
      wix: enrichedLeads.filter(l => l.cms === "Wix").length,
      squarespace: enrichedLeads.filter(l => l.cms === "Squarespace").length,
      wordpress: enrichedLeads.filter(l => l.cms === "WordPress").length,
      shopify: enrichedLeads.filter(l => l.cms === "Shopify").length,
      webflow: enrichedLeads.filter(l => l.cms === "Webflow").length,
      others: enrichedLeads.filter(l => !["Wix", "Squarespace", "WordPress", "Shopify", "Webflow"].includes(l.cms)).length,
    };

    return NextResponse.json({
      success: true,
      query: { location, niche, targetCms },
      totalDiscovered: enrichedLeads.length,
      totalMatched: enrichedLeads.length,
      allLeads: enrichedLeads,
      leads: enrichedLeads,
      stats,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
