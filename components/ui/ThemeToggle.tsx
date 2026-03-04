"use client";

import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      className="relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border border-gray-300 bg-gray-200 transition-colors hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2 focus:ring-offset-white dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
      aria-label={isLight ? "Passer en mode sombre" : "Passer en mode clair"}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
          isLight ? "translate-x-1" : "translate-x-6"
        }`}
      />
    </button>
  );
}
