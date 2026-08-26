import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubscriber extends Document {
  email: string;
  name?: string;
  status: "active" | "unsubscribed";
  createdAt: Date;
}

const SubscriberSchema = new Schema<ISubscriber>(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, default: "" },
    status: { type: String, enum: ["active", "unsubscribed"], default: "active" },
  },
  { timestamps: true }
);

export const Subscriber: Model<ISubscriber> =
  mongoose.models.Subscriber || mongoose.model<ISubscriber>("Subscriber", SubscriberSchema);
