import { mergeContentWithDefaults } from "@/lib/defaultPortfolioContent";
import PortfolioRenderer from "@/components/portfolio/PortfolioRenderer";
import type { PortfolioData } from "@/types/portfolio";

interface PageProps {
  params: Promise<{ id: string; page: string }>;
}

/**
 * Sous-pages de la prévisualisation template : /templates/[id]/about, /templates/[id]/projects, etc.
 */
export default async function TemplatePreviewSubPage({ params }: PageProps) {
  const { id, page } = await params;

  const content = mergeContentWithDefaults(undefined);
  const data: PortfolioData = {
    templateId: id,
    templateVersion: null,
    content,
    slug: "preview",
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <PortfolioRenderer data={data} page={page} />
    </div>
  );
}
