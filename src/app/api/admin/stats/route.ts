import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { Post } from "../../../../models/Post";

// Subscriber model
import mongoose, { Schema } from "mongoose";
const SubscriberSchema = new Schema({ email: { type: String, unique: true }, createdAt: { type: Date, default: Date.now } });
const Subscriber = mongoose.models.Subscriber || mongoose.model("Subscriber", SubscriberSchema);

export async function GET() {
  try {
    await connectDB();

    const [
      totalPosts,
      publishedPosts,
      totalViews,
      subscribers,
      categories,
      featuredPosts,
      worthReadingPosts,
    ] = await Promise.all([
      Post.countDocuments(),
      Post.countDocuments({ published: true }),
      Post.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
      Subscriber.countDocuments(),
      Post.distinct("category", { published: true }),
      Post.countDocuments({ featured: true }),
      Post.countDocuments({ worthReading: true }),
    ]);

    const views = totalViews[0]?.total || 0;

    return NextResponse.json({
      totalPosts,
      publishedPosts,
      draftPosts: totalPosts - publishedPosts,
      totalViews: views,
      subscribers,
      categories: categories.length,
      featuredPosts,
      worthReadingPosts,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
