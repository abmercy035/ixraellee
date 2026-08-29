import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAd extends Document {
  title?: string;
  description?: string;
  page: "home" | "article" | "category" | "all";
  section: "mid_article" | "sidebar" | "hero_banner" | "category_top" | "header";
  imageUrl: string;
  targetUrl: string;
  buttonText?: string;
  altText?: string;
  active: boolean;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
}

const AdSchema = new Schema<IAd>(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    page: {
      type: String,
      default: "home",
    },
    section: {
      type: String,
      default: "header",
    },
    imageUrl: { type: String, required: true },
    targetUrl: { type: String, required: true },
    buttonText: { type: String, default: "" },
    altText: { type: String, default: "" },
    active: { type: Boolean, default: true },
    clicks: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Clear model cache in development if schema was updated
if (process.env.NODE_ENV !== "production" && mongoose.models.Ad) {
  delete (mongoose.models as Record<string, unknown>).Ad;
}

export const Ad: Model<IAd> =
  mongoose.models.Ad || mongoose.model<IAd>("Ad", AdSchema);
