import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { Post } from "../../../../models/Post";
import { Subscriber } from "../../../../models/Subscriber";
import { Analytics } from "../../../../models/Analytics";
import { Comment } from "../../../../models/Comment";

export async function GET() {
  try {
    await connectDB();

    const [
      totalPosts,
      publishedPosts,
      totalViews,
      uniqueVisitors,
      subscribers,
      categories,
      featuredPosts,
      worthReadingPosts,
      totalComments,
    ] = await Promise.all([
      Post.countDocuments(),
      Post.countDocuments({ published: true }),
      Post.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
      Analytics.distinct("visitorId"),
      Subscriber.countDocuments({ status: "active" }),
      Post.distinct("category", { published: true }),
      Post.countDocuments({ featured: true }),
      Post.countDocuments({ worthReading: true }),
      Comment.countDocuments(),
    ]);

    const views = totalViews[0]?.total || 0;

    return NextResponse.json({
      totalPosts,
      publishedPosts,
      draftPosts: totalPosts - publishedPosts,
      totalViews: views,
      uniqueVisitors: uniqueVisitors.length,
      subscribers,
      categories: categories.length,
      featuredPosts,
      worthReadingPosts,
      totalComments,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
