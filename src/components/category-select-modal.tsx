"use client";

import { useRouter } from "next/navigation";
import { X, Sparkles, User, Briefcase, BookOpen, Landmark, Cpu, Building2, Rocket } from "lucide-react";

type CategorySelectModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const categories = [
  { name: "Personal", description: "Essays, field notes, and life updates", icon: User, color: "bg-blue-50 text-blue-700 border-blue-200" },
  { name: "Professional", description: "Career insights, civics, and leadership", icon: Briefcase, color: "bg-purple-50 text-purple-700 border-purple-200" },
  { name: "Philosophy", description: "Principles, ethics, and critical thought", icon: BookOpen, color: "bg-amber-50 text-amber-700 border-amber-200" },
  { name: "Nation State", description: "Public memory, citizenship, and identity", icon: Landmark, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { name: "Technology", description: "Software, AI, and African tech ecosystem", icon: Cpu, color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { name: "Streetwise", description: "City notes, public movement, and observations", icon: Building2, color: "bg-rose-50 text-rose-700 border-rose-200" },
  { name: "Sci Fi", description: "Speculative fiction and futuristic narratives", icon: Rocket, color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
];

export function CategorySelectModal({ isOpen, onClose }: CategorySelectModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  function selectCategory(categoryName: string) {
    onClose();
    router.push(`/admin/posts/new?category=${encodeURIComponent(categoryName)}`);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-slate-950">Select Category for New Story</h2>
              <p className="text-xs text-slate-500">Choose the writing lane before entering the SlothUI Editor.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => selectCategory(cat.name)}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-left transition hover:border-slate-400 hover:bg-white hover:shadow-sm group"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${cat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-slate-950">{cat.name}</h3>
                  <p className="mt-1 text-[11px] text-slate-500 leading-4">{cat.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
