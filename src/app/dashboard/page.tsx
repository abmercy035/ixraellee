import { SiteFrame } from "@/components/site-frame";
import { dashboardModules, dashboardStats } from "@/lib/site-data";

export default function DashboardPage() {
  return (
    <SiteFrame
      eyebrow="Dashboard"
      title="Control everything from one content hub."
      description="This is the admin surface for publishing, uploads, moderation, subscriber growth, and analytics."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <article key={stat.label} className="glass-panel rounded-[1.5rem] p-5">
            <p className="text-sm text-slate-400">{stat.label}</p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <h2 className="text-3xl font-semibold text-white">{stat.value}</h2>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                {stat.delta}
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="glass-panel rounded-[1.5rem] p-6">
          <p className="text-sm uppercase tracking-[0.35em] text-blue-200/70">Core modules</p>
          <div className="mt-5 grid gap-3">
            {dashboardModules.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </article>

        <article className="glass-panel rounded-[1.5rem] p-6">
          <p className="text-sm uppercase tracking-[0.35em] text-blue-200/70">Publishing flow</p>
          <ol className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
            <li>1. Create or update content with title, category, body, and cover image.</li>
            <li>2. Attach media, tag it to Life, Works, Thoughts, or Friends.</li>
            <li>3. Publish now or schedule later, then track reads and engagement.</li>
          </ol>
        </article>
      </div>
    </SiteFrame>
  );
}