<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\PortfolioResource;
use App\Models\Portfolio;
use Illuminate\Http\JsonResponse;

/**
 * GET /api/v1/featured
 * Retourne le portfolio mis en avant (portfolio de la semaine).
 */
class FeaturedController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $portfolio = Portfolio::whereNotNull('featured_at')
            ->published()
            ->orderByDesc('featured_at')
            ->first();

        if (!$portfolio) {
            return response()->json(['portfolio' => null], 200);
        }

        return (new PortfolioResource($portfolio, owner: false))->response();
    }
}
