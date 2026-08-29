"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Send, CheckCircle2, User } from "lucide-react";

type Comment = {
  _id: string;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: string;
};

type CommentsSectionProps = {
  postSlug: string;
};

export function CommentsSection({ postSlug }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    // Read commenter session from cookies or localStorage
    const cookies = document.cookie.split("; ");
    const sessionCookie = cookies.find((row) => row.startsWith("commenter_session="));

    if (sessionCookie) {
      try {
        const data = JSON.parse(decodeURIComponent(sessionCookie.split("=")[1]));
        if (data.name && data.email) {
          setAuthorName(data.name);
          setAuthorEmail(data.email);
          setHasSession(true);
        }
      } catch {
        // Ignore parse error
      }
    } else {
      const savedName = localStorage.getItem("commenter_name");
      const savedEmail = localStorage.getItem("commenter_email");
      if (savedName && savedEmail) {
        setAuthorName(savedName);
        setAuthorEmail(savedEmail);
        setHasSession(true);
      }
    }

    // Fetch existing comments
    fetch(`/api/posts/${postSlug}/comments`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setComments(data);
        }
      })
      .catch((err) => console.error("Error loading comments:", err))
      .finally(() => setLoading(false));
  }, [postSlug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || !authorName.trim() || !authorEmail.trim()) return;

    setSubmitting(true);
    setSuccessMsg("");

    try {
      const res = await fetch(`/api/posts/${postSlug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName,
          authorEmail,
          content,
        }),
      });

      if (res.ok) {
        const newComment = await res.json();
        setComments((prev) => [newComment, ...prev]);
        setContent("");
        setSuccessMsg("Comment posted & subscribed to updates!");
        setHasSession(true);

        // Save session locally as fallback
        localStorage.setItem("commenter_name", authorName);
        localStorage.setItem("commenter_email", authorEmail);

        setTimeout(() => setSuccessMsg(""), 4000);
      }
    } catch (err) {
      console.error("Error posting comment:", err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="border-t border-white/10 pt-10 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-sm sm:text-lg font-bold text-white flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-blue-400" />
          Responses ({comments.length})
        </h2>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="border border-white/10 bg-white/5 p-6 space-y-4">
        {hasSession ? (
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/10 pb-3">
            <span className="flex items-center gap-1.5 font-semibold text-white">
              <User className="h-4 w-4 text-blue-400" /> Commenting as <strong className="text-blue-300">{authorName}</strong> ({authorEmail})
            </span>
            <button
              type="button"
              onClick={() => setHasSession(false)}
              className="text-[11px] text-slate-500 hover:text-slate-300 underline cursor-pointer"
            >
              Change Info
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Alex Johnson"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Your Email (Registers as Subscriber)</label>
              <input
                type="email"
                required
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-400"
              />
            </div>
          </div>
        )}

        <div>
          <textarea
            required
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts on this story..."
            className="w-full 5 p-4 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-400 resize-y"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          {successMsg && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <CheckCircle2 className="h-4 w-4" /> {successMsg}
            </span>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center ml-auto gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-blue-500 disabled:opacity-50 cursor-pointer shadow-md shrink-0"
          >
            {submitting ? "Posting..." : "Post Response"} <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>

      {/* Comment List */}
      <div className="">
        {loading ? (
          <p className="text-xs text-slate-500 animate-pulse">Loading responses...</p>
        ) : comments.length === 0 ? (
          <div className="rounded-xl border border-white/5 bg-white/2 p-8 text-center text-xs text-slate-400">
            No responses yet. Be the first to share your thoughts on this story!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="rounded-sm p-2 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://i.pravatar.cc/150?u=${encodeURIComponent(comment.authorEmail || comment.authorName)}`}
                    alt={comment.authorName}
                    className="h-10 w-10 rounded-full object-cover shrink-0"
                  />
                  <p className="text-xs leading-6 text-slate-300 pt-1">{comment.content}</p>
                </div>
              </div>
                <div className="flex justify-end items-center gap-2 pt-1 border-t border-t-gray-900">
                  <p className="text-xs font-medium text-gray-300">{comment.authorName}</p>
                  <p className="text-[10px] text-slate-400 ">
                    {new Date(comment.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
