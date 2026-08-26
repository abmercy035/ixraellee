import { NextResponse } from "next/server";
import cloudinary from "../../../../lib/cloudinary";

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

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const oldUrl = formData.get("oldUrl") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Destroy old Cloudinary image if an old URL was passed and is hosted on Cloudinary
    if (oldUrl) {
      const oldPublicId = extractCloudinaryPublicId(oldUrl);
      if (oldPublicId) {
        try {
          await cloudinary.uploader.destroy(oldPublicId);
        } catch (err) {
          console.error("Failed to delete previous Cloudinary asset:", err);
        }
      }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResponse = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "ixraelle_journal" }, (error, result) => {
          if (error || !result) return reject(error);
          resolve(result);
        })
        .end(buffer);
    });

    return NextResponse.json({ url: uploadResponse.secure_url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Image upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const publicId = extractCloudinaryPublicId(url);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }

    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Image deletion failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
