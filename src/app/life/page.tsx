import { SiteFrame } from "@/components/site-frame";

const lifeTracks = [
  {
    title: "Personal",
    text: "Daily reflections, home, rhythm, and the unfiltered side of the story.",
  },
  {
    title: "Streetwise coming",
    text: "An upcoming lane for grounded writing about the city, culture, and the walk.",
  },
  {
    title: "Professional",
    text: "The work-life layer: career lessons, discipline, and public-facing growth.",
  },
];

export default function LifePage() {
  return (
    <SiteFrame
      eyebrow="My Life"
      title="A life section that feels personal, current, and organized."
      description="This area can hold essays, story notes, updates, photo diaries, and the progressive lanes you listed."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {lifeTracks.map((item) => (
          <article key={item.title} className="glass-panel rounded-[1.5rem] p-5">
            <h2 className="text-xl font-semibold text-white">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">{item.text}</p>
          </article>
        ))}
      </div>
    </SiteFrame>
  );
}