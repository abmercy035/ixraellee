import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { Ad } from "../../../models/Ad";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    const section = searchParams.get("section");

    await connectDB();

    // Public readers should only see active ads
    const query: Record<string, unknown> = { active: true };
    if (page) {
      query.page = { $in: [page, "all"] };
    }

    let ads = await Ad.find(query).sort({ createdAt: -1 }).lean();

    if (section && ads.length > 0) {
      const exactSectionMatch = ads.filter((a) => a.section === section);
      if (exactSectionMatch.length > 0) {
        ads = exactSectionMatch;
      }
    }

    return NextResponse.json(ads);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
