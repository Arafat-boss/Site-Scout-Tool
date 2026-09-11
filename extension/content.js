/**
 * Site Scout — Content Script (Injected into active web pages & Fiverr)
 * Handles DOM sniffing, CMS detection, contact extraction, and Fiverr external link discovery.
 */

(function () {
  // Prevent duplicate injection
  if (window.__siteScoutLoaded) return;
  window.__siteScoutLoaded = true;

  const isFiverr = window.location.hostname.includes("fiverr.com");

  /**
   * Sniffs CMS and tech stack on the current active webpage
   */
  function inspectPageDOM() {
    const html = document.documentElement.outerHTML || "";
    const htmlLower = html.toLowerCase();

    let wixScore = 0;
    let sqspScore = 0;
    let wpScore = 0;
    let shopifyScore = 0;
    let webflowScore = 0;
    let weeblyScore = 0;
    let godaddyScore = 0;

    const detectedTechs = new Set();

    // 1. Meta Generator Check
    const metaGenerators = Array.from(document.querySelectorAll('meta[name="generator"], meta[name="Generator"]'))
      .map(m => (m.getAttribute("content") || "").toLowerCase());

    for (const gen of metaGenerators) {
      if (gen.includes("wix")) { wixScore += 70; detectedTechs.add("Wix Website Builder"); }
      if (gen.includes("squarespace")) { sqspScore += 70; detectedTechs.add("Squarespace Platform"); }
      if (gen.includes("wordpress")) { wpScore += 70; detectedTechs.add("WordPress CMS"); }
      if (gen.includes("shopify")) { shopifyScore += 70; detectedTechs.add("Shopify CMS"); }
      if (gen.includes("webflow")) { webflowScore += 70; detectedTechs.add("Webflow Builder"); }
    }

    // 2. Script & Link tag checking
    const scriptsAndLinks = Array.from(document.querySelectorAll("script[src], link[href]"))
      .map(el => (el.getAttribute("src") || el.getAttribute("href") || "").toLowerCase());

    for (const src of scriptsAndLinks) {
      if (src.includes("static.parastorage.com") || src.includes("static.wixstatic.com")) {
        wixScore += 40;
        detectedTechs.add("Wix CDN & Static Assets");
      }
      if (src.includes("static1.squarespace.com") || src.includes("assets.squarespace.com") || src.includes("sqsp.net")) {
        sqspScore += 45;
        detectedTechs.add("Squarespace CDN");
      }
      if (src.includes("/wp-content/") || src.includes("/wp-includes/")) {
        wpScore += 50;
        detectedTechs.add("WordPress Core Files");
      }
      if (src.includes("elementor")) {
        wpScore += 25;
        detectedTechs.add("Elementor Page Builder");
      }
      if (src.includes("woocommerce")) {
        wpScore += 25;
        detectedTechs.add("WooCommerce");
      }
      if (src.includes("cdn.shopify.com") || src.includes("shopify.theme")) {
        shopifyScore += 60;
        detectedTechs.add("Shopify Storefront CDN");
      }
      if (src.includes("assets.website-files.com")) {
        webflowScore += 60;
        detectedTechs.add("Webflow Hosting Files");
      }
    }

    // 3. DOM Elements & Attributes
    if (document.querySelector('wix-image, wix-video, #SITE_CONTAINER, [data-wix-renderer]')) {
      wixScore += 35;
      detectedTechs.add("Wix Component Hierarchy");
    }
    if (htmlLower.includes("wix-warmup-data") || htmlLower.includes("wix-thunderbolt")) {
      wixScore += 40;
      detectedTechs.add("Wix Thunderbolt Engine");
    }
    if (document.querySelector('[class*="sqs-block"], [class*="sqs-layout"], [id^="collection-"]')) {
      sqspScore += 40;
      detectedTechs.add("Squarespace Block Architecture");
    }
    if (document.querySelector('[data-wf-page], [data-wf-site]')) {
      webflowScore += 60;
      detectedTechs.add("Webflow Data Attributes");
    }
    if (htmlLower.includes("editmysite.com") || htmlLower.includes("weebly.com")) {
      weeblyScore += 60;
      detectedTechs.add("Weebly");
    }
    if (htmlLower.includes("secureserver.net") || htmlLower.includes("websites.godaddy.com")) {
      godaddyScore += 60;
      detectedTechs.add("GoDaddy Website Builder");
    }

    // 4. Analytics & Common Tools
    if (htmlLower.includes("google-analytics.com") || htmlLower.includes("gtag(") || htmlLower.includes("ga('create'")) {
      detectedTechs.add("Google Analytics");
    }
    if (htmlLower.includes("googletagmanager.com")) {
      detectedTechs.add("Google Tag Manager");
    }
    if (htmlLower.includes("connect.facebook.net") || htmlLower.includes("fbq(")) {
      detectedTechs.add("Facebook Pixel");
    }

    // Determine CMS
    const scores = [
      { cms: "Wix", score: wixScore },
      { cms: "Squarespace", score: sqspScore },
      { cms: "WordPress", score: wpScore },
      { cms: "Shopify", score: shopifyScore },
      { cms: "Webflow", score: webflowScore },
      { cms: "Weebly", score: weeblyScore },
      { cms: "GoDaddy", score: godaddyScore },
    ];

    let dominantCms = "Custom / Other";
    let maxScore = 0;

    for (const item of scores) {
      if (item.score > maxScore && item.score >= 25) {
        maxScore = item.score;
        dominantCms = item.cms;
      }
    }

    const confidence = Math.min(100, maxScore > 0 ? maxScore : 0);

    // 5. Contact Extraction (Emails, Phones, Socials)
    const emailSet = new Set();
    document.querySelectorAll('a[href^="mailto:"]').forEach(el => {
      const mailto = el.getAttribute("href")?.replace("mailto:", "").split("?")[0].trim().toLowerCase();
      if (mailto && mailto.includes("@") && !mailto.includes("wix.com") && !mailto.includes("squarespace.com")) {
        emailSet.add(mailto);
      }
    });

    const bodyText = document.body ? document.body.innerText : "";
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const matches = bodyText.match(emailRegex) || [];
    for (const m of matches) {
      const email = m.trim().toLowerCase();
      if (
        !email.endsWith(".png") &&
        !email.endsWith(".jpg") &&
        !email.includes("wixpress.com") &&
        !email.includes("squarespace.com") &&
        !email.includes("sentry.io") &&
        email.length < 45
      ) {
        emailSet.add(email);
      }
    }

    const phoneSet = new Set();
    document.querySelectorAll('a[href^="tel:"]').forEach(el => {
      const tel = el.getAttribute("href")?.replace("tel:", "").trim();
      if (tel && tel.length >= 7) {
        phoneSet.add(tel);
      }
    });

    const socials = {};
    document.querySelectorAll("a[href]").forEach(el => {
      const href = el.getAttribute("href") || "";
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
      cms: dominantCms,
      confidence,
      technologies: Array.from(detectedTechs),
      emails: Array.from(emailSet).slice(0, 4),
      phones: Array.from(phoneSet).slice(0, 3),
      socials,
      title: document.title || "",
      url: window.location.href,
    };
  }

  /**
   * Scans Fiverr pages (Gigs, orders, buyer requests, user profile) for external client website URLs
   */
  function extractFiverrExternalLinks() {
    if (!isFiverr) return [];

    const foundLinks = new Set();
    const urlRegex = /(https?:\/\/[^\s<>"']+|(?:[a-zA-Z0-9-]+\.)+(?:com|org|net|io|co|us|uk|ca|me|app|dev|biz|info|site|online|store|wixsite\.com|myshopify\.com)(?:\/[^\s<>"']*)?)/gi;

    // Scan links
    document.querySelectorAll("a[href]").forEach(a => {
      const href = a.getAttribute("href") || "";
      if (
        href.startsWith("http") &&
        !href.includes("fiverr.com") &&
        !href.includes("fiverrcdn.com") &&
        !href.includes("google.com") &&
        !href.includes("facebook.com") &&
        !href.includes("twitter.com") &&
        !href.includes("instagram.com")
      ) {
        foundLinks.add(href.trim());
      }
    });

    // Scan text in gig descriptions, user bios, order requirements, and chat messages
    const selectors = [
      ".gig-description",
      ".description-wrapper",
      ".user-profile-description",
      ".order-requirement-content",
      ".message-body",
      "[data-testid='message-text']",
      "p",
      "li"
    ];

    document.querySelectorAll(selectors.join(",")).forEach(el => {
      const text = el.innerText || "";
      const matches = text.match(urlRegex) || [];
      for (let m of matches) {
        let clean = m.trim().replace(/[.,;)]+$/, "");
        if (!clean.includes("fiverr.com") && !clean.includes("fiverrcdn.com")) {
          if (!clean.startsWith("http")) clean = `https://${clean}`;
          foundLinks.add(clean);
        }
      }
    });

    return Array.from(foundLinks).slice(0, 15);
  }

  // Initial scan to update badge if needed
  try {
    const pageData = inspectPageDOM();
    if (pageData.cms && pageData.cms !== "Custom / Other") {
      chrome.runtime.sendMessage({
        type: "UPDATE_BADGE",
        text: pageData.cms.slice(0, 4).toUpperCase(),
        color: "#000000",
      });
    } else if (isFiverr) {
      chrome.runtime.sendMessage({
        type: "UPDATE_BADGE",
        text: "FVRR",
        color: "#1dbf73",
      });
    }
  } catch {
    // Context might not be available
  }

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "SCAN_CURRENT_PAGE") {
      const domResult = inspectPageDOM();
      const fiverrLinks = extractFiverrExternalLinks();

      sendResponse({
        isFiverr,
        ...domResult,
        fiverrLinks,
      });
    }
    return true; // Keep channel open for async response
  });
})();
