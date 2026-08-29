import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { Analytics } from "../../../../models/Analytics";
import { Post } from "../../../../models/Post";

function parseDevice(ua: string): "mobile" | "desktop" | "tablet" {
  const lower = ua.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(lower)) return "tablet";
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(lower)) {
    return "mobile";
  }
  return "desktop";
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { eventType = "pageview", path = "/", postSlug, referrer = "" } = body;

    // Skip tracking admin panel views
    if (typeof path === "string" && path.startsWith("/admin")) {
      return NextResponse.json({ ok: true });
    }

    const cookieHeader = request.headers.get("cookie") || "";
    let visitorId = "";
    const vidMatch = cookieHeader.match(/_ix_vid=([^;]+)/);
    if (vidMatch && vidMatch[1]) {
      visitorId = vidMatch[1];
    } else {
      visitorId = `vid_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
    }

    const userAgent = request.headers.get("user-agent") || "";
    const device = parseDevice(userAgent);

    await connectDB();

    // Log the event
    await Analytics.create({
      eventType,
      path,
      postSlug: postSlug || (path.startsWith("/posts/") ? path.replace("/posts/", "").split("?")[0] : undefined),
      visitorId,
      referrer,
      userAgent: userAgent.slice(0, 200),
      device,
      timestamp: new Date(),
    });

    // Increment post view count on post read event
    const slug = postSlug || (path.startsWith("/posts/") ? path.replace("/posts/", "").split("?")[0] : null);
    if (slug && (eventType === "post_read" || eventType === "pageview")) {
      await Post.updateOne({ slug }, { $inc: { views: 1 } }).catch(() => {});
    }

    const response = NextResponse.json({ ok: true, visitorId });

    // Set 1-year visitor session cookie if not already present
    if (!vidMatch) {
      response.cookies.set("_ix_vid", visitorId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        httpOnly: false, // Accessible to client tracking scripts
        sameSite: "lax",
      });
    }

    return response;
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 }); // Non-blocking tracking
  }
}
