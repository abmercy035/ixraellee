import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPost extends Document {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  banner: string;
  category: string;
  published: boolean;
  featured: boolean;
  worthReading: boolean;
  views: number;
  date: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    banner: { type: String, default: "/images/welcome-journal.jpg" },
    category: { type: String, required: true, index: true },
    published: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    worthReading: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

export const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
