import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { Analytics } from "../../../../models/Analytics";
import { Post } from "../../../../models/Post";

export async function POST(request: Request) {
  try {
    const { path, referrer } = await request.json();

    if (!path || typeof path !== "string") {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    const userAgent = request.headers.get("user-agent") || "";
    await connectDB();

    await Analytics.create({
      path,
      referrer: referrer || "",
      userAgent,
      timestamp: new Date(),
    });

    if (path.startsWith("/posts/")) {
      const slug = path.replace("/posts/", "");
      await Post.updateOne({ slug }, { $inc: { views: 1 } });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
