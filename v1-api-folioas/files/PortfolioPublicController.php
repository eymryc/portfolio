<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\PortfolioResource;
use App\Models\Portfolio;
use Illuminate\Http\JsonResponse;

/**
 * GET /api/v1/portfolios/{slug}
 *
 * Endpoint consommé par Next.js pour le rendu SSG/ISR de /p/{slug}.
 * Retourne : templateId, templateVersion, content.
 * Headers Cache-Control configurés pour le revalidate Next.js.
 */
class PortfolioPublicController extends Controller
{
    public function __invoke(string $slug): JsonResponse
    {
        $portfolio = Portfolio::where('slug', $slug)
            ->published()
            ->firstOrFail();

        return (new PortfolioResource($portfolio, owner: false))
            ->response()
            ->withHeaders([
                // Next.js ISR : revalide toutes les 60s, sert du stale jusqu'à 5 min
                'Cache-Control' => 'public, s-maxage=60, stale-while-revalidate=300',
            ]);
    }
}
