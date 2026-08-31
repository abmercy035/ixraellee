import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllPosts } from "../../lib/blog";

export const revalidate = 0;

export const metadata = {
  title: "Categories | Ixraellee Journal",
  description: "Browse all categories on Ixraellee Journal — from personal stories to professional work, philosophy, technology, and more.",
};

export default async function CategoriesPage() {
  const allPosts = await getAllPosts();

  // Build category map: { name → { count, coverImage } }
  const categoryMap = new Map<string, { count: number; cover: string; excerpt: string }>();
  for (const post of allPosts) {
    if (!categoryMap.has(post.category)) {
      categoryMap.set(post.category, { count: 0, cover: post.banner, excerpt: post.excerpt });
    }
    categoryMap.get(post.category)!.count++;
  }

  const categories = Array.from(categoryMap.entries()).map(([name, data]) => ({
    name,
    ...data,
    slug: encodeURIComponent(name.toLowerCase()),
  }));

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/15 bg-[#050505]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5">
          <Link href="/" className="font-serif text-2xl font-black tracking-tight text-white">
            Ixraellee Journal
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-300 hover:text-blue-200 transition">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-12">
        {/* Page Header */}
        <div className="border-b border-white/15 pb-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-300">Browse by topic</p>
          <h1 className="mt-2 font-serif text-4xl font-black text-white sm:text-5xl">All Categories</h1>
          <p className="mt-3 text-sm text-white/60">{categories.length} categories · {allPosts.length} total stories</p>
        </div>

        {/* Category Grid */}
        {categories.length > 0 ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(({ name, count, cover, excerpt, slug }) => (
              <Link
                key={name}
                href={`/categories/${slug}`}
                className="group relative flex h-52 overflow-hidden bg-slate-900"
              >
                <Image
                  src={cover}
                  alt={name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-50"
                />
                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#4dc3ff]">
                    {count} {count === 1 ? "story" : "stories"}
                  </span>
                  <h2 className="font-serif text-xl font-black capitalize leading-tight text-white group-hover:text-[#4dc3ff] transition">
                    {name}
                  </h2>
                  <p className="text-[11px] text-white/50 line-clamp-1">{excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-12 text-center text-white/50">
            <p>No categories found yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}
