import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAnalytics extends Document {
  path: string;
  referrer: string;
  userAgent: string;
  timestamp: Date;
}

const AnalyticsSchema = new Schema<IAnalytics>(
  {
    path: { type: String, required: true, index: true },
    referrer: { type: String, default: "" },
    userAgent: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

export const Analytics: Model<IAnalytics> =
  mongoose.models.Analytics || mongoose.model<IAnalytics>("Analytics", AnalyticsSchema);
