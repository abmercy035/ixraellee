import { SiteFrame } from "@/components/site-frame";
import { workProjects } from "@/lib/site-data";

export default function WorksPage() {
  return (
    <SiteFrame
      eyebrow="My WORKs"
      title="A portfolio system for projects, campaigns, and launches."
      description="This route is where each work gets a cover, summary, impact metrics, media, and future updates."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {workProjects.map((item, index) => (
          <article key={item} className="glass-panel rounded-[1.5rem] p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-blue-200/70">Project {index + 1}</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">{item}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Dedicated project page with gallery, story, outcomes, links, and a timeline of updates.
            </p>
          </article>
        ))}
      </div>
    </SiteFrame>
  );
}