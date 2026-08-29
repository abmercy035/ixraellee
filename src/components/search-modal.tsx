"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ArrowRight, Sparkles, Command, FileText } from "lucide-react";
import type { PostMetadata } from "../lib/blog";

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CATEGORY_TAGS = ["All", "Personal", "Philosophy", "Technology", "Society", "Works", "Life"];
const SUGGESTED_QUERIES = ["Africa", "Personal", "Technology", "Journal", "Society", "Code"];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [results, setResults] = useState<PostMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Auto-focus search input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Debounced search query fetching
  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    const timer = setTimeout(() => {
      const categoryParam = selectedCategory !== "All" ? selectedCategory : "";
      fetch(`/api/search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(categoryParam)}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setResults(data);
            setSelectedIndex(0);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 200);

    return () => clearTimeout(timer);
  }, [query, selectedCategory, isOpen]);

  // Keyboard Navigation (ArrowUp, ArrowDown, Enter, Esc)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        const targetSlug = results[selectedIndex].slug;
        onClose();
        router.push(`/posts/${targetSlug}`);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose, router]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/80 p-4 sm:p-6 md:p-10 backdrop-blur-md animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-3xl border border-white/15 bg-[#080b12] text-white shadow-2xl overflow-hidden mt-6 sm:mt-12"
      >
        {/* Search Input Top Header Bar */}
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4 bg-[#0d121f]">
          <Search className="h-5 w-5 text-[#0088CC] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stories, topics, categories..."
            className="flex-1 bg-transparent font-serif text-lg text-white placeholder-slate-400 outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="text-xs text-slate-400 hover:text-white transition cursor-pointer"
            >
              Clear
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-white/10 px-2 py-0.5 text-[10px] font-mono text-slate-300">
              <Command className="h-3 w-3" /> K
            </kbd>
          )}
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3 overflow-x-auto whitespace-nowrap scrollbar-none bg-[#0a0f1b]">
          {CATEGORY_TAGS.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-bold transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#0088CC] text-white shadow-md"
                  : "bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center p-8 text-xs text-slate-400">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-400 border-t-[#0088CC] mr-3" />
              Searching stories...
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-2 pb-2 text-[11px] text-slate-400">
                <span>FOUND {results.length} {results.length === 1 ? "RESULT" : "RESULTS"}</span>
                <span>Use ↑ ↓ keys to navigate</span>
              </div>
              {results.map((post, idx) => (
                <Link
                  key={post.slug}
                  href={`/posts/${post.slug}`}
                  onClick={onClose}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between rounded-2xl border p-3.5 transition cursor-pointer ${
                    idx === selectedIndex
                      ? "border-[#0088CC]/60 bg-[#0088CC]/15 shadow-md"
                      : "border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-4">
                    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-800 border border-white/10">
                      <Image
                        src={post.banner || "/images/welcome-journal.jpg"}
                        alt={post.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="rounded-md bg-[#0088CC]/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#4dc3ff]">
                        {post.category}
                      </span>
                      <h4 className="mt-1 font-serif text-sm font-bold text-white truncate">{post.title}</h4>
                      <p className="mt-0.5 text-xs text-slate-400 truncate">{post.excerpt}</p>
                    </div>
                  </div>

                  <ArrowRight className={`h-4 w-4 shrink-0 transition ${idx === selectedIndex ? "text-[#0088CC] translate-x-1" : "text-slate-600"}`} />
                </Link>
              ))}
            </div>
          ) : query ? (
            <div className="p-12 text-center">
              <FileText className="mx-auto h-10 w-10 text-slate-500" />
              <h3 className="mt-3 font-serif text-base font-bold text-white">No Stories Found</h3>
              <p className="mt-1 text-xs text-slate-400">No published articles matched "{query}". Try another search term or category.</p>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3">
                  <Sparkles className="h-3.5 w-3.5 text-[#0088CC]" /> Popular Topics
                </h4>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUERIES.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="border-t border-white/10 px-5 py-3 bg-[#0d121f] text-[11px] text-slate-400 flex items-center justify-between">
          <span>Press <kbd className="rounded bg-white/10 px-1 py-0.5 text-[10px] text-white">ESC</kbd> to exit</span>
          <Link
            href={query ? `/search?q=${encodeURIComponent(query)}` : "/search"}
            onClick={onClose}
            className="text-[#0088CC] font-bold hover:underline"
          >
            Open Full Search Page →
          </Link>
        </div>
      </div>
    </div>
  );
}
