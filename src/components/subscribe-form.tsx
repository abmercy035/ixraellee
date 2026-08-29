"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

type SubscribeFormProps = {
  variant?: "footer" | "card" | "inline";
  className?: string;
};

export function SubscribeForm({ variant = "footer", className = "" }: SubscribeFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Pre-fill if reader previously commented or subscribed
  useEffect(() => {
    const savedName = localStorage.getItem("commenter_name") || localStorage.getItem("subscriber_name");
    const savedEmail = localStorage.getItem("commenter_email") || localStorage.getItem("subscriber_email");
    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setStatus({ type: "error", message: "Please enter a valid email address." });
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), name: name.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: "success", message: data.message || "Thank you for subscribing!" });
        localStorage.setItem("subscriber_name", name.trim());
        localStorage.setItem("subscriber_email", email.trim());
        if (!localStorage.getItem("commenter_name") && name.trim()) {
          localStorage.setItem("commenter_name", name.trim());
        }
        if (!localStorage.getItem("commenter_email") && email.trim()) {
          localStorage.setItem("commenter_email", email.trim());
        }
      } else {
        setStatus({ type: "error", message: data.error || "Subscription failed. Please try again." });
      }
    } catch {
      setStatus({ type: "error", message: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  if (status?.type === "success") {
    return (
      <div className={`flex items-center gap-2 rounded-xl bg-emerald-950/40 border border-emerald-800/60 px-4 py-3 text-xs font-semibold text-emerald-300 ${className}`}>
        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
        <span>{status.message}</span>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row w-full max-w-xl gap-2 ${className}`}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="min-w-0 rounded-sm bg-white px-4 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 sm:w-1/3"
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="min-w-0 flex-1 rounded-sm bg-white px-4 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-sm bg-[#0088CC] px-6 py-3 text-xs font-bold text-white transition hover:bg-[#0077b3] disabled:opacity-50 cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
        >
          {submitting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Subscribing...
            </>
          ) : (
            "Subscribe"
          )}
        </button>
        {status?.type === "error" && (
          <p className="w-full text-xs text-rose-400 mt-1">{status.message}</p>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder:text-white/40 outline-none focus:border-blue-400"
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder:text-white/40 outline-none focus:border-blue-400"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-[#0088CC] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#0077b3] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
      >
        {submitting ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Subscribing...
          </>
        ) : (
          "Subscribe for Updates"
        )}
      </button>
      {status?.type === "error" && (
        <p className="text-xs text-rose-400 mt-1">{status.message}</p>
      )}
    </form>
  );
}
