import { NextRequest, NextResponse } from "next/server";
import { inspectWebsite } from "@/lib/cms-detector";

export async function POST(req: NextRequest) {
  try {
    const { url, wappalyzerApiKey } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const result = await inspectWebsite(url, 9000, wappalyzerApiKey);
    return NextResponse.json({ success: true, result });
  } catch (err: unknown) {
    console.error("Inspect API Error:", err);
    const message = err instanceof Error ? err.message : "Inspection failed";
    return NextResponse.json({ error: message, stack: err instanceof Error ? err.stack : undefined }, { status: 500 });
  }
}
