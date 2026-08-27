import type { MetadataRoute } from "next";
import { getAllPosts, PostMetadata } from "../lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ixraelle.com";
  const posts: PostMetadata[] = await getAllPosts();

  const postUrls = posts.map((post: PostMetadata) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const staticUrls = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/life`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/works`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/thoughts`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/friends`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
  ];

  return [...staticUrls, ...postUrls];
}
