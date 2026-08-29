"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Lock, ShieldAlert } from "lucide-react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Invalid username or password");
      }
    } catch {
      setError("Network error connecting to authentication service.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] px-4 py-8 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/15 bg-[#0b0f18] p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center">
          <Link href="/" className="font-serif text-3xl font-black text-white hover:opacity-90 transition">
            Ixraellee
          </Link>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.3em] text-blue-300">CMS Admin Console</p>
        </div>

        {error ? (
          <div className="flex items-center gap-2.5 rounded-xl bg-rose-950/80 border border-rose-800 p-3.5 text-xs text-rose-200">
            <ShieldAlert className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        ) : null}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/70" htmlFor="username">
              Username or Email
            </label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/15 bg-[#050811] px-4 py-3 text-sm text-white outline-none focus:border-blue-500 placeholder:text-white/30 transition"
              placeholder="admin or your email"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/70" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/15 bg-[#050811] px-4 py-3 text-sm text-white outline-none focus:border-blue-500 placeholder:text-white/30 transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-blue-500 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Authenticating...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" /> Sign In to Dashboard
              </>
            )}
          </button>
        </form>

        <div className="border-t border-white/10 pt-4 text-center">
          <Link href="/" className="text-xs text-white/50 hover:text-white transition">
            ← Return to Ixraellee Journal
          </Link>
        </div>
      </div>
    </div>
  );
}
