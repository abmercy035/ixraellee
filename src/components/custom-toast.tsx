"use client";

import { useEffect } from "react";
import { CheckCircle2, AlertCircle, X, Info } from "lucide-react";

export type ToastMessage = {
  message: string;
  type?: "success" | "error" | "info";
};

type CustomToastProps = {
  toast: ToastMessage | null;
  onClose: () => void;
  duration?: number;
};

export function CustomToast({ toast, onClose, duration = 4000 }: CustomToastProps) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [toast, onClose, duration]);

  if (!toast) return null;

  const isError = toast.type === "error";
  const isInfo = toast.type === "info";

  return (
    <div className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10 animate-in fade-in slide-in-from-top-3 duration-200 max-w-md">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
          isError
            ? "bg-rose-50 text-rose-600 border border-rose-100"
            : isInfo
            ? "bg-blue-50 text-blue-600 border border-blue-100"
            : "bg-emerald-50 text-emerald-600 border border-emerald-100"
        }`}
      >
        {isError ? (
          <AlertCircle className="h-5 w-5" />
        ) : isInfo ? (
          <Info className="h-5 w-5" />
        ) : (
          <CheckCircle2 className="h-5 w-5" />
        )}
      </div>

      <div className="flex-1 min-w-0 pr-2">
        <h4 className="text-xs font-bold text-slate-900">
          {isError ? "Notification Error" : isInfo ? "Notice" : "Success"}
        </h4>
        <p className="text-xs text-slate-600 font-medium leading-relaxed break-words mt-0.5">
          {toast.message}
        </p>
      </div>

      <button
        onClick={onClose}
        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
