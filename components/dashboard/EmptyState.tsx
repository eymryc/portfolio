"use client";

import Link from "next/link";

interface EmptyStateProps {
  /** Titre court (ex. "Aucun projet") */
  title: string;
  /** Description ou conseil */
  description: string;
  /** Label du bouton d’action */
  actionLabel: string;
  /** Lien ou callback. Si string, rend un Link; si fonction, rend un button. */
  actionHref?: string;
  onAction?: () => void;
  /** Optionnel: icône (emoji ou nom) */
  icon?: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-white/20 bg-white/[0.02] p-8 text-center">
      {icon && (
        <div className="flex justify-center mb-4 text-white/30">
          {typeof icon === "string" ? (
            <span className="text-4xl" aria-hidden>{icon}</span>
          ) : (
            icon
          )}
        </div>
      )}
      <h3 className="text-lg font-semibold text-white/90 mb-1">{title}</h3>
      <p className="text-white/50 text-sm max-w-sm mx-auto mb-6">{description}</p>
      {actionHref ? (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-orange-500/20 text-orange-400 border border-orange-500/40 hover:bg-orange-500/30 transition-colors"
        >
          {actionLabel}
        </Link>
      ) : onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-orange-500/20 text-orange-400 border border-orange-500/40 hover:bg-orange-500/30 transition-colors"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
