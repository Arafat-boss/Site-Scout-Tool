import { EnrichedLead } from "@/app/api/scout/route";

export function generatePitchProposal(lead: EnrichedLead): {
  subject: string;
  body: string;
  keyIssues: string[];
  suggestedAction: string;
} {
  const isWix = lead.cms === "Wix";
  const isSqsp = lead.cms === "Squarespace";
  const businessName = lead.name || "Business Owner";
  const url = lead.website;

  const keyIssues: string[] = [];
  if (isWix) {
    keyIssues.push("Heavy client-side script bundle impacting mobile PageSpeed score");
    keyIssues.push("Wix layout shifting and SEO structure limitations for local search ranking");
    keyIssues.push("Limited custom conversion funnel tracking");
  } else if (isSqsp) {
    keyIssues.push("Squarespace template rigid layout limiting custom brand feel");
    keyIssues.push("High subscription cost vs custom high-performance web app");
    keyIssues.push("Slow LCP (Largest Contentful Paint) on image-heavy pages");
  } else {
    keyIssues.push("Legacy code architecture needing modernization");
    keyIssues.push("Sub-optimal mobile responsiveness & conversion rate");
  }

  const subject = `Quick question regarding ${businessName}'s website (${url.replace(/https?:\/\//, '')})`;

  const body = `Hi ${businessName} Team,

I came across ${businessName} while searching for top businesses in ${lead.address || "your area"}. I really love what you've built!

While browsing your website (${url}), I noticed you are currently using ${lead.cms}. 

While ${lead.cms} is great for getting started, I noticed a few quick opportunities that could significantly boost your search rankings and customer conversion rate:
${keyIssues.map((issue, idx) => `${idx + 1}. ${issue}`).join("\n")}

We recently helped a similar local business revamp their ${lead.cms} site to a high-speed, modern custom platform, which increased their inbound inquiries by over 40% in the first 30 days.

Would you be open to a quick 5-minute chat or a free custom video audit of your website this week?

Best regards,
Web Design & Growth Specialist`;

  return {
    subject,
    body,
    keyIssues,
    suggestedAction: isWix || isSqsp ? "Target for Modern Custom Redesign / Next.js Migration" : "Standard Outreach",
  };
}
