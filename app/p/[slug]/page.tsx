import { getApiUrl } from "@/lib/api";
import PortfolioRenderer from "@/components/portfolio/PortfolioRenderer";
import RecordView from "@/components/portfolio/RecordView";
import PrintTrigger from "@/components/portfolio/PrintTrigger";
import type { PortfolioData } from "@/types/portfolio";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;
export const dynamic = "force-dynamic";

async function getPortfolio(slug: string): Promise<PortfolioData | null> {
  const base = getApiUrl();
  const res = await fetch(`${base}/portfolios/${slug}`, {
    next: { revalidate: 60 },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return null;
  return res.json() as Promise<PortfolioData>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const data = await getPortfolio(slug);
  if (!data) return { title: "Portfolio" };
  const seo = data.content?.seo;
  const profile = data.content?.profile;
  return {
    title: seo?.title?.trim() || profile?.name?.trim() || "Portfolio",
    description: seo?.description?.trim() || profile?.bio?.trim() || undefined,
  };
}

export default async function PublicPortfolioPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getPortfolio(slug);

  if (!data) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400">Portfolio introuvable</h1>
          <p className="text-white/60 mt-2">Ce portfolio n&apos;existe pas ou n&apos;est pas publié.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PrintTrigger />
      <RecordView slug={slug} />
      <PortfolioRenderer data={data} />
    </>
  );
}
