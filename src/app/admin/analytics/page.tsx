"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Home,
  ChevronRight,
  Eye,
  Users,
  MousePointerClick,
  Smartphone,
  Globe,
  RefreshCw,
  TrendingUp,
  MessageSquare,
  FileText,
  Calendar,
} from "lucide-react";

type AnalyticsData = {
  range: string;
  totalViews: number;
  uniqueVisitors: number;
  topPosts: Array<{
    path: string;
    title: string;
    category: string;
    views: number;
    uniques: number;
  }>;
  topReferrers: Array<{ referrer: string; count: number }>;
  deviceBreakdown: Array<{ device: string; count: number }>;
  dailyTrend: Array<{ date: string; views: number; uniques: number }>;
  totalComments: number;
  totalSubscribers: number;
  adsSummary: Array<{
    _id?: string;
    title: string;
    page: string;
    section: string;
    clicks: number;
  }>;
};

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [range, setRange] = useState<"24h" | "7d" | "30d">("30d");
  const [loading, setLoading] = useState(true);

  function fetchAnalytics(selectedRange = range) {
    setLoading(true);
    fetch(`/api/admin/analytics?range=${selectedRange}`)
      .then((res) => res.json())
      .then((resData) => {
        if (!resData.error) {
          setData(resData);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchAnalytics(range);
  }, [range]);

  const totalDeviceCount = (data?.deviceBreakdown || []).reduce((acc, d) => acc + d.count, 0) || 1;
  const maxTrendViews = Math.max(...(data?.dailyTrend?.map((d) => d.views) || [1]), 1);

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 bg-[#f8fafc]">
      {/* Top Header & Range Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 flex-wrap">
            <Home className="h-3.5 w-3.5" />
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-600 font-semibold">Metrics</span>
            <ChevronRight className="h-3 w-3" />
            <span>Analytics</span>
          </div>
          <h1 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-950">Audience &amp; Traffic Analytics</h1>
          <p className="mt-1 text-xs text-slate-500">
            Uniquely tracked pageviews, unique visitor sessions, top stories, and conversion performance.
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
            {(["24h", "7d", "30d"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                  range === r ? "bg-slate-950 text-white" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {r === "24h" ? "Last 24 Hours" : r === "7d" ? "Last 7 Days" : "Last 30 Days"}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchAnalytics()}
            title="Refresh analytics data"
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 transition shadow-sm cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Pageviews */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Pageviews</span>
              <Eye className="h-4 w-4 text-blue-500" />
            </div>
            <p className="mt-4 font-serif text-3xl sm:text-4xl font-black text-slate-950">
              {loading ? "..." : (data?.totalViews ?? 0).toLocaleString()}
            </p>
          </div>
          <p className="mt-4 text-[10px] font-semibold text-slate-500">
            Recorded in selected {range} window
          </p>
        </div>

        {/* Unique Visitors */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Unique Readers</span>
              <Users className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="mt-4 font-serif text-3xl sm:text-4xl font-black text-emerald-600">
              {loading ? "..." : (data?.uniqueVisitors ?? 0).toLocaleString()}
            </p>
          </div>
          <p className="mt-4 text-[10px] font-semibold text-emerald-600">
            Distinct visitor sessions logged
          </p>
        </div>

        {/* Avg Views per Visitor */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pages / Reader</span>
              <TrendingUp className="h-4 w-4 text-amber-500" />
            </div>
            <p className="mt-4 font-serif text-3xl sm:text-4xl font-black text-slate-950">
              {loading
                ? "..."
                : data?.uniqueVisitors && data.totalViews
                ? (data.totalViews / data.uniqueVisitors).toFixed(1)
                : "1.0"}
            </p>
          </div>
          <p className="mt-4 text-[10px] font-semibold text-slate-500">
            Average articles read per visitor
          </p>
        </div>

        {/* Community Engagement */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Community Reach</span>
              <MessageSquare className="h-4 w-4 text-indigo-500" />
            </div>
            <p className="mt-4 font-serif text-3xl sm:text-4xl font-black text-slate-950">
              {loading ? "..." : (data?.totalSubscribers ?? 0)}
            </p>
          </div>
          <p className="mt-4 text-[10px] font-semibold text-slate-500">
            {data?.totalComments ?? 0} comments published
          </p>
        </div>
      </div>

      {/* Traffic Trend Chart */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-serif text-lg font-bold text-slate-950">Daily Traffic Activity</h2>
            <p className="text-xs text-slate-400">Total Pageviews vs Unique Readers across timeline.</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0088CC]" /> Views
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Unique Visitors
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex h-52 items-center justify-center text-slate-400 text-xs">
            <RefreshCw className="h-5 w-5 animate-spin text-slate-300 mr-2" /> Loading timeline...
          </div>
        ) : !data?.dailyTrend?.length ? (
          <div className="flex h-52 items-center justify-center text-slate-400 text-xs">
            No daily traffic data recorded in this period yet. Browse some pages to generate live analytics!
          </div>
        ) : (
          <div className="space-y-2 pt-2">
            <div className="flex h-48 items-end gap-2 sm:gap-3">
              {data.dailyTrend.map((day) => {
                const heightPercent = Math.max(10, Math.round((day.views / maxTrendViews) * 100));
                const uniquePercent = Math.max(8, Math.round((day.uniques / maxTrendViews) * 100));
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 z-20 whitespace-nowrap rounded-xl bg-slate-950 px-3 py-1.5 text-[10px] text-white shadow-lg pointer-events-none">
                      <span className="font-bold">{day.date}</span>: {day.views} views ({day.uniques} unique)
                    </div>

                    <div className="w-full flex items-end justify-center gap-1 h-full">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full max-w-[16px] rounded-t-sm bg-[#0088CC] transition-all duration-300 hover:bg-blue-600"
                      />
                      <div
                        style={{ height: `${uniquePercent}%` }}
                        className="w-full max-w-[16px] rounded-t-sm bg-emerald-400 transition-all duration-300 hover:bg-emerald-500"
                      />
                    </div>
                    <span className="mt-2 text-[9px] text-slate-400 truncate max-w-full">
                      {day.date.split("-").slice(1).join("/")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Two Column Section: Top Stories & Referrers/Devices */}
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.5fr_1fr]">
        {/* Top Stories Table */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-slate-950">Top Visited Stories &amp; Pages</h2>
              <p className="text-xs text-slate-400">Articles with the highest reader engagement.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[400px]">
              <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3">Page / Article</th>
                  <th className="px-4 py-3 text-center">Total Reads</th>
                  <th className="px-4 py-3 text-right">Unique Readers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-400">
                      Loading top stories...
                    </td>
                  </tr>
                ) : !data?.topPosts?.length ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-400">
                      No pageviews logged yet.
                    </td>
                  </tr>
                ) : (
                  data.topPosts.map((post, idx) => (
                    <tr key={post.path} className="hover:bg-slate-50/60 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-black text-slate-600">
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <Link
                              href={post.path}
                              target="_blank"
                              className="font-bold text-slate-900 hover:text-blue-600 line-clamp-1 transition"
                            >
                              {post.title}
                            </Link>
                            <span className="text-[10px] text-slate-400 font-mono block truncate">{post.path}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-bold text-slate-900">
                        {post.views.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600">
                        {post.uniques.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Breakdown: Referrers & Devices */}
        <div className="space-y-6">
          {/* Traffic Sources */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif text-base font-bold text-slate-950 flex items-center gap-2">
                <Globe className="h-4 w-4 text-slate-500" /> Top Referrers
              </h3>
            </div>
            <div className="space-y-2.5">
              {!data?.topReferrers?.length ? (
                <p className="text-xs text-slate-400 py-3 text-center">Direct &amp; bookmark traffic predominantly.</p>
              ) : (
                data.topReferrers.map((ref, idx) => (
                  <div key={`${ref.referrer}-${idx}`} className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-700 truncate max-w-[200px]" title={ref.referrer}>
                      {ref.referrer.replace(/^https?:\/\//, "").replace(/\/.*$/, "") || ref.referrer}
                    </span>
                    <span className="font-mono font-bold text-slate-900">{ref.count}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Device Distribution */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif text-base font-bold text-slate-950 flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-slate-500" /> Device Distribution
              </h3>
            </div>
            <div className="space-y-3">
              {(data?.deviceBreakdown || []).map((dev) => {
                const percent = Math.round((dev.count / totalDeviceCount) * 100) || 0;
                return (
                  <div key={dev.device} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 capitalize">{dev.device}</span>
                      <span className="font-mono text-slate-500">{percent}% ({dev.count})</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        style={{ width: `${percent}%` }}
                        className="h-full rounded-full bg-slate-950 transition-all duration-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ad Clicks Quick Summary */}
          {data?.adsSummary && data.adsSummary.length > 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-serif text-base font-bold text-slate-950 flex items-center gap-2">
                  <MousePointerClick className="h-4 w-4 text-amber-500" /> Ad Engagements
                </h3>
                <Link href="/admin/ads" className="text-xs font-bold text-blue-600 hover:underline">
                  Manage Ads →
                </Link>
              </div>
              <div className="space-y-2">
                {data.adsSummary.slice(0, 6).map((ad, idx) => (
                  <div key={ad._id || `${ad.title}-${idx}`} className="flex items-center justify-between text-xs py-1">
                    <span className="text-slate-800 font-medium truncate max-w-[200px]" title={ad.title}>
                      {ad.title}
                    </span>
                    <span className="font-mono font-bold text-amber-600">{ad.clicks || 0} clicks</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
