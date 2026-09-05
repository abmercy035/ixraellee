import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "../../../lib/db";
import { Post } from "../../../models/Post";
import { Subscriber } from "../../../models/Subscriber";
import { sendBroadcast } from "../../../lib/email";

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

    const isPublished = published !== false;

    const post = await Post.findOneAndUpdate(
      { slug },
      {
        title,
        slug,
        excerpt,
        content,
        banner: banner || "/images/welcome-journal.jpg",
        category,
        published: isPublished,
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

    // Trigger automatic batch email broadcast to active subscribers on publication
    if (isPublished) {
      (async () => {
        try {
          const activeSubscribers = await Subscriber.find({ status: "active" }).select("email name").lean();
          if (activeSubscribers.length > 0) {
            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ixraellee.com";
            const postUrl = `${siteUrl}/posts/${slug}`;
            const recipients = activeSubscribers.map((s) => ({
              name: s.name || "Subscriber",
              address: s.email,
            }));

            const emailHtml = `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; background-color: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #e2e8f0;">
                <p style="font-size: 11px; font-weight: 700; text-transform: uppercase; tracking: 0.1em; color: #0088CC; margin-top: 0;">New Story Published · ${category}</p>
                <h1 style="font-size: 24px; font-weight: 800; color: #0f172a; margin-top: 4px; margin-bottom: 16px;">${title}</h1>
                <p style="font-size: 15px; color: #334155; line-height: 1.6;">${excerpt}</p>
                <div style="margin-top: 28px; margin-bottom: 28px;">
                  <a href="${postUrl}" style="background-color: #0088CC; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">Read Full Story →</a>
                </div>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0 16px;" />
                <p style="font-size: 12px; color: #94a3b8; margin: 0;">You received this update because you subscribed to Ixraellee Journal. <a href="__unsubscribe_url__" style="color: #0088CC; text-decoration: underline;">unsubscribe</a></p>
              </div>
            `;

            await sendBroadcast({
              subject: `New Story: ${title}`,
              html: emailHtml,
              recipients,
            });
          }
        } catch (err) {
          console.error("[New Post Broadcast Error]:", err);
        }
      })();
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

