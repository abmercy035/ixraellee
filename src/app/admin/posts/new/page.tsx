"use client";

import { useState, useRef, FormEvent, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  Check,
  ImageIcon,
  Home,
  ChevronRight,
  Upload,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ListOrdered,
  List,
  Heading,
  Star,
  BookOpen,
  Save,
  ChevronDown,
  SlidersHorizontal,
  X,
} from "lucide-react";

const CATEGORIES = [
  "Personal",
  "Streetwise coming",
  "Professional",
  "Zion's Sake",
  "Digitize Africa",
  "Not Rocket Science new",
  "Formalize Pidgin",
  "Citizens Participation Support",
  "Philosophy",
  "Society",
  "Technology",
  "Friends of Ixrael"
];

function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSlug = searchParams.get("slug");
  const initialCategory = searchParams.get("category") || "Personal";
  const isEditing = Boolean(editSlug);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [banner, setBanner] = useState("/images/welcome-journal.jpg");
  const [excerpt, setExcerpt] = useState("");
  const [author] = useState("Ixraellee");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [featured, setFeatured] = useState(false);
  const [worthReading, setWorthReading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(isEditing);
  const [showMobileSettings, setShowMobileSettings] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  function renderSimpleMarkdown(md: string) {
    if (!md) return "<p class='text-slate-500 italic'>No content written yet.</p>";
    return md
      .split("\n\n")
      .map((block) => {
        const trimmed = block.trim();
        if (trimmed.startsWith("# ")) return `<h1 class="text-3xl font-serif font-bold text-white mt-6 mb-3">${trimmed.replace(/^#\s+/, "")}</h1>`;
        if (trimmed.startsWith("## ")) return `<h2 class="text-2xl font-serif font-bold text-white mt-6 mb-3">${trimmed.replace(/^##\s+/, "")}</h2>`;
        if (trimmed.startsWith("### ")) return `<h3 class="text-xl font-serif font-bold text-white mt-4 mb-2">${trimmed.replace(/^###\s+/, "")}</h3>`;
        if (trimmed.startsWith("> ")) return `<blockquote class="border-l-4 border-blue-500 pl-4 py-2 my-4 italic text-slate-300 bg-white/5 rounded-r-lg">${trimmed.replace(/^>\s+/, "")}</blockquote>`;
        return `<p class="leading-relaxed text-slate-300 my-4">${trimmed.replace(/\n/g, "<br/>")}</p>`;
      })
      .join("");
  }

  const [content, setContent] = useState("");
  const [blockStyle, setBlockStyle] = useState<"p" | "h1" | "h2" | "h3" | "quote">("p");
  const [fontSize, setFontSize] = useState("16");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height to eliminate nested scrollbars
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(450, textareaRef.current.scrollHeight)}px`;
    }
  }, [content]);

  // Load existing post data when editing
  useEffect(() => {
    if (!editSlug) return;
    setLoadingPost(true);
    fetch(`/api/posts/${editSlug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && data.title) {
          setTitle(data.title);
          setSlug(data.slug);
          setCategory(data.category || "Personal");
          setBanner(data.banner || "/images/welcome-journal.jpg");
          setExcerpt(data.excerpt || "");
          setContent(data.content || "");
          setFeatured(data.featured || false);
          setWorthReading(data.worthReading || false);
          setIsDraft(data.published === false);
        }
      })
      .catch(() => {
        setMessage("Failed to load post data.");
        setMessageType("error");
      })
      .finally(() => setLoadingPost(false));
  }, [editSlug]);

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!isEditing) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  }

  function applyFormat(prefix: string, suffix: string = "") {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || "formatted text";
    const replacement = `${prefix}${selectedText}${suffix}`;
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  }

  function applyHeader(type: "p" | "h1" | "h2" | "h3" | "quote") {
    setBlockStyle(type);
    let prefix = "";
    if (type === "h1") prefix = "# ";
    if (type === "h2") prefix = "## ";
    if (type === "h3") prefix = "### ";
    if (type === "quote") prefix = "> ";
    if (prefix) applyFormat(prefix);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    if (banner && banner.includes("cloudinary.com")) {
      formData.append("oldUrl", banner);
    }
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        setBanner(data.url);
      } else {
        alert(data.error || "Image upload failed");
      }
    } catch {
      alert("Error uploading image to Cloudinary");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSubmit(e?: FormEvent, publishedOverride?: boolean) {
    if (e) e.preventDefault();
    if (!title.trim()) { setMessage("Title is required."); setMessageType("error"); return; }
    if (!excerpt.trim()) { setMessage("Excerpt is required."); setMessageType("error"); return; }
    if (!content.trim()) { setMessage("Content is required."); setMessageType("error"); return; }

    setIsSubmitting(true);
    setMessage("");

    const published = publishedOverride !== undefined ? publishedOverride : !isDraft;

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          category,
          banner,
          excerpt,
          content,
          published,
          featured,
          worthReading,
        }),
      });

      if (res.ok) {
        setMessage(published ? "Story published successfully!" : "Draft saved successfully!");
        setMessageType("success");
        setTimeout(() => router.push("/admin/posts"), 1000);
      } else {
        const err = await res.json();
        setMessage(err.error || "Failed to save story.");
        setMessageType("error");
      }
    } catch {
      setMessage("Error saving story.");
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loadingPost) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen bg-[#f8fafc]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col min-h-screen bg-[#f8fafc]">
      {/* Top SlothUI Action Bar Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 sm:px-8 py-3 sm:py-4 backdrop-blur flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 flex-wrap">
            <Link href="/admin" className="hover:text-slate-600 cursor-pointer"><Home className="h-3.5 w-3.5" /></Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/admin/posts" className="hover:text-slate-600 font-semibold">Stories</Link>
            <ChevronRight className="h-3 w-3" />
            <span>{isEditing ? "Edit Story" : "New Story"}</span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-3">
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Untitled Story"
              className="font-serif text-xl sm:text-2xl font-bold text-slate-950 outline-none bg-transparent hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-slate-300 rounded-lg px-2 py-0.5 max-w-full"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 border border-slate-200 outline-none cursor-pointer hover:bg-slate-200"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <span className="text-xs text-slate-400 font-medium">By {author}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setShowMobileSettings((prev) => !prev)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 shadow-sm cursor-pointer lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4 text-slate-600" /> Settings
          </button>
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 shadow-sm cursor-pointer"
          >
            <Eye className="h-4 w-4 text-slate-500" /> Preview
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <Save className="h-4 w-4" /> Save Draft
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 rounded-xl bg-[#0f172a] px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800 shadow-md disabled:opacity-50 cursor-pointer"
          >
            <Check className="h-4 w-4 text-white" /> {isSubmitting ? "Saving..." : "Publish"}
          </button>
        </div>
      </header>

      {/* Main Workspace — flex column on mobile, flex row on large screens */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0">
        {/* Editor Canvas — scrollable writing pane */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 flex flex-col items-center min-w-0">
          {message ? (
            <div className={`mb-6 w-full max-w-4xl rounded-2xl border p-4 text-xs font-bold ${messageType === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-rose-50 border-rose-200 text-rose-800"}`}>
              {message}
            </div>
          ) : null}

          {/* Horizontally Scrollable Formatting Toolbar Ribbon */}
          <div className="mb-6 w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-2 sm:p-2.5 shadow-sm flex items-center gap-2 text-xs overflow-x-auto whitespace-nowrap max-w-full scrollbar-none shrink-0">
            {/* Header Type */}
            <div className="flex items-center gap-2 border-r border-slate-200 pr-3 shrink-0">
              <div className="flex items-center gap-1">
                <Heading className="h-3.5 w-3.5 text-slate-500" />
                <select
                  value={blockStyle}
                  onChange={(e) => applyHeader(e.target.value as "p" | "h1" | "h2" | "h3" | "quote")}
                  className="rounded-lg bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 border border-slate-200 outline-none cursor-pointer hover:bg-slate-100"
                >
                  <option value="p">p</option>
                  <option value="h1">H1</option>
                  <option value="h2">H2</option>
                  <option value="h3">H3</option>
                  <option value="quote">Quote</option>
                </select>
              </div>
            </div>

            {/* Font Size */}
            <div className="flex items-center gap-2 border-r border-slate-200 pr-3 shrink-0">
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="rounded-lg bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 border border-slate-200 outline-none cursor-pointer hover:bg-slate-100"
              >
                {["12", "14", "16", "18", "20", "24", "28", "32"].map((s) => <option key={s} value={s}>{s}px</option>)}
              </select>
            </div>

            {/* Inline Format Buttons */}
            <div className="flex items-center gap-1 border-r border-slate-200 pr-3 shrink-0">
              {[
                { icon: Bold, action: () => applyFormat("**", "**"), title: "Bold" },
                { icon: Italic, action: () => applyFormat("_", "_"), title: "Italic" },
                { icon: Underline, action: () => applyFormat("<u>", "</u>"), title: "Underline" },
                { icon: Strikethrough, action: () => applyFormat("~~", "~~"), title: "Strikethrough" },
              ].map(({ icon: Icon, action, title }) => (
                <button key={title} title={title} onClick={action} className="rounded-lg p-2 hover:bg-slate-100 text-slate-700 cursor-pointer transition">
                  <Icon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>

            {/* Alignment */}
            <div className="flex items-center gap-1 border-r border-slate-200 pr-3 shrink-0">
              {[
                { icon: AlignLeft, action: () => applyFormat('\n<div align="left">\n', "\n</div>\n"), title: "Align Left" },
                { icon: AlignCenter, action: () => applyFormat('\n<div align="center">\n', "\n</div>\n"), title: "Align Center" },
                { icon: AlignRight, action: () => applyFormat('\n<div align="right">\n', "\n</div>\n"), title: "Align Right" },
              ].map(({ icon: Icon, action, title }) => (
                <button key={title} title={title} onClick={action} className="rounded-lg p-2 hover:bg-slate-100 text-slate-700 cursor-pointer transition">
                  <Icon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>

            {/* Lists */}
            <div className="flex items-center gap-1 border-r border-slate-200 pr-3 shrink-0">
              <button title="Numbered List" onClick={() => applyFormat("\n1. ")} className="rounded-lg p-2 hover:bg-slate-100 text-slate-700 cursor-pointer transition">
                <ListOrdered className="h-3.5 w-3.5" />
              </button>
              <button title="Bullet List" onClick={() => applyFormat("\n- ")} className="rounded-lg p-2 hover:bg-slate-100 text-slate-700 cursor-pointer transition">
                <List className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Image Upload in Toolbar */}
            <div className="flex items-center gap-2 shrink-0">
              <label className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5 text-slate-500" /> Image
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Writing Canvas Paper Card */}
          <div className="w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-5 sm:p-10 md:p-14 shadow-sm space-y-6 sm:space-y-8 min-w-0 box-border">
            {/* Title Input */}
            <div className="min-w-0 w-full max-w-full">
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Story Title..."
                className="w-full font-serif text-2xl sm:text-4xl md:text-5xl font-black text-slate-950 outline-none bg-transparent placeholder-slate-300 border-b border-transparent focus:border-slate-200 pb-2"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Slug: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-600 break-all">{slug || "story-slug"}</code>
              </p>
            </div>

            {/* Banner Preview */}
            {banner ? (
              <div className="relative h-[240px] sm:h-[380px] md:h-[460px] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-md">
                <img src={banner} alt="Post Banner" className="h-full w-full object-cover" />
              </div>
            ) : null}

            {/* Document Textarea */}
            <div className="space-y-4 w-full max-w-full">
              <textarea
                ref={textareaRef}
                rows={16}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your story content here in Markdown..."
                style={{ fontSize: `${fontSize}px` }}
                className="w-full font-serif leading-8 text-slate-800 outline-none bg-transparent resize-y p-3 border border-slate-200 rounded-xl focus:border-slate-400 focus:bg-white transition"
              />
            </div>
          </div>
        </main>

        {/* Mobile Settings Drawer Backdrop Overlay */}
        {showMobileSettings && (
          <div
            onClick={() => setShowMobileSettings(false)}
            className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
          />
        )}

        {/* Right Inspector Panel — bottom drawer on mobile, persistent sidebar on large screens */}
        <aside
          className={`shrink-0 border-slate-200 bg-white transition-all duration-200 ${
            showMobileSettings
              ? "fixed inset-x-0 bottom-0 z-50 max-h-[85vh] w-full overflow-y-auto rounded-t-3xl border-t p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 lg:static lg:z-auto lg:max-h-none lg:w-80 lg:rounded-none lg:shadow-none lg:border-t-0 lg:border-l lg:p-0"
              : "hidden lg:block lg:w-80 lg:border-l lg:p-0"
          }`}
        >
          {/* Mobile Drawer Header with Close Button */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6 lg:p-6 lg:border-b lg:mb-0">
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-950">Story Settings</h3>
              <p className="text-xs text-slate-400">Configure publication details and metadata.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowMobileSettings(false)}
              className="lg:hidden rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Panel Content Body */}
          <div className="space-y-6 lg:p-6 lg:pt-0">
            {/* Curation Flags */}
            <div className="space-y-3 rounded-2xl bg-slate-50 border border-slate-200 p-4">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">Curation Flags</span>
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <Star className="h-3.5 w-3.5 text-amber-500" />
                  <div>
                    <span className="text-xs font-bold text-slate-800">Featured</span>
                    <p className="text-[10px] text-slate-500">Shows in featured carousel</p>
                  </div>
                </div>
                <div
                  onClick={() => setFeatured((v) => !v)}
                  className={`relative h-6 w-11 rounded-full transition cursor-pointer ${featured ? "bg-amber-400" : "bg-slate-200"}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${featured ? "left-5" : "left-0.5"}`} />
                </div>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                  <div>
                    <span className="text-xs font-bold text-slate-800">Worth Reading</span>
                    <p className="text-[10px] text-slate-500">Appears in "Worth Reading"</p>
                  </div>
                </div>
                <div
                  onClick={() => setWorthReading((v) => !v)}
                  className={`relative h-6 w-11 rounded-full transition cursor-pointer ${worthReading ? "bg-blue-500" : "bg-slate-200"}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${worthReading ? "left-5" : "left-0.5"}`} />
                </div>
              </label>
            </div>

            {/* Metadata Settings */}
            <div className="space-y-4 border-t border-slate-100 pt-4">
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">Category</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-700 outline-none cursor-pointer hover:bg-slate-100"
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">Excerpt</span>
                <textarea
                  rows={4}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Short summary of the story..."
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700 outline-none resize-none"
                />
              </div>

              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">Banner Image</span>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={banner}
                    onChange={(e) => setBanner(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-700 outline-none"
                    placeholder="/images/..."
                  />
                  <label className="cursor-pointer rounded-xl bg-slate-900 px-3.5 py-2.5 text-[10px] font-bold text-white shrink-0 hover:bg-slate-800 flex items-center gap-1">
                    <Upload className="h-3 w-3" />
                    {isUploading ? "..." : "Upload"}
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            {/* Publish Actions */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={(e) => {
                  setShowMobileSettings(false);
                  handleSubmit(e, true);
                }}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0f172a] px-5 py-3 text-xs font-bold text-white transition hover:bg-slate-800 shadow-md disabled:opacity-50 cursor-pointer"
              >
                <Check className="h-4 w-4" /> {isSubmitting ? "Publishing..." : "Publish Story"}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  setShowMobileSettings(false);
                  handleSubmit(e, false);
                }}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
              >
                <Save className="h-4 w-4" /> Save as Draft
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Live Article Preview Modal Overlay */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 sm:p-6 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border border-white/15 bg-[#050505] text-white shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[#0b0f18] shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400">
                  <Eye className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-white">Live Article Preview</h3>
                  <p className="text-[11px] text-slate-400">Previewing "{title || "Untitled Story"}" as readers will see it on live site.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {slug && (
                  <Link
                    href={`/posts/${slug}`}
                    target="_blank"
                    className="text-xs font-semibold text-blue-400 hover:underline hidden sm:flex items-center gap-1"
                  >
                    Open Live Route →
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Article Preview Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6">
              <div>
                <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-400 border border-blue-500/30">
                  {category}
                </span>
                <h1 className="mt-4 font-serif text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
                  {title || "Untitled Story"}
                </h1>
                <p className="mt-3 text-xs sm:text-sm text-slate-400 italic leading-relaxed">
                  {excerpt || "No excerpt provided."}
                </p>
                <div className="mt-4 flex items-center gap-3 text-xs text-slate-500 border-b border-white/10 pb-6">
                  <span>By {author}</span>
                  <span>·</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>

              {banner ? (
                <div className="relative h-[220px] sm:h-[380px] w-full overflow-hidden rounded-2xl border border-white/10">
                  <img src={banner} alt={title || "Post Banner"} className="h-full w-full object-cover" />
                </div>
              ) : null}

              <div
                className="prose prose-invert max-w-none text-slate-300 font-serif leading-8 text-sm sm:text-base"
                dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(content) }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SlothUIBlockEditorPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-xs text-slate-400">Loading Editor...</div>}>
      <EditorContent />
    </Suspense>
  );
}
