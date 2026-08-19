import Link from "next/link";
import {
  featuredPosts,
  heroHighlights,
  navItems,
  thoughtLanes,
  workProjects,
} from "@/lib/site-data";

export default function Home() {
  return (
    <div className="space-y-8 text-white">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.30),transparent_28%),linear-gradient(135deg,rgba(5,8,22,0.95),rgba(7,14,33,0.9))] p-8 sm:p-12">
        <div className="absolute right-[-4rem] top-[-4rem] h-48 w-48 rounded-full bg-blue-500/20 blur-3xl orbit" />
        <div className="absolute bottom-[-5rem] left-[-5rem] h-56 w-56 rounded-full bg-sky-400/10 blur-3xl floaty" />

        <div className="relative grid gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-blue-200/70">Ixraelle</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
              A dynamic personal site for publishing life, work, and thought in one clear system.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Built for a strong public presence, a living portfolio, and a dashboard that can grow into a full content
              operation with uploads, reads, subscribers, comments, likes, and shares.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-blue-300/40 hover:bg-blue-500/15"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[1.75rem] p-5 shadow-2xl shadow-blue-950/40">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-sm text-slate-400">Hero system</span>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                Live
              </span>
            </div>
            <div className="mt-5 grid gap-3">
              {heroHighlights.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <div className="text-slate-400">Featured reads</div>
                <div className="mt-2 text-2xl font-semibold">03</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <div className="text-slate-400">Active sections</div>
                <div className="mt-2 text-2xl font-semibold">05</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel rounded-[1.75rem] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-blue-200/70">Samples</p>
              <h3 className="mt-2 text-2xl font-semibold">Blog previews</h3>
            </div>
          </div>
          <div className="mt-6 grid gap-4">
            {featuredPosts.map((post) => (
              <article key={post.title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-blue-200/60">{post.category}</p>
                <h4 className="mt-3 text-xl font-semibold text-white">{post.title}</h4>
                <p className="mt-3 text-sm leading-7 text-slate-300">{post.excerpt}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel rounded-[1.75rem] p-6">
            <p className="text-sm uppercase tracking-[0.35em] text-blue-200/70">My WORKs</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {workProjects.map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[1.75rem] p-6">
            <p className="text-sm uppercase tracking-[0.35em] text-blue-200/70">My Thoughts</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {thoughtLanes.map((item) => (
                <span key={item} className="rounded-full border border-blue-300/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-100">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
