import { load } from "cheerio";

export interface TechDetectionResult {
  url: string;
  normalizedUrl: string;
  cms: "Wix" | "Squarespace" | "WordPress" | "Shopify" | "Webflow" | "Weebly" | "GoDaddy" | "Custom / Other";
  confidence: number; // 0 to 100
  technologies: string[];
  title?: string;
  description?: string;
  emails: string[];
  phones: string[];
  socials: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  responseTimeMs: number;
  status: "success" | "error" | "unreachable";
  error?: string;
}

/**
 * Normalizes a URL to ensure it has http/https protocol
 */
export function normalizeUrl(rawUrl: string): string {
  let url = rawUrl.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }
  return url;
}

/**
 * Analyzes HTML content, headers, and DOM to detect CMS and tech stack
 */
export function analyzeHtml(html: string, headers: Record<string, string>, url: string, responseTimeMs: number): TechDetectionResult {
  const $ = load(html || "");
  const detectedTechs: Set<string> = new Set();
  
  let wixScore = 0;
  let sqspScore = 0;
  let wpScore = 0;
  let shopifyScore = 0;
  let webflowScore = 0;
  let weeblyScore = 0;
  let godaddyScore = 0;

  const htmlLower = html.toLowerCase();
  const headerKeys = Object.keys(headers).map(k => k.toLowerCase());
  const headerValues = Object.values(headers).map(v => (v || "").toLowerCase()).join(" ");

  // 1. --- HEADERS CHECK ---
  if (headerValues.includes("wix") || headerKeys.includes("x-wix-request-id") || headerKeys.includes("x-wix-renderer-server")) {
    wixScore += 60;
    detectedTechs.add("Wix Cloud Server");
  }
  if (headerValues.includes("squarespace") || headerValues.includes("sqsp") || (headerKeys.includes("x-served-by") && headers["x-served-by"]?.includes("sqsp"))) {
    sqspScore += 60;
    detectedTechs.add("Squarespace Server");
  }
  if (headerValues.includes("shopify") || headerKeys.includes("x-shopify-stage")) {
    shopifyScore += 60;
    detectedTechs.add("Shopify Infrastructure");
  }

  // 2. --- META GENERATOR CHECK ---
  const metaGenerator = $('meta[name="generator"]').attr("content") || "";
  const metaGenLower = metaGenerator.toLowerCase();

  if (metaGenLower.includes("wix")) {
    wixScore += 70;
    detectedTechs.add("Wix Website Builder");
  }
  if (metaGenLower.includes("squarespace")) {
    sqspScore += 70;
    detectedTechs.add("Squarespace Platform");
  }
  if (metaGenLower.includes("wordpress")) {
    wpScore += 70;
    detectedTechs.add("WordPress CMS");
  }
  if (metaGenLower.includes("shopify")) {
    shopifyScore += 70;
    detectedTechs.add("Shopify CMS");
  }
  if (metaGenLower.includes("webflow")) {
    webflowScore += 70;
    detectedTechs.add("Webflow Builder");
  }

  // 3. --- WIX SPECIFIC SIGNATURES ---
  if (htmlLower.includes("static.parastorage.com")) {
    wixScore += 40;
    detectedTechs.add("Wix Parastorage CDN");
  }
  if (htmlLower.includes("static.wixstatic.com")) {
    wixScore += 30;
    detectedTechs.add("Wix Static Assets");
  }
  if (htmlLower.includes("wix-warmup-data") || htmlLower.includes("wixbisession") || htmlLower.includes("wix-thunderbolt")) {
    wixScore += 40;
    detectedTechs.add("Wix Thunderbolt Engine");
  }
  if (htmlLower.includes("_wix_") || $('wix-image, wix-video, wix-dropdown, #SITE_CONTAINER').length > 0) {
    wixScore += 30;
    detectedTechs.add("Wix Components");
  }

  // 4. --- SQUARESPACE SPECIFIC SIGNATURES ---
  if (htmlLower.includes("static1.squarespace.com") || htmlLower.includes("assets.squarespace.com")) {
    sqspScore += 45;
    detectedTechs.add("Squarespace Static CDN");
  }
  if (htmlLower.includes("sqsp.net") || htmlLower.includes("squarespace-headers")) {
    sqspScore += 35;
    detectedTechs.add("Squarespace Core");
  }
  if ($('[class*="sqs-block"], [class*="sqs-layout"], [class*="sqs-row"], [id^="collection-"]').length > 0) {
    sqspScore += 40;
    detectedTechs.add("Squarespace Block Layout");
  }
  if (htmlLower.includes("squarespace.constants") || htmlLower.includes("squarespace_cache")) {
    sqspScore += 35;
  }

  // 5. --- WORDPRESS SPECIFIC SIGNATURES ---
  if (htmlLower.includes("/wp-content/") || htmlLower.includes("/wp-includes/")) {
    wpScore += 50;
    detectedTechs.add("WordPress Themes/Plugins");
  }
  if (htmlLower.includes("elementor")) {
    wpScore += 20;
    detectedTechs.add("Elementor Page Builder");
  }
  if (htmlLower.includes("woocommerce")) {
    wpScore += 20;
    detectedTechs.add("WooCommerce");
  }

  // 6. --- SHOPIFY SPECIFIC SIGNATURES ---
  if (htmlLower.includes("cdn.shopify.com") || htmlLower.includes("shopify.theme")) {
    shopifyScore += 50;
    detectedTechs.add("Shopify Storefront");
  }

  // 7. --- WEBFLOW SPECIFIC SIGNATURES ---
  if (htmlLower.includes("assets.website-files.com") || $('[data-wf-page], [data-wf-site]').length > 0) {
    webflowScore += 60;
    detectedTechs.add("Webflow Framework");
  }

  // 8. --- WEEBLY & GODADDY ---
  if (htmlLower.includes("editmysite.com") || htmlLower.includes("weebly.com")) {
    weeblyScore += 50;
    detectedTechs.add("Weebly");
  }
  if (htmlLower.includes("godaddy.com") || htmlLower.includes("secureserver.net") || htmlLower.includes("websites.godaddy.com")) {
    godaddyScore += 50;
    detectedTechs.add("GoDaddy Website Builder");
  }

  // 9. --- ADDITIONAL TECH IDENTIFICATION ---
  if (htmlLower.includes("google-analytics.com") || htmlLower.includes("gtag(") || htmlLower.includes("ga('create'")) {
    detectedTechs.add("Google Analytics");
  }
  if (htmlLower.includes("googletagmanager.com")) {
    detectedTechs.add("Google Tag Manager");
  }
  if (htmlLower.includes("connect.facebook.net") || htmlLower.includes("fbq(")) {
    detectedTechs.add("Facebook Pixel");
  }
  if (htmlLower.includes("fonts.googleapis.com")) {
    detectedTechs.add("Google Fonts");
  }
  if (htmlLower.includes("cloudflare")) {
    detectedTechs.add("Cloudflare CDN");
  }

  // Determine dominant CMS
  let dominantCms: TechDetectionResult["cms"] = "Custom / Other";
  let maxScore = 0;

  const scores: { cms: TechDetectionResult["cms"]; score: number }[] = [
    { cms: "Wix", score: wixScore },
    { cms: "Squarespace", score: sqspScore },
    { cms: "WordPress", score: wpScore },
    { cms: "Shopify", score: shopifyScore },
    { cms: "Webflow", score: webflowScore },
    { cms: "Weebly", score: weeblyScore },
    { cms: "GoDaddy", score: godaddyScore },
  ];

  for (const item of scores) {
    if (item.score > maxScore && item.score >= 25) {
      maxScore = item.score;
      dominantCms = item.cms;
    }
  }

  const confidence = Math.min(100, maxScore > 0 ? maxScore : 0);

  // Extract Metadata
  const title = $("title").first().text().trim() || $('meta[property="og:title"]').attr("content") || undefined;
  const description = $('meta[name="description"]').attr("content")?.trim() || $('meta[property="og:description"]').attr("content")?.trim() || undefined;

  // Extract Emails
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const emailSet = new Set<string>();

  $('a[href^="mailto:"]').each((_, el) => {
    const mailto = $(el).attr("href")?.replace("mailto:", "").split("?")[0].trim();
    if (mailto && mailto.includes("@") && !mailto.includes("example.com") && !mailto.includes("wix.com") && !mailto.includes("squarespace.com")) {
      emailSet.add(mailto.toLowerCase());
    }
  });

  const bodyText = $("body").text() || "";
  const bodyMatches = bodyText.match(emailRegex) || [];
  for (const m of bodyMatches) {
    const email = m.trim().toLowerCase();
    if (!email.endsWith(".png") && !email.endsWith(".jpg") && !email.includes("wixpress.com") && !email.includes("squarespace.com") && !email.includes("sentry.io") && email.length < 50) {
      emailSet.add(email);
    }
  }

  // Extract Phones
  const phoneSet = new Set<string>();
  $('a[href^="tel:"]').each((_, el) => {
    const tel = $(el).attr("href")?.replace("tel:", "").trim();
    if (tel && tel.length >= 7) {
      phoneSet.add(tel);
    }
  });

  // Extract Socials
  const socials: TechDetectionResult["socials"] = {};
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") || "";
    if (href.includes("facebook.com/") && !href.includes("/sharer") && !socials.facebook) {
      socials.facebook = href;
    } else if (href.includes("instagram.com/") && !socials.instagram) {
      socials.instagram = href;
    } else if (href.includes("linkedin.com/") && !socials.linkedin) {
      socials.linkedin = href;
    } else if ((href.includes("twitter.com/") || href.includes("x.com/")) && !socials.twitter) {
      socials.twitter = href;
    }
  });

  return {
    url,
    normalizedUrl: url,
    cms: dominantCms,
    confidence,
    technologies: Array.from(detectedTechs),
    title,
    description,
    emails: Array.from(emailSet).slice(0, 3),
    phones: Array.from(phoneSet).slice(0, 3),
    socials,
    responseTimeMs,
    status: "success",
  };
}

/**
 * Calls official Wappalyzer API v2 lookup
 */
export async function inspectWithWappalyzerApi(
  rawUrl: string,
  apiKey: string,
  timeoutMs: number = 10000
): Promise<TechDetectionResult | null> {
  const url = normalizeUrl(rawUrl);
  const startTime = Date.now();

  try {
    const params = new URLSearchParams({
      urls: url,
      sets: "all",
    });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(`https://api.wappalyzer.com/v2/lookup/?${params.toString()}`, {
      signal: controller.signal,
      headers: {
        "x-api-key": apiKey,
        "User-Agent": "SiteScout/1.0",
      },
    });

    clearTimeout(timer);
    const responseTimeMs = Date.now() - startTime;

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const item = Array.isArray(data) ? data[0] : data;
    if (!item || !Array.isArray(item.technologies)) {
      return null;
    }

    const techs: string[] = item.technologies.map((t: { name: string }) => t.name);
    let dominantCms: TechDetectionResult["cms"] = "Custom / Other";
    let confidence = 0;

    for (const t of item.technologies) {
      const nameLower = (t.name || "").toLowerCase();

      if (nameLower.includes("wix")) {
        dominantCms = "Wix";
        confidence = t.confidence || 100;
        break;
      } else if (nameLower.includes("squarespace")) {
        dominantCms = "Squarespace";
        confidence = t.confidence || 100;
        break;
      } else if (nameLower.includes("wordpress") && dominantCms === "Custom / Other") {
        dominantCms = "WordPress";
        confidence = t.confidence || 100;
      } else if (nameLower.includes("shopify") && dominantCms === "Custom / Other") {
        dominantCms = "Shopify";
        confidence = t.confidence || 100;
      } else if (nameLower.includes("webflow") && dominantCms === "Custom / Other") {
        dominantCms = "Webflow";
        confidence = t.confidence || 100;
      }
    }

    return {
      url: rawUrl,
      normalizedUrl: url,
      cms: dominantCms,
      confidence: confidence || (dominantCms !== "Custom / Other" ? 100 : 50),
      technologies: techs,
      emails: [],
      phones: [],
      socials: {},
      responseTimeMs,
      status: "success",
    };
  } catch {
    return null;
  }
}

/**
 * Fetches a website URL with timeout, user-agent and detects CMS (with optional official Wappalyzer API)
 */
export async function inspectWebsite(
  rawUrl: string, 
  timeoutMs: number = 8000, 
  wappalyzerApiKey?: string
): Promise<TechDetectionResult> {
  const url = normalizeUrl(rawUrl);
  const startTime = Date.now();

  // 1. Try official Wappalyzer API if key provided
  if (wappalyzerApiKey) {
    const apiResult = await inspectWithWappalyzerApi(url, wappalyzerApiKey, timeoutMs);
    if (apiResult) {
      return apiResult;
    }
  }

  // 2. High-speed built-in Wappalyzer-grade scanner
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 SiteScout/1.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
    });

    clearTimeout(timer);
    const responseTimeMs = Date.now() - startTime;

    const headers: Record<string, string> = {};
    response.headers.forEach((val, key) => {
      headers[key] = val;
    });

    const html = await response.text();
    return analyzeHtml(html, headers, url, responseTimeMs);
  } catch (err: unknown) {
    const responseTimeMs = Date.now() - startTime;
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch website";

    return {
      url: rawUrl,
      normalizedUrl: url,
      cms: "Custom / Other",
      confidence: 0,
      technologies: [],
      emails: [],
      phones: [],
      socials: {},
      responseTimeMs,
      status: "unreachable",
      error: errorMessage,
    };
  }
}
