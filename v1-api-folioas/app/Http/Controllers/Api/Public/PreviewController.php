<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\PortfolioResource;
use App\Models\PortfolioPreviewToken;
use Illuminate\Http\JsonResponse;

/**
 * GET /api/v1/preview/{token}
 *
 * Retourne le portfolio pour la page Next.js /preview/{token}.
 * Pas d'auth : le token de preview (valide 30 min) suffit.
 */
class PreviewController extends Controller
{
    public function __invoke(string $token): JsonResponse
    {
        $previewToken = PortfolioPreviewToken::where('token', $token)->first();

        if (! $previewToken || $previewToken->isExpired()) {
            return response()->json(['message' => 'Lien de prévisualisation invalide ou expiré.'], 404);
        }

        $portfolio = $previewToken->portfolio;

        return (new PortfolioResource($portfolio, owner: false))
            ->response()
            ->withHeaders([
                'Cache-Control' => 'private, no-store',
            ]);
    }
}
