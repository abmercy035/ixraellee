"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Home,
  ChevronRight,
  Send,
  Search,
  UserPlus,
  Download,
  Copy,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw,
  X,
} from "lucide-react";
import { CustomToast } from "../../../components/custom-toast";

type SubscriberItem = {
  _id: string;
  email: string;
  name?: string;
  status: "active" | "unsubscribed";
  createdAt: string;
};

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([]);
  const [total, setTotal] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [unsubscribedCount, setUnsubscribedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "unsubscribed">("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modals & Toast
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SubscriberItem | null>(null);
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" | "info" } | null>(null);

  function loadSubscribers() {
    setLoading(true);
    const params = new URLSearchParams({
      query,
      status: statusFilter,
      page: String(page),
      limit: "30",
    });

    fetch(`/api/admin/subscribers?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.subscribers) {
          setSubscribers(data.subscribers);
          setTotal(data.total);
          setActiveCount(data.activeCount);
          setUnsubscribedCount(data.unsubscribedCount);
          setTotalPages(data.totalPages);
        }
      })
      .catch(() => setToast({ message: "Failed to load subscribers.", type: "error" }))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadSubscribers();
  }, [statusFilter, page]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadSubscribers();
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  async function handleAddSubscriber(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.includes("@")) {
      setToast({ message: "Please provide a valid email.", type: "error" });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, name: newName, status: "active" }),
      });

      if (res.ok) {
        setToast({ message: "Subscriber added successfully!", type: "success" });
        setIsAddModalOpen(false);
        setNewEmail("");
        setNewName("");
        loadSubscribers();
      } else {
        const err = await res.json();
        setToast({ message: err.error || "Failed to add subscriber", type: "error" });
      }
    } catch {
      setToast({ message: "Network error adding subscriber", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function toggleStatus(sub: SubscriberItem) {
    const nextStatus = sub.status === "active" ? "unsubscribed" : "active";
    try {
      const res = await fetch(`/api/admin/subscribers/${sub._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (res.ok) {
        setSubscribers((prev) =>
          prev.map((item) => (item._id === sub._id ? { ...item, status: nextStatus } : item))
        );
        if (nextStatus === "active") {
          setActiveCount((c) => c + 1);
          setUnsubscribedCount((c) => Math.max(0, c - 1));
        } else {
          setActiveCount((c) => Math.max(0, c - 1));
          setUnsubscribedCount((c) => c + 1);
        }
        setToast({ message: `Status changed to ${nextStatus}.`, type: "success" });
      }
    } catch {
      setToast({ message: "Failed to update status", type: "error" });
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/subscribers/${deleteTarget._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSubscribers((prev) => prev.filter((item) => item._id !== deleteTarget._id));
        setTotal((t) => Math.max(0, t - 1));
        if (deleteTarget.status === "active") setActiveCount((c) => Math.max(0, c - 1));
        else setUnsubscribedCount((c) => Math.max(0, c - 1));
        setToast({ message: "Subscriber removed.", type: "success" });
        setDeleteTarget(null);
      }
    } catch {
      setToast({ message: "Failed to delete subscriber", type: "error" });
    }
  }

  function exportCSV() {
    if (!subscribers.length) {
      setToast({ message: "No subscribers to export.", type: "info" });
      return;
    }
    const headers = ["Email", "Name", "Status", "Date Subscribed"];
    const rows = subscribers.map((s) => [
      `"${s.email}"`,
      `"${s.name || ""}"`,
      `"${s.status}"`,
      `"${new Date(s.createdAt).toISOString().split("T")[0]}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ixraellee_subscribers_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToast({ message: "CSV file downloaded!", type: "success" });
  }

  function copyAllEmails() {
    const activeEmails = subscribers
      .filter((s) => s.status === "active")
      .map((s) => s.email)
      .join(", ");

    if (!activeEmails) {
      setToast({ message: "No active subscriber emails to copy.", type: "info" });
      return;
    }

    navigator.clipboard.writeText(activeEmails);
    setToast({ message: "Copied active subscriber emails to clipboard!", type: "success" });
  }

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 bg-[#f8fafc]">
      <CustomToast toast={toast} onClose={() => setToast(null)} />

      {/* Top Header & Quick Actions */}
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
          <p className="mt-1 text-xs text-slate-500">
            Real-time subscriber audience directly connected to your MongoDB database.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition shadow-sm cursor-pointer"
          >
            <UserPlus className="h-4 w-4" /> Add Subscriber
          </button>
          <button
            onClick={copyAllEmails}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm cursor-pointer"
          >
            <Copy className="h-4 w-4 text-slate-500" /> Copy Emails
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm cursor-pointer"
          >
            <Download className="h-4 w-4 text-slate-500" /> Export CSV
          </button>
          <Link
            href="/admin/broadcast"
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition shadow-sm"
          >
            <Send className="h-4 w-4" /> Broadcast Studio
          </Link>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Subscribers</span>
          <p className="mt-2 font-serif text-3xl font-black text-slate-950">{total}</p>
          <p className="mt-1 text-[11px] text-slate-500">Lifetime signups registered</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Active Audience</span>
          <p className="mt-2 font-serif text-3xl font-black text-emerald-600">{activeCount}</p>
          <p className="mt-1 text-[11px] text-slate-500">Receiving automated & broadcast emails</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Unsubscribed</span>
          <p className="mt-2 font-serif text-3xl font-black text-slate-500">{unsubscribedCount}</p>
          <p className="mt-1 text-[11px] text-slate-500">Opted out from newsletter mailings</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email address..."
            className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-slate-400 shadow-sm"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm self-start sm:self-auto">
          {(["all", "active", "unsubscribed"] as const).map((st) => (
            <button
              key={st}
              onClick={() => { setStatusFilter(st); setPage(1); }}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold capitalize transition cursor-pointer ${
                statusFilter === st ? "bg-slate-950 text-white" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-4">Subscriber Name &amp; Email</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Subscription Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin text-slate-400" />
                      Loading subscribers...
                    </div>
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    No subscribers found matching your criteria.
                  </td>
                </tr>
              ) : (
                subscribers.map((sub) => (
                  <tr key={sub._id} className="hover:bg-slate-50/60 transition group">
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-bold text-slate-950 block">
                          {sub.name ? sub.name : <em className="text-slate-400 font-normal">No name provided</em>}
                        </span>
                        <span className="font-mono text-[11px] text-slate-500">{sub.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(sub)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold border transition cursor-pointer ${
                          sub.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                        }`}
                        title="Click to toggle status"
                      >
                        {sub.status === "active" ? (
                          <>
                            <CheckCircle className="h-3 w-3 text-emerald-600" /> Active
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 text-slate-400" /> Unsubscribed
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(sub.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setDeleteTarget(sub)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                        title="Delete subscriber"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 text-xs text-slate-500">
            <span>
              Page {page} of {totalPages} ({total} total)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-slate-200 px-3 py-1.5 font-bold disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg border border-slate-200 px-3 py-1.5 font-bold disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Add Subscriber */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-950">Add Subscriber</h3>
                <p className="text-xs text-slate-500">Manually enroll a reader in the newsletter audience.</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubscriber} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subscriber Full Name (Optional)</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-950 outline-none focus:border-slate-400 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="reader@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-950 outline-none focus:border-slate-400 focus:bg-white transition"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-slate-950 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Adding..." : "Add to Audience"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="font-serif text-lg font-bold text-slate-950">Remove Subscriber?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to remove <strong className="text-slate-900">{deleteTarget.email}</strong> from your database? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 transition cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
