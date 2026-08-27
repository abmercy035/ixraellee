"use client";

import { useRouter } from "next/navigation";
import {
  X,
  Sparkles,
  User,
  Briefcase,
  BookOpen,
  Landmark,
  Cpu,
  Building2,
  Shield,
  Globe,
  Terminal,
  Languages,
  Users2
} from "lucide-react";

type CategorySelectModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const categoryGroups = [
  {
    title: "My Life",
    items: [
      { name: "Personal", description: "Essays, field notes, and life updates", icon: User, color: "bg-blue-50 text-blue-700 border-blue-200" },
      { name: "Streetwise coming", description: "City notes, public movement, and observations", icon: Building2, color: "bg-rose-50 text-rose-700 border-rose-200" },
      { name: "Professional", description: "Career insights, civics, and leadership", icon: Briefcase, color: "bg-purple-50 text-purple-700 border-purple-200" },
    ]
  },
  {
    title: "My WORKs",
    items: [
      { name: "Zion's Sake", description: "Exploring systemic improvements, advocacy, and social projects", icon: Shield, color: "bg-amber-50 text-amber-700 border-amber-200" },
      { name: "Digitize Africa", description: "Initiatives focused on tech enablement across the continent", icon: Globe, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
      { name: "Not Rocket Science new", description: "Practical coding and engineering stories", icon: Terminal, color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
      { name: "Formalize Pidgin", description: "Linguistic preservation and formalizing local dialects", icon: Languages, color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
      { name: "Citizens Participation Support", description: "Research and tools enabling public participation", icon: Users2, color: "bg-teal-50 text-teal-700 border-teal-200" },
    ]
  },
  {
    title: "My Thoughts",
    items: [
      { name: "Philosophy", description: "Principles, ethics, and critical thought", icon: BookOpen, color: "bg-amber-50 text-amber-700 border-amber-200" },
      { name: "Society", description: "Public memory, citizenship, and identity", icon: Landmark, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
      { name: "Technology", description: "Software, AI, and African tech ecosystem", icon: Cpu, color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    ]
  },
  {
    title: "Friends of Ixrael",
    items: [
      { name: "Friends of Ixrael", description: "Curation of FIX network members and community stories", icon: User, color: "bg-blue-50 text-blue-700 border-blue-200" }
    ]
  }
];

export function CategorySelectModal({ isOpen, onClose }: CategorySelectModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  function selectCategory(categoryName: string) {
    onClose();
    router.push(`/admin/posts/new?category=${encodeURIComponent(categoryName)}`);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-950">Select Category for New Story</h2>
              <p className="text-[11px] sm:text-xs text-slate-500">Choose the writing lane before entering the SlothUI Editor.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
          {categoryGroups.map((group) => (
            <div key={group.title} className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
                {group.title}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {group.items.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => selectCategory(cat.name)}
                      className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 sm:p-4 text-left transition hover:border-slate-400 hover:bg-white hover:shadow-sm group cursor-pointer"
                    >
                      <div className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border ${cat.color}`}>
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-slate-950">{cat.name}</h4>
                        <p className="mt-1 text-[11px] text-slate-500 leading-4">{cat.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
