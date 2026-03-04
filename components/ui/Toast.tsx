"use client";

import { createContext, useCallback, useContext, useState } from "react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now();
    setItems((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }, 4000);
  }, []);

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm pointer-events-none">
        <div className="pointer-events-auto flex flex-col gap-2">
          {items.map((item) => (
            <div
              key={item.id}
              role="status"
              className={`rounded-lg border px-4 py-3 text-sm shadow-lg ${
                item.type === "success"
                  ? "bg-emerald-500/95 text-white border-emerald-400/50"
                  : item.type === "error"
                    ? "bg-red-500/95 text-white border-red-400/50"
                    : "bg-white/95 text-[var(--color-bg)] border-white/30"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span>{item.message}</span>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  className="shrink-0 p-1 rounded opacity-80 hover:opacity-100"
                  aria-label="Fermer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) return { toast: () => {} };
  return ctx;
}
