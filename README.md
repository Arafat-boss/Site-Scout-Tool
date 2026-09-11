# 🚀 Site Scout — Local CMS & Tech Stack Lead Discovery Tool

An intelligent, full-stack lead generation and CMS detection application built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **Wappalyzer Core**.

Site Scout helps web designers, agencies, and sales professionals uncover local businesses in any city, detect their website technology stack (specifically flagging **Wix**, **Squarespace**, **WordPress**, **Shopify**, and **Webflow**), extract contact details, generate AI outreach pitches, and export leads to Excel.

---

## ✨ Key Features

- 🔍 **Location & Niche Scout**: Search across any city or category worldwide (e.g., *Dentists in Miami*, *Real Estate in London*).
- 🏷️ **Wappalyzer & CMS Detector**:
  - Sniffs DOM, headers, CDN assets, script signatures, and meta tags.
  - Automatically identifies **Wix**, **Squarespace**, **WordPress**, **Shopify**, **Webflow**, **Weebly**, **GoDaddy**, etc.
  - **Official Wappalyzer API v2 Support**: Connect your official Wappalyzer API key or use the built-in 100% free scanner engine.
- ⚡ **Lead Data Enrichment**: Automatically extracts business names, phone numbers, contact emails, addresses, and social media links (Facebook, Instagram, LinkedIn, X/Twitter).
- 🪄 **AI Cold Outreach Pitch Generator**: 1-click tailored email proposals identifying Wix/Squarespace performance, mobile layout, and SEO bottlenecks to pitch redesign services.
- 📊 **Interactive Analytics & Filters**: Real-time stats cards and one-click filtering by CMS platform.
- 📥 **Instant Excel / CSV Export**: Export all enriched leads to `.xlsx` with one click.
- 🧪 **Quick URL Inspector**: Single-site analyzer bar to inspect any custom website on demand.
- 🧩 **Chrome Extension (Manifest V3)**: In-browser extension for sniffing client sites, discovering external website links on Fiverr, and generating 1-click proposals.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router & Turbopack)](https://nextjs.org/)
- **UI & Components**: [React 19](https://react.dev/), [Lucide React Icons](https://lucide.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **HTML & Metadata Parser**: [Cheerio](https://cheerio.js.org/)
- **Data Export**: [SheetJS (XLSX)](https://sheetjs.com/)
- **Language**: TypeScript 5

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Arafat-boss/Site-Scout-Tool.git
cd site-scout
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Optional API Settings

Site Scout works **100% out of the box without any API keys**. However, you can optionally configure keys in the **Settings** drawer:
- **Wappalyzer API v2 Key**: For official Wappalyzer lookup.
- **SerpApi / Serper.dev Key**: For direct Google Maps integration.

---

## 📄 License

MIT License • Built by [Arafat](https://github.com/Arafat-boss)
