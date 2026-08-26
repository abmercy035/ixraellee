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
} from "lucide-react";

const CATEGORIES = ["Personal", "Professional", "Philosophy", "Nation State", "Technology", "Streetwise", "Sci Fi"];

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

  const [content, setContent] = useState("");
  const [blockStyle, setBlockStyle] = useState<"p" | "h1" | "h2" | "h3" | "quote">("p");
  const [fontSize, setFontSize] = useState("16");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-8 py-4 backdrop-blur flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Link href="/admin" className="hover:text-slate-600 cursor-pointer"><Home className="h-3.5 w-3.5" /></Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/admin/posts" className="hover:text-slate-600 font-semibold">Stories</Link>
            <ChevronRight className="h-3 w-3" />
            <span>{isEditing ? "Edit Story" : "New Story"}</span>
          </div>

          <div className="mt-2 flex items-center gap-3">
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Untitled Story"
              className="font-serif text-2xl font-bold text-slate-950 outline-none bg-transparent hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-slate-300 rounded-lg px-2 py-0.5"
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

        <div className="flex items-center gap-3">
          <Link
            href={slug ? `/posts/${slug}` : "#"}
            target="_blank"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 shadow-sm cursor-pointer"
          >
            <Eye className="h-4 w-4 text-slate-500" /> Preview
          </Link>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <Save className="h-4 w-4" /> Save Draft
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-[#0f172a] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 shadow-md disabled:opacity-50 cursor-pointer"
          >
            <Check className="h-4 w-4 text-white" /> {isSubmitting ? "Saving..." : "Publish"}
          </button>
        </div>
      </header>

      {/* Main Workspace — fixed height, each pane scrolls independently */}
      <div className="flex flex-1" style={{ height: "calc(100vh - 5rem)" }}>
        {/* Editor Canvas */}
        <main className="flex-1 overflow-y-auto p-8 flex flex-col items-center">
          {message ? (
            <div className={`mb-6 w-full max-w-4xl rounded-2xl border p-4 text-xs font-bold ${messageType === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-rose-50 border-rose-200 text-rose-800"}`}>
              {message}
            </div>
          ) : null}

          {/* Floating Formatting Toolbar */}
          <div className="mb-6 w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Header Type */}
            <div className="flex items-center gap-2 border-r border-slate-200 pr-3">
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
            <div className="flex items-center gap-2 border-r border-slate-200 pr-3">
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="rounded-lg bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 border border-slate-200 outline-none cursor-pointer hover:bg-slate-100"
              >
                {["12","14","16","18","20","24","28","32"].map((s) => <option key={s} value={s}>{s}px</option>)}
              </select>
            </div>

            {/* Inline Format Buttons */}
            <div className="flex items-center gap-1 border-r border-slate-200 pr-3">
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
            <div className="flex items-center gap-1 border-r border-slate-200 pr-3">
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
            <div className="flex items-center gap-1 border-r border-slate-200 pr-3">
              <button title="Numbered List" onClick={() => applyFormat("\n1. ")} className="rounded-lg p-2 hover:bg-slate-100 text-slate-700 cursor-pointer transition">
                <ListOrdered className="h-3.5 w-3.5" />
              </button>
              <button title="Bullet List" onClick={() => applyFormat("\n- ")} className="rounded-lg p-2 hover:bg-slate-100 text-slate-700 cursor-pointer transition">
                <List className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Image Upload in Toolbar */}
            <div className="flex items-center gap-2">
              <label className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5 text-slate-500" /> Image
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Canvas Card */}
          <div className="w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-10 sm:p-14 shadow-sm min-h-[650px] space-y-8">
            {/* Title Input */}
            <div>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Story Title..."
                className="w-full font-serif text-3xl sm:text-5xl font-black text-slate-950 outline-none bg-transparent placeholder-slate-300 border-b border-transparent focus:border-slate-200 pb-2"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Slug: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-600">{slug || "story-slug"}</code>
              </p>
            </div>

            {/* Banner Preview */}
            {banner ? (
              <div className="relative h-[380px] sm:h-[460px] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-md">
                <img src={banner} alt="Post Banner" className="h-full w-full object-cover" />
              </div>
            ) : null}

            {/* Document Textarea */}
            <div className="space-y-4">
              <textarea
                ref={textareaRef}
                rows={18}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your story content here in Markdown..."
                style={{ fontSize: `${fontSize}px` }}
                className="w-full font-serif leading-8 text-slate-800 outline-none bg-transparent resize-y p-2 border border-transparent focus:border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </main>

        {/* Right Inspector Panel — fixed, always visible */}
        <aside className="w-80 shrink-0 border-l border-slate-200 bg-white overflow-y-auto" style={{ height: "calc(100vh - 5rem)" }}>
          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-950">Story Settings</h3>
              <p className="text-xs text-slate-400">Configure publication details and metadata.</p>
            </div>

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
              onClick={(e) => handleSubmit(e, true)}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0f172a] px-5 py-3 text-xs font-bold text-white transition hover:bg-slate-800 shadow-md disabled:opacity-50 cursor-pointer"
            >
              <Check className="h-4 w-4" /> {isSubmitting ? "Publishing..." : "Publish Story"}
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, false)}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
            >
              <Save className="h-4 w-4" /> Save as Draft
            </button>
          </div>
          </div>{/* end p-6 space-y-6 wrapper */}
        </aside>
      </div>
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
