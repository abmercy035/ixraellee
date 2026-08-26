import mongoose, { Schema, Document, Model } from "mongoose";

export interface IComment extends Document {
  postId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    postId: { type: String, required: true, index: true },
    authorName: { type: String, required: true },
    authorEmail: { type: String, required: true },
    content: { type: String, required: true },
    approved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
