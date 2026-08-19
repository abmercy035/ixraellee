import { SiteFrame } from "@/components/site-frame";
import { thoughtLanes } from "@/lib/site-data";

export default function ThoughtsPage() {
  return (
    <SiteFrame
      eyebrow="My Thoughts"
      title="A clean home for philosophy, nation-state writing, and technology."
      description="This section can publish essays, short notes, and longer bodies of thought with tag-based navigation."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {thoughtLanes.map((item) => (
          <article key={item} className="glass-panel rounded-[1.5rem] p-5">
            <h2 className="text-xl font-semibold text-white">{item}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Editorial stream for structured posts, linked references, and a growing archive.
            </p>
          </article>
        ))}
      </div>
    </SiteFrame>
  );
}