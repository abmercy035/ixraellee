import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { Ad } from "../../../models/Ad";
import { Analytics } from "../../../models/Analytics";

type RouteProps = {
  params: Promise<{ id: string }>;
};

function parseDevice(ua: string): "mobile" | "desktop" | "tablet" {
  const lower = ua.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(lower)) return "tablet";
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(lower)) {
    return "mobile";
  }
  return "desktop";
}

export async function GET(request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;

    if (!id || id.length < 5) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    await connectDB();

    const ad = await Ad.findById(id).select("targetUrl active").lean();

    if (!ad || !ad.targetUrl || ad.targetUrl === "#") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Atomically increment ad click count
    await Ad.updateOne({ _id: id }, { $inc: { clicks: 1 } }).catch(() => {});

    // Log click event into Analytics collection
    const cookieHeader = request.headers.get("cookie") || "";
    const vidMatch = cookieHeader.match(/_ix_vid=([^;]+)/);
    const visitorId = vidMatch && vidMatch[1] ? vidMatch[1] : `vid_anon_${Date.now()}`;
    const userAgent = request.headers.get("user-agent") || "";
    const referrer = request.headers.get("referer") || "";

    await Analytics.create({
      eventType: "ad_click",
      path: `/ad/${id}`,
      visitorId,
      referrer,
      userAgent: userAgent.slice(0, 200),
      device: parseDevice(userAgent),
      timestamp: new Date(),
    }).catch(() => {});

    // Ensure valid absolute destination URL
    let destination = ad.targetUrl.trim();
    if (!destination.startsWith("http://") && !destination.startsWith("https://")) {
      destination = `https://${destination}`;
    }

    return NextResponse.redirect(destination, 307);
  } catch (error) {
    console.error("Ad redirect error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
