"use client";

interface SpinnerProps {
  className?: string;
  size?: "sm" | "md";
}

export default function Spinner({ className = "", size = "md" }: SpinnerProps) {
  const sizeClass = size === "sm" ? "w-4 h-4 border-2" : "w-5 h-5 border-2";
  return (
    <span
      className={`inline-block animate-spin rounded-full border-white/30 border-t-current ${sizeClass} ${className}`}
      aria-hidden
    />
  );
}
