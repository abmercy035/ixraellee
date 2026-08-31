import { remark } from "remark";
import html from "remark-html";
import { connectDB } from "./db";
import { Post, IPost } from "../models/Post";

export type PostMetadata = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  banner: string;
  category: string;
  featured?: boolean;
  worthReading?: boolean;
  views?: number;
  published?: boolean;
  readTime?: number;
};

export type PostData = PostMetadata & {
  contentHtml: string;
};

export function calculateReadTime(text?: string): number {
  if (!text) return 1;
  const plainText = text.replace(/<[^>]*>/g, " ").replace(/#|\*|_|`|\[|\]|\(|\)/g, " ");
  const words = plainText.trim().split(/\s+/).filter((w) => w.length > 0).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDocToMetadata(p: IPost): PostMetadata {
  const contentToCount = p.content || p.excerpt || "";
  return {
    slug: p.slug,
    title: p.title,
    date: p.date || p.createdAt?.toISOString().split("T")[0] || "2026-08-26",
    excerpt: p.excerpt,
    banner: p.banner || "/images/welcome-journal.jpg",
    category: p.category,
    featured: p.featured || false,
    worthReading: p.worthReading || false,
    views: p.views || 0,
    published: p.published !== false,
    readTime: calculateReadTime(contentToCount),
  };
}

export async function getAllPosts(): Promise<PostMetadata[]> {
  try {
    await connectDB();
    const posts = await Post.find({ published: true }).sort({ createdAt: -1 }).lean();
    return posts.map(formatDocToMetadata as any);
  } catch (err) {
    console.error("Error fetching all posts:", err);
    return [];
  }
}

/**
 * Hero Section Algorithm:
 * Selects 3 posts from 3 distinct writing categories.
 */
export async function getHeroPosts(): Promise<PostMetadata[]> {
  try {
    await connectDB();
    const posts = await Post.find({ published: true }).sort({ createdAt: -1 }).lean();
    const categoryMap = new Map<string, IPost>();

    for (const post of posts) {
      if (!categoryMap.has(post.category)) {
        categoryMap.set(post.category, post);
      }
      if (categoryMap.size >= 3) break;
    }

    const heroPosts = Array.from(categoryMap.values());
    if (heroPosts.length < 3 && posts.length > heroPosts.length) {
      for (const p of posts) {
        if (!heroPosts.some((hp) => hp.slug === p.slug)) {
          heroPosts.push(p);
        }
        if (heroPosts.length >= 3) break;
      }
    }

    return heroPosts.map(formatDocToMetadata as any);
  } catch (err) {
    console.error("Error fetching hero posts:", err);
    return [];
  }
}

/**
 * Featured Posts Carousel Algorithm:
 * Selects posts explicitly set as featured: true by admin, or falls back to latest 3 posts.
 */
export async function getFeaturedPosts(): Promise<PostMetadata[]> {
  try {
    await connectDB();
    const featured = await Post.find({ published: true, featured: true }).sort({ createdAt: -1 }).limit(3).lean();
    if (featured && featured.length > 0) {
      return featured.map(formatDocToMetadata as any);
    }
    const latest = await Post.find({ published: true }).sort({ createdAt: -1 }).limit(3).lean();
    return latest.map(formatDocToMetadata as any);
  } catch (err) {
    console.error("Error fetching featured posts:", err);
    return [];
  }
}

/**
 * Popular Posts Algorithm:
 * Top posts sorted by view count descending.
 */
export async function getPopularPosts(limit = 4): Promise<PostMetadata[]> {
  try {
    await connectDB();
    const popular = await Post.find({ published: true }).sort({ views: -1, createdAt: -1 }).limit(limit).lean();
    return popular.map(formatDocToMetadata as any);
  } catch (err) {
    console.error("Error fetching popular posts:", err);
    return [];
  }
}

/**
 * Latest Stories Algorithm:
 * Posts sorted by recency descending.
 */
export async function getLatestPosts(limit = 6): Promise<PostMetadata[]> {
  try {
    await connectDB();
    const latest = await Post.find({ published: true }).sort({ createdAt: -1 }).limit(limit).lean();
    return latest.map(formatDocToMetadata as any);
  } catch (err) {
    console.error("Error fetching latest posts:", err);
    return [];
  }
}

/**
 * Worth Reading Posts Algorithm:
 * Posts flagged with worthReading: true or selected top recommendations.
 */
export async function getWorthReadingPosts(limit = 4): Promise<PostMetadata[]> {
  try {
    await connectDB();
    const worth = await Post.find({ published: true, worthReading: true }).sort({ createdAt: -1 }).limit(limit).lean();
    if (worth && worth.length > 0) {
      return worth.map(formatDocToMetadata as any);
    }
    const fallback = await Post.find({ published: true }).sort({ views: -1 }).limit(limit).lean();
    return fallback.map(formatDocToMetadata as any);
  } catch (err) {
    console.error("Error fetching worth reading posts:", err);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<PostData> {
  try {
    await connectDB();
    // Increment view count atomically
    const dbPost = await Post.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { returnDocument: 'after' }
    ).lean();

    if (!dbPost) {
      throw new Error(`Post with slug "${slug}" not found.`);
    }

    const processedContent = await remark().use(html).process(dbPost.content);
    const contentHtml = processedContent.toString();

    const readTime = calculateReadTime(dbPost.content || dbPost.excerpt);

    return {
      slug: dbPost.slug,
      title: dbPost.title,
      date: dbPost.date || dbPost.createdAt?.toISOString().split("T")[0] || "2026-08-26",
      excerpt: dbPost.excerpt,
      banner: dbPost.banner || "/images/welcome-journal.jpg",
      category: dbPost.category,
      featured: dbPost.featured,
      worthReading: dbPost.worthReading,
      views: dbPost.views,
      readTime,
      contentHtml,
    };
  } catch (err) {
    console.error(`Error fetching post ${slug}:`, err);
    throw err;
  }
}
