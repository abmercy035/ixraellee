import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { getAllPosts, PostMetadata } from "../../../lib/blog";
import { AdBanner } from "../../../components/ad-banner";

export const revalidate = 0;

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;
  const decoded = decodeURIComponent(category);

  return {
    title: `${decoded} | Ixraellee Journal`,
    description: `Articles and stories filed under ${decoded}.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  const allPosts = await getAllPosts();
  const posts = allPosts.filter(
    (p: PostMetadata) => p.category.toLowerCase() === decoded.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <header className="sticky top-0 z-40 border-b border-white/15 bg-[#050505]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5">
          <Link href="/" className="font-serif text-2xl font-black tracking-tight text-white">
            Ixraellee Journal
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/categories" className="text-xs font-medium text-slate-400 hover:text-white transition">
              All Categories
            </Link>
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-300 hover:text-blue-200 transition">
              <ArrowLeft className="h-4 w-4" /> Home
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-12">
        <div className="border-b border-white/15 pb-8 space-y-3">
          <nav className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
            <Link href="/categories" className="hover:text-white transition">Categories</Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
            <span className="text-blue-400 font-semibold capitalize">{decoded}</span>
          </nav>
          <h1 className="font-serif text-4xl font-black capitalize text-white sm:text-5xl">{decoded}</h1>
          <p className="text-sm text-white/60">{posts.length} {posts.length === 1 ? "story" : "stories"} published</p>
        </div>

        <AdBanner page="category" section="category_top" />

        {posts.length > 0 ? (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: PostMetadata) => (
              <Link key={post.slug} href={`/posts/${post.slug}`} className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f18] transition hover:border-white/25">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image src={post.banner} alt={post.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">{post.category}</span>
                  <h2 className="mt-2 font-serif text-xl font-bold leading-tight text-white group-hover:text-blue-200">{post.title}</h2>
                  <p className="mt-2 line-clamp-2 text-xs text-white/60">{post.excerpt}</p>
                  <p className="mt-auto pt-4 text-[10px] uppercase tracking-wider text-white/40">{post.date}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-12 text-center text-white/50">
            <p>No stories published under &quot;{decoded}&quot; yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}
