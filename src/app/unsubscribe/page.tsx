"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, ArrowLeft, MailX, RefreshCw, Sparkles } from "lucide-react";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [status, setStatus] = useState<"idle" | "unsubscribed" | "subscribed" | "error">("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
      // Auto-trigger unsubscribe when arriving with email parameter
      handleAction(emailParam, "unsubscribe");
    }
  }, [emailParam]);

  async function handleAction(targetEmail: string, action: "unsubscribe" | "resubscribe") {
    if (!targetEmail || !targetEmail.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, action }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus(action === "unsubscribe" ? "unsubscribed" : "subscribed");
        setMessage(data.message);
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to update subscription.");
      }
    } catch {
      setStatus("error");
      setMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-sky-950/20 via-transparent to-transparent pointer-events-none" />

      <main className="relative z-10 w-full max-w-md bg-[#0b0f18] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-xl">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 mb-2">
            {status === "unsubscribed" ? (
              <MailX className="w-7 h-7" />
            ) : status === "subscribed" ? (
              <Sparkles className="w-7 h-7" />
            ) : (
              <MailX className="w-7 h-7" />
            )}
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-white font-serif">
            Ixraellee Journal
          </h1>

          <p className="text-sm text-slate-400 leading-relaxed">
            {status === "unsubscribed"
              ? "You have been unsubscribed from receiving future email updates."
              : status === "subscribed"
              ? "Your subscription has been reactivated! Welcome back."
              : "Manage your newsletter subscription settings below."}
          </p>

          {message ? (
            <div
              className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 border ${
                status === "unsubscribed"
                  ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
                  : status === "subscribed"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/20 text-rose-300"
              }`}
            >
              {status === "unsubscribed" && <CheckCircle2 className="w-4 h-4 shrink-0" />}
              {status === "subscribed" && <CheckCircle2 className="w-4 h-4 shrink-0" />}
              {status === "error" && <XCircle className="w-4 h-4 shrink-0" />}
              <span>{message}</span>
            </div>
          ) : null}

          {/* Form / Manual controls if no email in URL or user wants to resubscribe */}
          <div className="pt-4 space-y-4">
            {!emailParam && (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:border-sky-500/50 transition"
              />
            )}

            {status === "unsubscribed" ? (
              <button
                onClick={() => handleAction(email, "resubscribe")}
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  "Resubscribe to Journal"
                )}
              </button>
            ) : status === "subscribed" ? (
              <button
                onClick={() => handleAction(email, "unsubscribe")}
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-white/10 hover:bg-white/15 text-slate-300 font-semibold text-sm rounded-xl transition border border-white/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  "Unsubscribe Again"
                )}
              </button>
            ) : (
              <button
                onClick={() => handleAction(email, "unsubscribe")}
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  "Confirm Unsubscribe"
                )}
              </button>
            )}

            <div className="pt-2 border-t border-white/5">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Return to Ixraellee Journal
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050505] text-slate-100 flex items-center justify-center">
          <RefreshCw className="w-6 h-6 animate-spin text-sky-400" />
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
