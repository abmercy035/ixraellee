import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "../../../lib/db";
import { Post } from "../../../models/Post";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const publishedOnly = searchParams.get("admin") !== "true";

    await connectDB();

    const query: Record<string, unknown> = {};
    if (category) query.category = category;
    if (publishedOnly) query.published = true;

    const posts = await Post.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json(posts);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, excerpt, content, banner, category, published, featured, worthReading } = body;

    if (!title || !slug || !excerpt || !content || !category) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    await connectDB();

    const post = await Post.findOneAndUpdate(
      { slug },
      {
        title,
        slug,
        excerpt,
        content,
        banner: banner || "/images/welcome-journal.jpg",
        category,
        published: published !== false,
        featured: featured === true,
        worthReading: worthReading === true,
        date: new Date().toISOString().split("T")[0],
      },
      { upsert: true, returnDocument: 'after' }
    );

    // Instant Cache Revalidation
    try {
      revalidatePath("/");
      revalidatePath("/admin/posts");
      revalidatePath("/thoughts");
      revalidatePath("/works");
      revalidatePath("/life");
      revalidatePath(`/posts/${slug}`);
      revalidatePath(`/categories/${category}`);
    } catch (e) {
      console.warn("Revalidation warning:", e);
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

