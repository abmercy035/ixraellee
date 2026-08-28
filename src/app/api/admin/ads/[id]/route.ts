import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { Ad } from "../../../../../models/Ad";
import cloudinary from "../../../../../lib/cloudinary";

type RouteProps = {
  params: Promise<{ id: string }>;
};

function extractCloudinaryPublicId(url: string): string | null {
  if (!url || !url.includes("cloudinary.com")) return null;

  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;

    let path = parts[1];
    path = path.replace(/^v\d+\//, "");

    const lastDotIndex = path.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      path = path.substring(0, lastDotIndex);
    }

    return path;
  } catch {
    return null;
  }
}

export async function PUT(request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    const body = await request.json();

    await connectDB();

    // If request is tracking a click
    if (body.action === "click") {
      const updated = await Ad.findByIdAndUpdate(id, { $inc: { clicks: 1 } }, { returnDocument: 'after' }).lean();
      return NextResponse.json(updated);
    }

    const updated = await Ad.findByIdAndUpdate(id, body, { returnDocument: 'after' }).lean();
    if (!updated) {
      return NextResponse.json({ error: "Ad placement not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    await connectDB();

    const ad = await Ad.findById(id);
    if (!ad) {
      return NextResponse.json({ error: "Ad placement not found" }, { status: 404 });
    }

    if (ad.imageUrl) {
      const publicId = extractCloudinaryPublicId(ad.imageUrl);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Cloudinary ad image deletion error:", err);
        }
      }
    }

    await Ad.deleteOne({ _id: id });

    return NextResponse.json({ message: "Ad deleted successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
