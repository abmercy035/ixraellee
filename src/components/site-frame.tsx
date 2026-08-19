import Link from "next/link";
import type { ReactNode } from "react";
import { navItems } from "@/lib/site-data";

type SiteFrameProps = {
  children: ReactNode;
  eyebrow?: string;
  title: string;
  description: string;
};

export function SiteFrame({ children, eyebrow, title, description }: SiteFrameProps) {
  return (
    <div className="site-grid min-h-screen bg-[#050816] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050816]/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-400/30 bg-blue-500/15 text-sm font-semibold text-blue-200 shadow-[0_0_40px_rgba(59,130,246,0.25)]">
              IX
            </span>
            <span>
              <span className="block text-sm uppercase tracking-[0.35em] text-blue-200/70">
                Ixraelle
              </span>
              <span className="block text-xs text-slate-400">Personal site and publishing system</span>
            </span>
          </Link>

          <nav className="hidden gap-1 rounded-full border border-white/10 bg-white/5 p-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="glass-panel mb-8 overflow-hidden rounded-[2rem] p-6 sm:p-10">
          {eyebrow ? (
            <p className="mb-4 text-sm uppercase tracking-[0.4em] text-blue-200/70">{eyebrow}</p>
          ) : null}
          <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">{description}</p>
        </section>
        {children}
      </main>
    </div>
  );
}