<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use App\Models\PortfolioView;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * POST /api/v1/portfolios/{slug}/view
 * Enregistre une vue (appelé par le client sur la page publique).
 * Body optionnel: { "referrer": "https://..." }
 */
class PortfolioViewController extends Controller
{
    public function __invoke(Request $request, string $slug): JsonResponse
    {
        $portfolio = Portfolio::where('slug', $slug)
            ->published()
            ->first();

        if ($portfolio) {
            $portfolio->increment('views_count');
            $referrer = $request->input('referrer');
            if (is_string($referrer)) {
                $referrer = strlen($referrer) > 500 ? substr($referrer, 0, 500) : $referrer;
            } else {
                $referrer = $request->header('Referer');
            }
            $portfolio->portfolioViews()->create([
                'referrer' => $referrer,
            ]);
        }

        return response()->json(null, 204);
    }
}
