"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CategorySelectModal } from "../../../components/category-select-modal";
import { CustomToast, ToastMessage } from "../../../components/custom-toast";
import { Plus, Home, ChevronRight, Star, Eye, Trash2 } from "lucide-react";
import type { PostMetadata } from "../../../lib/blog";

type FilterStatus = "all" | "published" | "drafts";

type AdminPost = PostMetadata & { published?: boolean };

export default function SlothUIPostsManagerPage() {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [toast, setToast] = useState<ToastMessage | null>(null);

  function loadPosts() {
    setLoading(true);
    fetch("/api/posts?admin=true")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPosts(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadPosts(); }, []);

  async function handleDelete(slug: string) {
    if (!confirm(`Delete "${slug}"? This cannot be undone.`)) return;
    setDeletingSlug(slug);
    try {
      const res = await fetch(`/api/posts/${slug}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.slug !== slug));
        setToast({ message: "Story deleted successfully.", type: "success" });
      } else {
        setToast({ message: "Failed to delete post.", type: "error" });
      }
    } catch {
      setToast({ message: "Error deleting post.", type: "error" });
    } finally {
      setDeletingSlug(null);
    }
  }

  const published = posts.filter((p) => p.published !== false);
  const drafts = posts.filter((p) => p.published === false);
  const filtered = filter === "published" ? published : filter === "drafts" ? drafts : posts;

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 bg-[#f8fafc]">
      <CustomToast toast={toast} onClose={() => setToast(null)} />
      <CategorySelectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Top Action Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 flex-wrap">
            <Home className="h-3.5 w-3.5" />
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-600 font-semibold">Articles</span>
            <ChevronRight className="h-3 w-3" />
            <span>All Stories</span>
          </div>
          <h1 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-950">Story Manager</h1>
          <p className="mt-1 text-xs text-slate-500">{posts.length} total stories in your database.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#0f172a] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4 text-white" /> Create New Story
          </button>
        </div>
      </div>

      {/* Table Panel */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-100 p-4 overflow-x-auto whitespace-nowrap scrollbar-none">
          {([
            { key: "all", label: "All", count: posts.length },
            { key: "published", label: "Published", count: published.length },
            { key: "drafts", label: "Drafts", count: drafts.length },
          ] as { key: FilterStatus; label: string; count: number }[]).map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition cursor-pointer shrink-0 ${
                filter === key
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm font-bold text-slate-400">
              {filter === "drafts" ? "No drafts saved." : filter === "published" ? "No published stories yet." : "No stories yet."}
            </p>
            {filter === "all" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0f172a] px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Write First Story
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[640px]">
              <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-4">Story & Thumbnail</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Views</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((post) => (
                  <tr key={post.slug} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                          <img src={post.banner} alt={post.title} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-serif text-sm font-bold text-slate-950 line-clamp-1">{post.title}</h3>
                            {post.featured && <Star className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                          </div>
                          <p className="mt-0.5 text-[10px] text-slate-400 line-clamp-1 max-w-xs">{post.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-700 border border-slate-200">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-slate-500">
                        <Eye className="h-3 w-3" />
                        <span>{post.views ?? 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{post.date}</td>
                    <td className="px-6 py-4">
                      {post.published !== false ? (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                          Published
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700 border border-amber-200">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link href={`/posts/${post.slug}`} target="_blank" className="font-semibold text-slate-500 hover:text-slate-900">
                          View
                        </Link>
                        <Link href={`/admin/posts/new?slug=${post.slug}`} className="font-semibold text-blue-600 hover:text-blue-800">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(post.slug)}
                          disabled={deletingSlug === post.slug}
                          className="font-semibold text-rose-500 hover:text-rose-700 disabled:opacity-40 cursor-pointer"
                          title="Delete post"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
