import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { Post } from "../../../models/Post";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() || "";
    const category = searchParams.get("category")?.trim();

    await connectDB();

    const dbQuery: Record<string, unknown> = { published: true };

    if (category && category !== "all") {
      dbQuery.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    if (query) {
      const regex = new RegExp(query, "i");
      dbQuery.$or = [
        { title: regex },
        { excerpt: regex },
        { content: regex },
        { category: regex },
        { slug: regex },
      ];
    }

    const posts = await Post.find(dbQuery)
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json(posts);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
