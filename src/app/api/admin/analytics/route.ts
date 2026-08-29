import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { Analytics } from "../../../../models/Analytics";
import { Post } from "../../../../models/Post";
import { Ad } from "../../../../models/Ad";
import { Comment } from "../../../../models/Comment";
import { Subscriber } from "../../../../models/Subscriber";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "30d"; // '24h', '7d', '30d'

    await connectDB();

    const now = new Date();
    let startDate = new Date();
    if (range === "24h") {
      startDate.setHours(startDate.getHours() - 24);
    } else if (range === "7d") {
      startDate.setDate(startDate.getDate() - 7);
    } else {
      startDate.setDate(startDate.getDate() - 30);
    }

    const matchFilter = { timestamp: { $gte: startDate } };

    const [
      totalPageviews,
      uniqueVisitorsResult,
      topPostsResult,
      topReferrersResult,
      deviceBreakdownResult,
      dailyTrendResult,
      totalComments,
      totalSubscribers,
      adsSummary,
    ] = await Promise.all([
      // Total Pageviews in period
      Analytics.countDocuments(matchFilter),

      // Unique Visitors in period (distinct visitorId)
      Analytics.distinct("visitorId", matchFilter),

      // Top viewed articles / paths
      Analytics.aggregate([
        { $match: { ...matchFilter, eventType: { $in: ["pageview", "post_read"] } } },
        {
          $group: {
            _id: "$path",
            views: { $sum: 1 },
            uniqueViews: { $addToSet: "$visitorId" },
          },
        },
        {
          $project: {
            path: "$_id",
            views: 1,
            uniques: { $size: "$uniqueViews" },
          },
        },
        { $sort: { views: -1 } },
        { $limit: 10 },
      ]),

      // Top Referrers
      Analytics.aggregate([
        { $match: { ...matchFilter, referrer: { $ne: "" } } },
        { $group: { _id: "$referrer", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),

      // Device breakdown
      Analytics.aggregate([
        { $match: matchFilter },
        { $group: { _id: "$device", count: { $sum: 1 } } },
      ]),

      // Daily trend (grouped by YYYY-MM-DD)
      Analytics.aggregate([
        { $match: matchFilter },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            views: { $sum: 1 },
            uniqueVisitors: { $addToSet: "$visitorId" },
          },
        },
        {
          $project: {
            date: "$_id",
            views: 1,
            uniques: { $size: "$uniqueVisitors" },
          },
        },
        { $sort: { date: 1 } },
      ]),

      // Aggregate global metrics
      Comment.countDocuments(),
      Subscriber.countDocuments({ status: "active" }),
      Ad.find({}).select("_id title page section clicks impressions").lean(),
    ]);

    // Map top posts to real titles if available
    const postSlugs = topPostsResult
      .filter((p) => p.path.startsWith("/posts/"))
      .map((p) => p.path.replace("/posts/", "").split("?")[0]);

    const postDocs = await Post.find({ slug: { $in: postSlugs } })
      .select("slug title category views")
      .lean();

    const postMap = new Map(postDocs.map((doc) => [doc.slug, doc]));

    const enrichedTopPosts = topPostsResult.map((item) => {
      const slug = item.path.replace("/posts/", "").split("?")[0];
      const match = postMap.get(slug);
      return {
        path: item.path,
        title: match ? match.title : item.path === "/" ? "Home Page" : item.path,
        category: match ? match.category : "General",
        views: item.views,
        uniques: item.uniques,
      };
    });

    return NextResponse.json({
      range,
      totalViews: totalPageviews,
      uniqueVisitors: uniqueVisitorsResult.length,
      topPosts: enrichedTopPosts,
      topReferrers: topReferrersResult.map((r) => ({ referrer: r._id, count: r.count })),
      deviceBreakdown: deviceBreakdownResult.map((d) => ({ device: d._id || "desktop", count: d.count })),
      dailyTrend: dailyTrendResult,
      totalComments,
      totalSubscribers,
      adsSummary,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
