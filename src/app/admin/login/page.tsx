"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleLogin(e: FormEvent) {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      document.cookie = "admin_auth=true; path=/";
      router.push("/admin");
    } else {
      setError("Invalid username or password");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] px-4 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/15 bg-[#0b0f18] p-8 shadow-2xl">
        <div className="text-center">
          <Link href="/" className="font-serif text-3xl font-black text-white">
            Ixraelle
          </Link>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.3em] text-blue-300">CMS Admin Console</p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          {error ? (
            <div className="rounded-lg bg-red-950/80 border border-red-800 p-3 text-xs text-red-200 text-center">
              {error}
            </div>
          ) : null}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/70" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/15 bg-[#050811] px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              placeholder="admin"
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
              className="mt-2 w-full rounded-xl border border-white/15 bg-[#050811] px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
          >
            Sign In to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
