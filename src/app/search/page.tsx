"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, Home, ChevronRight, FileText, ArrowLeft } from "lucide-react";
import type { PostMetadata } from "../../lib/blog";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("all");
  const [results, setResults] = useState<PostMetadata[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const categoryParam = category !== "all" ? category : "";
    fetch(`/api/search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(categoryParam)}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setResults(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [query, category]);

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-20">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050505]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="font-serif text-2xl font-black tracking-tight text-white">
            Ixraellee Journal
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0088CC] hover:underline transition">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>
      </header>

      {/* Main Search View */}
      <main className="mx-auto max-w-6xl px-5 py-10 space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-white">Search</span>
          </div>
          <h1 className="mt-3 font-serif text-3xl sm:text-5xl font-black tracking-tight text-white">
            Search Journal Articles
          </h1>
        </div>

        {/* Search Bar & Category Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 rounded-3xl border border-white/15 bg-[#0d121f] p-4">
          <div className="flex flex-1 items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
            <Search className="h-5 w-5 text-[#0088CC] shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type keywords to search stories..."
              className="w-full bg-transparent font-serif text-base text-white placeholder-slate-400 outline-none"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-xs font-bold text-white outline-none cursor-pointer hover:bg-white/15"
          >
            <option value="all" className="bg-slate-900 text-white">All Categories</option>
            <option value="Personal" className="bg-slate-900 text-white">Personal</option>
            <option value="Philosophy" className="bg-slate-900 text-white">Philosophy</option>
            <option value="Technology" className="bg-slate-900 text-white">Technology</option>
            <option value="Society" className="bg-slate-900 text-white">Society</option>
            <option value="Works" className="bg-slate-900 text-white">Works</option>
            <option value="Life" className="bg-slate-900 text-white">Life</option>
          </select>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 text-xs text-slate-400">
          <span>
            {query ? `Showing results for "${query}"` : "Showing latest published stories"}
          </span>
          <span className="font-bold text-white">{results.length} stories found</span>
        </div>

        {/* Grid Results */}
        {loading ? (
          <div className="flex items-center justify-center p-12 text-xs text-slate-400">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-400 border-t-[#0088CC] mr-3" />
            Loading results...
          </div>
        ) : results.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((post) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f18] transition hover:border-white/25"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={post.banner || "/images/welcome-journal.jpg"}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#4dc3ff]">
                    {post.category}
                  </span>
                  <h3 className="mt-2 font-serif text-xl font-bold leading-tight text-white group-hover:text-[#4dc3ff] transition">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs text-slate-400">{post.excerpt}</p>
                  <p className="mt-auto pt-4 text-[10px] uppercase tracking-wider text-slate-500">{post.date}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center rounded-3xl border border-white/10 bg-white/5">
            <FileText className="mx-auto h-12 w-12 text-slate-500" />
            <h3 className="mt-4 font-serif text-lg font-bold text-white">No Stories Found</h3>
            <p className="mt-1 text-xs text-slate-400">Try searching for a different keyword or reset filters.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-xs text-slate-400">Loading Search...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
