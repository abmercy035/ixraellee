import { SiteFrame } from "@/components/site-frame";

export default function FriendsPage() {
  return (
    <SiteFrame
      eyebrow="Friends of Ixrael"
      title="A trusted circle, collaborators, and featured voices."
      description="This can hold links, profiles, collaborations, introductions, and a fixed list of important friends."
    >
      <div className="glass-panel rounded-[1.5rem] p-6">
        <p className="text-sm leading-7 text-slate-300">
          FIX can become a curated panel of people, partners, and recurring contributors with notes, links, and recent
          appearances.
        </p>
      </div>
    </SiteFrame>
  );
}