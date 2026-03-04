<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Portfolio\StoreFeedbackRequest;
use App\Models\Portfolio;
use Illuminate\Http\JsonResponse;

/**
 * POST /api/v1/portfolios/{slug}/feedback
 * Laisse un avis (note + message) sur un portfolio public.
 */
class PortfolioFeedbackController extends Controller
{
    public function __invoke(StoreFeedbackRequest $request, string $slug): JsonResponse
    {
        $portfolio = Portfolio::where('slug', $slug)->published()->first();

        if (!$portfolio) {
            return response()->json(['message' => 'Portfolio non trouvé.'], 404);
        }

        $portfolio->feedbacks()->create($request->only('rating', 'message', 'author_email'));

        return response()->json(['message' => 'Merci pour votre avis !'], 201);
    }
}
