import { mergeContentWithDefaults } from "@/lib/defaultPortfolioContent";
import PortfolioRenderer from "@/components/portfolio/PortfolioRenderer";
import type { PortfolioData } from "@/types/portfolio";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

/**
 * Prévisualisation d'un template avec le contenu par défaut.
 * Utilisé par : iframe sur la page d'accueil, lien "Aperçu" dans le dashboard.
 */
export default async function TemplatePreviewPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { page } = await searchParams;

  const content = mergeContentWithDefaults(undefined);
  const data: PortfolioData = {
    templateId: id,
    templateVersion: null,
    content,
    slug: "preview",
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <PortfolioRenderer data={data} page={page ?? "index"} />
    </div>
  );
}
