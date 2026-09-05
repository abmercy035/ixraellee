"use client";

import { useState, FormEvent } from "react";
import { Home, ChevronRight, Copy, Check, Link as LinkIcon } from "lucide-react";

export default function SlothUIBroadcastPage() {
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [status, setStatus] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopiedTag(label);
    setTimeout(() => setCopiedTag(null), 2000);
  }

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

      <div className="max-w-4xl space-y-6">
        {/* Template Links Helper Box */}
        <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-5 text-xs text-slate-700 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sky-900 text-sm">
            <LinkIcon className="w-4 h-4 text-sky-600" />
            <span>Template links</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            A flexible way to add an unsubscribe link anywhere in your email template using the <code className="bg-sky-100 text-sky-900 px-1.5 py-0.5 rounded font-mono font-semibold">__unsubscribe_url__</code> tag.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="bg-white border border-sky-100 rounded-xl p-3 flex items-center justify-between gap-2 shadow-2xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Unsubscribe URL Macro</span>
                <code className="block text-xs font-mono font-bold text-slate-800">__unsubscribe_url__</code>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard("__unsubscribe_url__", "macro")}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
              >
                {copiedTag === "macro" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedTag === "macro" ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="bg-white border border-sky-100 rounded-xl p-3 flex items-center justify-between gap-2 shadow-2xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Unsubscribe HTML Link</span>
                <code className="block text-xs font-mono font-bold text-slate-800">&lt;a href=&quot;__unsubscribe_url__&quot;&gt;unsubscribe&lt;/a&gt;</code>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard('<a href="__unsubscribe_url__">unsubscribe</a>', "html")}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
              >
                {copiedTag === "html" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedTag === "html" ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>

        {/* Broadcast Form */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">
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
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Email Body HTML Content</label>
                <button
                  type="button"
                  onClick={() =>
                    setBodyHtml(
                      (prev) =>
                        prev +
                        (prev ? "\n" : "") +
                        '<p style="font-size: 12px; color: #94a3b8; margin-top: 24px;"><a href="__unsubscribe_url__" style="color: #0088CC;">unsubscribe</a></p>'
                    )
                  }
                  className="text-[11px] font-bold text-sky-600 hover:text-sky-700 transition cursor-pointer"
                >
                  + Append Unsubscribe Link
                </button>
              </div>
              <textarea
                required
                rows={10}
                value={bodyHtml}
                onChange={(e) => setBodyHtml(e.target.value)}
                placeholder="<h1>New Journal Entry</h1><p>Read the latest essay on Ixraellee Journal...</p><p><a href=&quot;__unsubscribe_url__&quot;&gt;unsubscribe&lt;/a&gt;</p>"
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
    </div>
  );
}
