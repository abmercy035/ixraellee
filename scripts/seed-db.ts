import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ixraelle-journal";

const PostSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    banner: { type: String, default: "/images/welcome-journal.jpg" },
    category: { type: String, required: true, index: true },
    published: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);

async function seed() {
  console.log("Connecting to MongoDB:", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);

  const postsDir = path.join(process.cwd(), "content", "posts");
  let fileNames: string[] = [];
  if (fs.existsSync(postsDir)) {
    fileNames = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
  }

  for (const fileName of fileNames) {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(postsDir, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const postDoc = {
      slug,
      title: String(data.title || slug),
      excerpt: String(data.excerpt || ""),
      content,
      banner: String(data.banner || "/images/welcome-journal.jpg"),
      category: String(data.category || "General"),
      published: true,
      date: String(data.date || new Date().toISOString().split("T")[0]),
    };

    await Post.findOneAndUpdate({ slug }, postDoc, { returnDocument: 'after' });
    console.log(`✓ Seeded post: ${slug}`);
  }

  console.log("Database seeding completed successfully!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Error seeding database:", err);
  process.exit(1);
});
