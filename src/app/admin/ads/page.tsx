"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Megaphone,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Upload,
  CheckCircle2,
  MousePointerClick,
  Home,
  ChevronRight,
  X,
  Layout,
} from "lucide-react";
import { CustomToast, ToastMessage } from "../../../components/custom-toast";

type AdItem = {
  _id: string;
  title: string;
  description?: string;
  page: "home" | "article" | "category" | "all";
  section: "mid_article" | "sidebar" | "hero_banner" | "category_top" | "header";
  imageUrl: string;
  targetUrl: string;
  buttonText?: string;
  altText?: string;
  active: boolean;
  clicks: number;
  createdAt?: string;
};

const SECTION_META: Record<
  AdItem["section"],
  { label: string; color: string; hint: string }
> = {
  header: {
    label: "Header Top Banner",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    hint: "Sleek compact banner in the top header next to the logo (half width, desktop only).",
  },
  hero_banner: {
    label: "Hero Banner",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    hint: "Full-bleed high-impact banner shown on the home page.",
  },
  mid_article: {
    label: "Mid-Article",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    hint: "Compact banner between article paragraphs.",
  },
  category_top: {
    label: "Category / Before Keep Reading",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    hint: "Placed before the Keep Reading section and category archives.",
  },
  sidebar: {
    label: "Sidebar Widget",
    color: "bg-slate-100 text-slate-700 border-slate-200",
    hint: "Compact sidebar banner slot.",
  },
};

export default function SlothUIAdsManagerPage() {
  const [ads, setAds] = useState<AdItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [filterSection, setFilterSection] = useState<string>("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<AdItem | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [page, setPage] = useState<"home" | "article" | "category" | "all">("home");
  const [section, setSection] = useState<AdItem["section"]>("header");
  const [imageUrl, setImageUrl] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [altText, setAltText] = useState("");
  const [active, setActive] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function loadAds() {
    setLoading(true);
    fetch("/api/admin/ads")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAds(data);
      })
      .catch(() => setToast({ message: "Failed to load ads.", type: "error" }))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadAds();
  }, []);

  function openCreateModal() {
    setEditingAd(null);
    setTitle("");
    setDescription("");
    setPage("home");
    setSection("header");
    setImageUrl("/images/welcome-journal.jpg");
    setTargetUrl("https://");
    setButtonText("");
    setAltText("");
    setActive(true);
    setIsModalOpen(true);
  }

  function openEditModal(ad: AdItem) {
    setEditingAd(ad);
    setTitle(ad.title);
    setDescription(ad.description || "");
    setPage(ad.page);
    setSection(ad.section || "header");
    setImageUrl(ad.imageUrl);
    setTargetUrl(ad.targetUrl);
    setButtonText(ad.buttonText || "");
    setAltText(ad.altText || "");
    setActive(ad.active);
    setIsModalOpen(true);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        setImageUrl(data.url);
        setToast({ message: "Image uploaded successfully!", type: "success" });
      } else {
        setToast({ message: data.error || "Upload failed", type: "error" });
      }
    } catch {
      setToast({ message: "Error uploading image", type: "error" });
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!imageUrl.trim() || !targetUrl.trim()) {
      setToast({ message: "Banner Image and Destination Link (URL) are required.", type: "error" });
      return;
    }

    setIsSubmitting(true);
    const payload = {
      title: title.trim(),
      description: description.trim(),
      page,
      section,
      imageUrl: imageUrl.trim(),
      targetUrl: targetUrl.trim(),
      buttonText: buttonText.trim(),
      altText: altText.trim(),
      active,
    };

    try {
      if (editingAd) {
        const res = await fetch(`/api/admin/ads/${editingAd._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const updated = await res.json();
          setAds((prev) => prev.map((a) => (a._id === editingAd._id ? updated : a)));
          setToast({ message: "Ad placement updated successfully!", type: "success" });
          setIsModalOpen(false);
        } else {
          setToast({ message: "Failed to update ad.", type: "error" });
        }
      } else {
        const res = await fetch("/api/admin/ads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const created = await res.json();
          setAds((prev) => [created, ...prev]);
          setToast({ message: "New ad placement created!", type: "success" });
          setIsModalOpen(false);
        } else {
          const err = await res.json().catch(() => ({}));
          setToast({ message: err.error || "Failed to create ad placement.", type: "error" });
        }
      }
    } catch {
      setToast({ message: "Error saving ad placement.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function toggleActive(ad: AdItem) {
    try {
      const res = await fetch(`/api/admin/ads/${ad._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !ad.active }),
      });
      if (res.ok) {
        const updated = await res.json();
        setAds((prev) => prev.map((a) => (a._id === ad._id ? updated : a)));
        setToast({
          message: `Ad placement ${updated.active ? "enabled" : "disabled"}.`,
          type: "info",
        });
      }
    } catch {
      setToast({ message: "Failed to toggle status.", type: "error" });
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete ad placement "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/ads/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAds((prev) => prev.filter((a) => a._id !== id));
        setToast({ message: "Ad placement deleted.", type: "success" });
      } else {
        setToast({ message: "Failed to delete ad.", type: "error" });
      }
    } catch {
      setToast({ message: "Error deleting ad.", type: "error" });
    }
  }

  const activeAdsCount = ads.filter((a) => a.active).length;
  const totalClicksCount = ads.reduce((acc, a) => acc + (a.clicks || 0), 0);
  const filteredAds =
    filterSection === "all" ? ads : ads.filter((a) => a.section === filterSection);

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 bg-[#f8fafc]">
      <CustomToast toast={toast} onClose={() => setToast(null)} />

      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Link href="/admin" className="hover:text-slate-600 cursor-pointer"><Home className="h-3.5 w-3.5" /></Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-slate-700">Ads Management</span>
          </div>
          <h1 className="mt-2 font-serif text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
            Ad Placements Studio
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Manage sponsored banners, header slots, and page placement targeting.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 shadow-sm cursor-pointer"
        >
          <Plus className="h-4 w-4" /> New Ad Placement
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Slots</span>
            <Megaphone className="h-4 w-4 text-blue-500" />
          </div>
          <p className="mt-2 font-serif text-2xl sm:text-3xl font-black text-slate-950">{ads.length}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Placements</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 font-serif text-2xl sm:text-3xl font-black text-slate-950">{activeAdsCount}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tracked Clicks</span>
            <MousePointerClick className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="mt-2 font-serif text-2xl sm:text-3xl font-black text-slate-950">{totalClicksCount}</p>
        </div>
      </div>

      {/* Section Placement Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto whitespace-nowrap scrollbar-none">
        {[
          { label: "All Placement Locations", value: "all" },
          { label: "Header Banner (Half Width)", value: "header" },
          { label: "Hero Banner (Full Width)", value: "hero_banner" },
          { label: "Mid-Article", value: "mid_article" },
          { label: "Category Top / Keep Reading", value: "category_top" },
          { label: "Sidebar", value: "sidebar" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilterSection(tab.value)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              filterSection === tab.value
                ? "bg-slate-950 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Ads Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center p-12 text-xs text-slate-400">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900 mr-3" />
          Loading ad placements...
        </div>
      ) : filteredAds.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <Megaphone className="mx-auto h-10 w-10 text-slate-300" />
          <h3 className="mt-3 font-serif text-base font-bold text-slate-900">No Ad Placements in this Location</h3>
          <p className="mt-1 text-xs text-slate-500">Create an ad placement slot to display custom banners in this location.</p>
          <button
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add Placement Slot
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAds.map((ad) => {
            const meta = SECTION_META[ad.section] || SECTION_META.header;
            return (
              <div
                key={ad._id}
                className={`flex flex-col justify-between rounded-3xl border bg-white p-5 shadow-xs transition hover:shadow-md ${
                  ad.active ? "border-slate-200" : "border-slate-200 opacity-60 bg-slate-50/50"
                }`}
              >
                <div className="space-y-4">
                  {/* Banner Thumbnail */}
                  <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-100">
                    <img src={ad.imageUrl} alt={ad.title} className="h-full w-full object-cover" />
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border backdrop-blur-md ${
                          ad.active
                            ? "bg-emerald-500/90 text-white border-emerald-400"
                            : "bg-slate-950/70 text-slate-300 border-white/10"
                        }`}
                      >
                        {ad.active ? "Active" : "Disabled"}
                      </span>
                    </div>
                  </div>

                  {/* Ad Details */}
                  <div>
                    <h3 className="font-serif text-base font-bold text-slate-950 line-clamp-1">
                      {ad.title && ad.title.trim() ? (
                        ad.title
                      ) : (
                        <span className="text-slate-400 italic font-normal text-xs">Visual Banner (No Text Overlay)</span>
                      )}
                    </h3>
                    {ad.description && ad.description.trim() ? (
                      <p className="mt-1 text-xs text-slate-500 line-clamp-1">{ad.description}</p>
                    ) : null}

                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className={`rounded-md px-2 py-0.5 font-bold border ${meta.color}`}>
                        {meta.label}
                      </span>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 font-bold text-slate-700">
                        Page: {ad.page}
                      </span>
                      <span className="rounded-md bg-amber-50 px-2 py-0.5 font-bold text-amber-700 border border-amber-100">
                        {ad.clicks || 0} clicks
                      </span>
                    </div>
                  </div>

                  {/* Target URL */}
                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-500">
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="truncate font-mono text-[11px]">{ad.targetUrl}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  <button
                    onClick={() => toggleActive(ad)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                      ad.active
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {ad.active ? "Disable Slot" : "Enable Slot"}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(ad)}
                      className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                      title="Edit Ad"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(ad._id, ad.title)}
                      className="rounded-xl border border-rose-100 p-2 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Delete Ad"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative my-8 w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-950">
                  {editingAd ? "Edit Ad Placement" : "Create New Ad Placement"}
                </h3>
                <p className="text-xs text-slate-500">Configure sponsored banner, location, and destination URL.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ad Headline / Title <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Optional (leave empty if your banner image already contains text)"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-950 outline-none focus:border-slate-400 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ad Summary / Short Note (Optional)</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short caption or promo summary shown over the banner..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-950 outline-none focus:border-slate-400 focus:bg-white transition resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Page</label>
                  <select
                    value={page}
                    onChange={(e) => setPage(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-950 outline-none focus:border-slate-400 focus:bg-white transition"
                  >
                    <option value="home">Home Page (/)</option>
                    <option value="article">Articles (/posts/*)</option>
                    <option value="category">Category Pages (/categories/*)</option>
                    <option value="all">All Pages</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Placement Location</label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-950 outline-none focus:border-slate-400 focus:bg-white transition font-bold"
                  >
                    <option value="header">Header Top Banner (Half Width)</option>
                    <option value="hero_banner">Hero Banner (Full Width)</option>
                    <option value="mid_article">Mid-Article (In Between Paragraphs)</option>
                    <option value="category_top">Category / Before Keep Reading</option>
                    <option value="sidebar">Sidebar Widget</option>
                  </select>
                </div>
              </div>

              {/* Placement Explanation Note */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-[11px] text-slate-600 flex items-start gap-2">
                <Layout className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Location Note:</strong> {SECTION_META[section]?.hint}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Destination Target Link (URL)</label>
                  <input
                    type="url"
                    required
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://example.com/promo-landing-page"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-950 outline-none focus:border-slate-400 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Button Action Text <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    placeholder="Optional (e.g. Shop Now, Visit Link)"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-950 outline-none focus:border-slate-400 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ad Banner Image</label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://res.cloudinary.com/..."
                    className="flex-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-950 outline-none focus:border-slate-400 focus:bg-white transition"
                  />
                  <label className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition cursor-pointer">
                    <Upload className="h-3.5 w-3.5 text-slate-500" />
                    {isUploading ? "Uploading..." : "Upload File"}
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
                {imageUrl ? (
                  <div className="mt-3 relative h-28 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    <img src={imageUrl} alt="Banner Preview" className="h-full w-full object-cover" />
                  </div>
                ) : null}
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Active Placement Status</h4>
                  <p className="text-[10px] text-slate-500">Enable to serve this ad live in its selected placement.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActive(!active)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    active ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      active ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-slate-950 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Saving..." : editingAd ? "Update Ad Slot" : "Create Placement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
