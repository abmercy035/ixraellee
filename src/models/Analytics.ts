import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAnalytics extends Document {
  eventType: "pageview" | "post_read" | "ad_click" | "comment" | "subscribe";
  path: string;
  postSlug?: string;
  visitorId: string;
  referrer?: string;
  userAgent?: string;
  device?: "mobile" | "desktop" | "tablet";
  timestamp: Date;
}

const AnalyticsSchema = new Schema<IAnalytics>(
  {
    eventType: {
      type: String,
      enum: ["pageview", "post_read", "ad_click", "comment", "subscribe"],
      default: "pageview",
      index: true,
    },
    path: { type: String, required: true, index: true },
    postSlug: { type: String, index: true },
    visitorId: { type: String, required: true, index: true },
    referrer: { type: String, default: "" },
    userAgent: { type: String, default: "" },
    device: { type: String, enum: ["mobile", "desktop", "tablet"], default: "desktop" },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

// Compound index for time-series and unique visitor aggregations
AnalyticsSchema.index({ timestamp: -1, eventType: 1 });
AnalyticsSchema.index({ visitorId: 1, timestamp: -1 });

export const Analytics: Model<IAnalytics> =
  mongoose.models.Analytics || mongoose.model<IAnalytics>("Analytics", AnalyticsSchema);
