import { Folder, UserRound } from "lucide-react";

type PostCardMetaProps = {
  category: string;
};

export function PostCardMeta({ category }: PostCardMetaProps) {
  return (
    <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-200 pt-3 text-xs text-slate-500">
      <span className="inline-flex items-center gap-1.5">
        <UserRound size={14} strokeWidth={1.7} aria-hidden="true" />
        By Ixrael Lee
      </span>
      <span className="inline-flex items-center gap-1.5 text-blue-700">
        <Folder size={14} strokeWidth={1.7} aria-hidden="true" />
        {category}
      </span>
    </div>
  );
}
