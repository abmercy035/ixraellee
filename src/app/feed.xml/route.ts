import { getAllPosts, PostMetadata } from "../../lib/blog";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ixraelle.com";
  const posts: PostMetadata[] = await getAllPosts();

  const itemsXml = posts
    .map(
      (post: PostMetadata) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/posts/${post.slug}</link>
      <guid>${baseUrl}/posts/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
      <category>${post.category}</category>
    </item>`
    )
    .join("");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ixraellee Journal</title>
    <link>${baseUrl}</link>
    <description>Stories, technology, civic innovation, and philosophy by Ixraelle.</description>
    <language>en-us</language>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
    },
  });
}
