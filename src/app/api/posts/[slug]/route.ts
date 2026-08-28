import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "../../../../lib/db";
import { Post } from "../../../../models/Post";
import cloudinary from "../../../../lib/cloudinary";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

function extractCloudinaryPublicId(url: string): string | null {
  if (!url || !url.includes("cloudinary.com")) return null;

  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;

    let path = parts[1];
    // Strip version prefix if present (e.g. v1724590000/)
    path = path.replace(/^v\d+\//, "");

    // Strip extension (.jpg, .png, etc.)
    const lastDotIndex = path.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      path = path.substring(0, lastDotIndex);
    }

    return path;
  } catch {
    return null;
  }
}

export async function GET(_request: Request, { params }: RouteProps) {
  try {
    const { slug } = await params;
    await connectDB();

    const post = await Post.findOne({ slug }).lean();
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteProps) {
  try {
    const { slug } = await params;
    const updates = await request.json();

    await connectDB();
    const post = await Post.findOneAndUpdate({ slug }, updates, { returnDocument: 'after' }).lean();

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    try {
      revalidatePath("/");
      revalidatePath("/admin/posts");
      revalidatePath("/thoughts");
      revalidatePath("/works");
      revalidatePath("/life");
      revalidatePath(`/posts/${slug}`);
      if (post.category) revalidatePath(`/categories/${post.category}`);
    } catch (e) {
      console.warn("Revalidation warning:", e);
    }

    return NextResponse.json(post);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteProps) {
  try {
    const { slug } = await params;
    await connectDB();

    const post = await Post.findOne({ slug });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Delete attached Cloudinary image if hosted on Cloudinary
    if (post.banner) {
      const publicId = extractCloudinaryPublicId(post.banner);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Cloudinary image deletion failed:", err);
        }
      }
    }

    const postCategory = post.category;
    await Post.deleteOne({ _id: post._id });

    try {
      revalidatePath("/");
      revalidatePath("/admin/posts");
      revalidatePath("/thoughts");
      revalidatePath("/works");
      revalidatePath("/life");
      revalidatePath(`/posts/${slug}`);
      if (postCategory) revalidatePath(`/categories/${postCategory}`);
    } catch (e) {
      console.warn("Revalidation warning:", e);
    }

    return NextResponse.json({ message: "Post and attached image deleted successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
