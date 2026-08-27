import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { Comment } from "../../../../../models/Comment";
import { Subscriber } from "../../../../../models/Subscriber";

type RouteParams = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    await connectDB();

    const comments = await Comment.find({ postId: slug, approved: true })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(comments);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { authorName, authorEmail, content } = body;

    if (!authorName || !authorEmail || !content) {
      return NextResponse.json({ error: "Name, email, and comment content are required." }, { status: 400 });
    }

    await connectDB();

    // 1. Create the comment
    const newComment = await Comment.create({
      postId: slug,
      authorName,
      authorEmail,
      content,
      approved: true,
    });

    // 2. Automatically register as a subscriber if not already registered
    await Subscriber.findOneAndUpdate(
      { email: authorEmail },
      { email: authorEmail, name: authorName, status: "active" },
      { upsert: true, returnDocument: 'after' }
    );

    // 3. Set a 1-year commenter session cookie (365 days = 31,536,000 seconds)
    const sessionData = JSON.stringify({ name: authorName, email: authorEmail });
    const response = NextResponse.json(newComment, { status: 201 });

    response.cookies.set("commenter_session", sessionData, {
      maxAge: 31536000,
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
