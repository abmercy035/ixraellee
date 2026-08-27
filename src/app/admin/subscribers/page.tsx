import Link from "next/link";
import { Home, ChevronRight, Send } from "lucide-react";

export default function SlothUISubscribersPage() {
  const sampleSubscribers = [
    { email: "reader@example.com", name: "Alex Johnson", status: "active", date: "2026-08-20" },
    { email: "subscriber@civictech.org", name: "David Chen", status: "active", date: "2026-08-22" },
    { email: "amara@impactafrica.io", name: "Amara Okafor", status: "active", date: "2026-08-24" },
  ];

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 bg-[#f8fafc]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 flex-wrap">
            <Home className="h-3.5 w-3.5" />
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-600 font-semibold">Audience</span>
            <ChevronRight className="h-3 w-3" />
            <span>Subscribers</span>
          </div>
          <h1 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-950">Newsletter Subscribers</h1>
          <p className="mt-1 text-xs text-slate-500">Manage active journal subscribers and audience reach.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/broadcast"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#0f172a] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 shadow-sm"
          >
            <Send className="h-4 w-4 text-white" /> Mail Broadcast Studio
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[600px]">
            <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4">Subscriber Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Subscription Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sampleSubscribers.map((sub) => (
                <tr key={sub.email} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">{sub.email}</td>
                  <td className="px-6 py-4 text-slate-600">{sub.name || "—"}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{sub.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
