import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "content", "posts");

export type PostMetadata = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  banner: string;
  category: string;
};

export type PostData = PostMetadata & {
  contentHtml: string;
};

function readPostFile(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  return fs.readFileSync(fullPath, "utf8");
}

export function getAllPosts(): PostMetadata[] {
  const fileNames = fs.readdirSync(postsDirectory);

  const posts = fileNames
    .filter((name) => name.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fileContents = readPostFile(slug);
      const { data } = matter(fileContents);

      return {
        slug,
        title: String(data.title ?? slug),
        date: String(data.date ?? ""),
        excerpt: String(data.excerpt ?? ""),
        banner: String(data.banner ?? "/banners/default.svg"),
        category: String(data.category ?? "General"),
      };
    });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<PostData> {
  const fileContents = readPostFile(slug);
  const { data, content } = matter(fileContents);

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ""),
    excerpt: String(data.excerpt ?? ""),
    banner: String(data.banner ?? "/banners/default.svg"),
    category: String(data.category ?? "General"),
    contentHtml,
  };
}
