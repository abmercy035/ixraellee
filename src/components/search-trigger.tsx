"use client";

import { useState, useEffect } from "react";
import { Search, Command } from "lucide-react";
import { SearchModal } from "./search-modal";

type SearchTriggerProps = {
  variant?: "icon" | "button" | "full";
  className?: string;
};

export function SearchTrigger({ variant = "icon", className = "" }: SearchTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Global Cmd+K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <SearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {variant === "button" ? (
        <button
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer ${className}`}
        >
          <Search className="h-4 w-4 text-[#0088CC]" />
          <span>Search...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-mono text-slate-400">
            <Command className="h-2.5 w-2.5" /> K
          </kbd>
        </button>
      ) : variant === "full" ? (
        <div
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-3 rounded-2xl border border-white/15 bg-[#0a0f1b] px-4 py-3 text-slate-400 hover:border-white/30 transition cursor-pointer ${className}`}
        >
          <Search className="h-5 w-5 text-[#0088CC]" />
          <span className="text-sm font-serif text-slate-300">Search articles, topics, categories...</span>
          <span className="ml-auto rounded-lg bg-white/10 px-2 py-0.5 text-[10px] font-mono text-slate-400 hidden sm:inline">
            ⌘K
          </span>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className={`group flex items-center gap-1.5 text-slate-300 hover:text-white transition cursor-pointer ${className}`}
          aria-label="Search articles"
          title="Search articles (Ctrl+K)"
        >
          <Search className="h-5 w-5 transition group-hover:scale-110 group-hover:text-[#4dc3ff]" />
        </button>
      )}
    </>
  );
}
