"use client";

import { useEffect } from "react";

type AlertType = "success" | "error";

interface AlertProps {
  type: AlertType;
  message: string;
  onDismiss?: () => void;
  /** Auto-dismiss after ms (default 0 = no auto) */
  autoDismissMs?: number;
}

const styles: Record<AlertType, string> = {
  success: "bg-emerald-500/15 border-emerald-400/40 text-emerald-300",
  error: "bg-red-400/10 border-red-400/30 text-red-400",
};

export default function Alert({ type, message, onDismiss, autoDismissMs = 0 }: AlertProps) {
  useEffect(() => {
    if (autoDismissMs && onDismiss) {
      const t = setTimeout(onDismiss, autoDismissMs);
      return () => clearTimeout(t);
    }
  }, [autoDismissMs, onDismiss]);

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm ${styles[type]}`}
      role={type === "error" ? "alert" : "status"}
    >
      <span>{message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
          aria-label="Fermer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
