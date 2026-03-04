"use client";

import type { PortfolioData } from "@/types/portfolio";
import { mergeContentWithDefaults } from "@/lib/defaultPortfolioContent";
import { getTemplateComponent } from "./templateRegistry";

interface PortfolioRendererProps {
  data: PortfolioData;
  /** Pour les templates multi-pages : "index" = accueil, ou "about", "projects", etc. */
  page?: string;
}

/**
 * Affiche le portfolio avec le template choisi (templateId).
 * Le contenu est fusionné avec les valeurs par défaut (lib/defaultPortfolioContent)
 * pour que les templates affichent toujours un rendu rempli (évite les blocs vides).
 */
export default function PortfolioRenderer({ data, page }: PortfolioRendererProps) {
  const content = mergeContentWithDefaults(data.content);
  const dataWithDefaults: PortfolioData = { ...data, content };
  const Template = getTemplateComponent(data.templateId);
  return <Template data={dataWithDefaults} page={page} />;
}
