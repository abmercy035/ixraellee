"use client";

import { useState, FormEvent } from "react";
import { Home, ChevronRight, Send } from "lucide-react";

export default function SlothUIBroadcastPage() {
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [status, setStatus] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    setIsSending(true);
    setStatus("");

    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, html: bodyHtml }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus(data.message || "Broadcast initiated successfully!");
      } else {
        setStatus(data.error || "Failed to send broadcast.");
      }
    } catch {
      setStatus("Error sending broadcast.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 bg-[#f8fafc]">
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 flex-wrap">
          <Home className="h-3.5 w-3.5" />
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-600 font-semibold">Audience</span>
          <ChevronRight className="h-3 w-3" />
          <span>Mail Broadcast</span>
        </div>
        <h1 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-950">Mail Broadcast Studio</h1>
        <p className="mt-1 text-xs text-slate-500">Draft and dispatch newsletter updates to all active journal subscribers.</p>
      </div>

      <div className="max-w-4xl rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">
        <form onSubmit={handleSend} className="space-y-6">
          {status ? (
            <div className="rounded-2xl bg-blue-50 border border-blue-200 p-4 text-xs font-bold text-blue-800">
              {status}
            </div>
          ) : null}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Email Subject Line</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. New Story: Society and Public Memory"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Email Body HTML Content</label>
            <textarea
              required
              rows={10}
              value={bodyHtml}
              onChange={(e) => setBodyHtml(e.target.value)}
              placeholder="<h1>New Journal Entry</h1><p>Read the latest essay on Ixraellee Journal...</p>"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-mono text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 pt-6">
            <p className="text-xs text-slate-400">Dispatches via pluggable email service endpoint.</p>
            <button
              type="submit"
              disabled={isSending}
              className="w-full sm:w-auto rounded-xl bg-[#0f172a] px-6 py-3 text-xs font-bold text-white transition hover:bg-slate-800 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isSending ? "Dispatching..." : "Send Broadcast"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
