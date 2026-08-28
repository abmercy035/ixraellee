import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { Ad } from "../../../../models/Ad";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    const section = searchParams.get("section");
    const activeOnly = searchParams.get("active") === "true";

    await connectDB();

    const query: Record<string, unknown> = {};
    if (page) query.page = { $in: [page, "all"] };
    if (activeOnly) query.active = true;

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, page, section, imageUrl, targetUrl, altText, active } = body;

    if (!title || !imageUrl) {
      return NextResponse.json({ error: "Title and Image URL are required." }, { status: 400 });
    }

    await connectDB();

    const newAd = await Ad.create({
      title,
      page: page || "all",
      section: section || "mid_article",
      imageUrl,
      targetUrl: targetUrl || "#",
      altText: altText || title,
      active: active !== false,
    });

    return NextResponse.json(newAd, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
