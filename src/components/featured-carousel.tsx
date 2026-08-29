"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PostMetadata } from "../lib/blog";

type FeaturedCarouselProps = {
  posts: PostMetadata[];
};

export function FeaturedCarousel({ posts }: FeaturedCarouselProps) {
  const [current, setCurrent] = useState(0);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (posts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % posts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [posts.length]);

  function prev() {
    setCurrent((c) => (c - 1 + posts.length) % posts.length);
  }

  function next() {
    setCurrent((c) => (c + 1) % posts.length);
  }

  if (!posts.length) return null;

  const post = posts[current];

  return (
    <div className="group relative min-h-115 overflow-hidden bg-slate-900">
      {/* Slides — cross-fade via opacity */}
      {posts.map((p, idx) => (
        <div
          key={p.slug}
          className={`absolute inset-0 transition-opacity duration-700 ${idx === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          <Image
            src={p.banner || "/images/welcome-journal.jpg"}
            alt={p.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover opacity-80"
            priority={idx === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        </div>
      ))}

      {/* Text overlay — links to current post */}
      <Link
        href={`/posts/${post.slug}`}
        className="absolute inset-0 z-20 flex flex-col justify-end p-8 focus:outline-none"
      >
        <span className="inline-block self-start bg-[#0088CC] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
          {post.category}
        </span>
        <h2 className="mt-3 font-serif text-2xl font-black leading-tight text-white sm:text-3xl line-clamp-2">
          {post.title}
        </h2>
        <p className="mt-1.5 line-clamp-2 text-xs text-white/65 leading-5">{post.excerpt}</p>
        <p className="mt-1 text-[10px] text-white/40">{post.date}</p>
      </Link>

      {/* Prev / Next arrows */}
      {posts.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/70 cursor-pointer"
            aria-label="Previous story"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/70 cursor-pointer"
            aria-label="Next story"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {posts.length > 1 && (
        <div className="absolute bottom-4 left-8 z-30 flex items-center gap-1.5">
          {posts.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === current ? "w-6 bg-[#0088CC]" : "w-1.5 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
