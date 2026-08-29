"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CategorySelectModal } from "../../components/category-select-modal";
import { Plus, Home, ChevronRight, FileText, Send, Eye, Star, BookOpen, Users } from "lucide-react";
import type { PostMetadata } from "../../lib/blog";

type AdminStats = {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  uniqueVisitors?: number;
  subscribers: number;
  categories: number;
  featuredPosts: number;
  worthReadingPosts: number;
  totalComments?: number;
};

export default function SlothUIDashboardPage() {
  const [posts, setPosts] = useState<PostMetadata[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/posts?admin=true").then((r) => r.json()),
      fetch("/api/admin/stats").then((r) => r.json()),
    ])
      .then(([postsData, statsData]) => {
        if (Array.isArray(postsData)) setPosts(postsData);
        if (statsData && !statsData.error) setStats(statsData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const recentPosts = posts.slice(0, 5);

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 bg-[#f8fafc]">
      <CategorySelectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Top Header & Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 flex-wrap">
            <Home className="h-3.5 w-3.5" />
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-600 font-semibold">Dashboard</span>
            <ChevronRight className="h-3 w-3" />
            <span>Overview</span>
          </div>
          <h1 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-950">Ixraellee Journal Overview</h1>
          <p className="mt-1 text-xs text-slate-500">Live metrics pulled directly from your database.</p>
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

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
        </div>
      ) : (
        <>
          {/* Real Metric Cards */}
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Stories</span>
                  <FileText className="h-4 w-4 text-slate-400" />
                </div>
                <p className="mt-4 font-serif text-3xl sm:text-4xl font-black text-slate-950">{stats?.totalPosts ?? posts.length}</p>
              </div>
              <p className="mt-4 text-[10px] font-semibold text-emerald-600">
                {stats?.publishedPosts ?? 0} published · {stats?.draftPosts ?? 0} drafts
              </p>
            </div>

            <Link
              href="/admin/analytics"
              className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-blue-600 transition">
                    Total Views &amp; Readers
                  </span>
                  <Eye className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="mt-4 font-serif text-3xl sm:text-4xl font-black text-slate-950">
                  {stats?.totalViews !== undefined
                    ? stats.totalViews >= 1000
                      ? `${(stats.totalViews / 1000).toFixed(1)}k`
                      : stats.totalViews
                    : "—"}
                </p>
              </div>
              <p className="mt-4 text-[10px] font-semibold text-emerald-600 flex items-center justify-between">
                <span>{stats?.uniqueVisitors ?? 0} unique visitors</span>
                <span className="text-slate-400 group-hover:text-blue-600">View analytics →</span>
              </p>
            </Link>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Subscribers</span>
                  <Users className="h-4 w-4 text-blue-500" />
                </div>
                <p className="mt-4 font-serif text-3xl sm:text-4xl font-black text-slate-950">{stats?.subscribers ?? "—"}</p>
              </div>
              <p className="mt-4 text-[10px] font-semibold text-slate-500">Active email readers</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Categories</span>
                  <BookOpen className="h-4 w-4 text-slate-400" />
                </div>
                <p className="mt-4 font-serif text-3xl sm:text-4xl font-black text-slate-950">{stats?.categories ?? "—"}</p>
              </div>
              <p className="mt-4 text-[10px] font-semibold text-slate-500">
                {stats?.featuredPosts ?? 0} featured · {stats?.worthReadingPosts ?? 0} worth reading
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.5fr_1fr]">
            {/* Recent Articles */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-950">Recent Stories</h2>
                  <p className="text-xs text-slate-400">Latest articles from your database.</p>
                </div>
                <Link href="/admin/posts" className="text-xs font-bold text-slate-700 hover:underline">
                  View All →
                </Link>
              </div>

              <div className="mt-4 divide-y divide-slate-100">
                {recentPosts.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-sm font-bold text-slate-400">No stories yet.</p>
                    <p className="mt-1 text-xs text-slate-400">Create your first story to see it here.</p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#0f172a] px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" /> Write First Story
                    </button>
                  </div>
                ) : (
                  recentPosts.map((post) => (
                    <div key={post.slug} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200">
                          <img src={post.banner} alt={post.title} className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-slate-950 truncate">{post.title}</h3>
                          <p className="mt-0.5 text-xs text-slate-500">{post.category} · {post.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                        {post.featured && (
                          <span title="Featured">
                            <Star className="h-3.5 w-3.5 text-amber-500" />
                          </span>
                        )}
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                          Published
                        </span>
                        <Link href={`/posts/${post.slug}`} target="_blank" className="text-xs text-slate-400 hover:text-slate-700">
                          View
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Tools */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-950">Quick Tools</h2>
                <div className="space-y-2">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100 text-left cursor-pointer"
                  >
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-slate-500" /> New Story
                      </h3>
                      <p className="mt-0.5 text-[10px] text-slate-500">Select writing lane & open the editor</p>
                    </div>
                    <span className="text-xs text-slate-400">→</span>
                  </button>

                  <Link
                    href="/admin/broadcast"
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100"
                  >
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Send className="h-3.5 w-3.5 text-slate-500" /> Mail Broadcast Studio
                      </h3>
                      <p className="mt-0.5 text-[10px] text-slate-500">Dispatch newsletters to {stats?.subscribers ?? 0} subscribers</p>
                    </div>
                    <span className="text-xs text-slate-400">→</span>
                  </Link>
                </div>
              </div>

              {/* Category Breakdown */}
              {posts.length > 0 && (
                <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
                  <h2 className="font-serif text-lg font-bold text-slate-950 mb-4">By Category</h2>
                  <div className="space-y-2">
                    {Object.entries(
                      posts.reduce<Record<string, number>>((acc, p) => {
                        acc[p.category] = (acc[p.category] || 0) + 1;
                        return acc;
                      }, {})
                    )
                      .sort((a, b) => b[1] - a[1])
                      .map(([cat, count]) => (
                        <div key={cat} className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700">{cat}</span>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">{count}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
