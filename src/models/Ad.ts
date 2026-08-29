import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAd extends Document {
  title: string;
  description?: string;
  page: "home" | "article" | "category" | "all";
  section: "mid_article" | "sidebar" | "hero_banner" | "category_top";
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
    title: { type: String, required: true },
    description: { type: String, default: "" },
    page: {
      type: String,
      enum: ["home", "article", "category", "all"],
      default: "article",
    },
    section: {
      type: String,
      enum: ["mid_article", "sidebar", "hero_banner", "category_top"],
      default: "mid_article",
    },
    imageUrl: { type: String, required: true },
    targetUrl: { type: String, default: "#" },
    buttonText: { type: String, default: "" },
    altText: { type: String, default: "Sponsored Advertisement" },
    active: { type: Boolean, default: true },
    clicks: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Ad: Model<IAd> =
  mongoose.models.Ad || mongoose.model<IAd>("Ad", AdSchema);
