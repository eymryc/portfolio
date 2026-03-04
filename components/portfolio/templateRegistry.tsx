"use client";

import type { PortfolioData } from "@/types/portfolio";
import PortfolioView from "./PortfolioView";
import Classic from "./templates/Classic";
import Air from "./templates/Air";

export interface TemplateProps {
  data: PortfolioData;
  /** Pour templates multi-pages : "index" (accueil) ou "about", "projects", etc. Single-page templates ignorent. */
  page?: string;
}

const registry: Record<string, React.ComponentType<TemplateProps>> = {
  v1: PortfolioView,
  classic: Classic,
  air: Air,
};

/**
 * Retourne le composant de vue du portfolio selon templateId (API).
 */
export function getTemplateComponent(templateId?: string | null): React.ComponentType<TemplateProps> {
  if (templateId && templateId in registry) {
    return registry[templateId];
  }
  return PortfolioView;
}
