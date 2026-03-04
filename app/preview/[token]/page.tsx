import { getApiUrl } from "@/lib/api";
import PortfolioRenderer from "@/components/portfolio/PortfolioRenderer";
import type { PortfolioData } from "@/types/portfolio";

interface PageProps {
  params: Promise<{ token: string }>;
}

export const dynamic = "force-dynamic";

async function getPreview(token: string): Promise<PortfolioData | null> {
  const base = getApiUrl();
  const res = await fetch(`${base}/preview/${token}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function PreviewPortfolioPage({ params }: PageProps) {
  const { token } = await params;
  const data = await getPreview(token);

  if (!data) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-orange-400">Lien expiré ou invalide</h1>
          <p className="text-white/60 mt-2">Ce lien de prévisualisation a expiré (30 min) ou n&apos;existe pas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="fixed top-4 right-4 z-10 bg-orange-500/90 text-[var(--color-bg)] px-3 py-1 rounded text-sm font-medium">
        Prévisualisation — 30 min
      </div>
      <PortfolioRenderer data={data} />
    </div>
  );
}
