<?php

namespace App\Http\Controllers\Api\Me;

use App\Http\Controllers\Controller;
use App\Http\Requests\Portfolio\StorePortfolioRequest;
use App\Models\FeaturedRequest as FeaturedRequestModel;
use App\Http\Requests\Portfolio\UpdateTemplateRequest;
use App\Http\Requests\Portfolio\UpdateVisibilityRequest;
use App\Http\Resources\PortfolioResource;
use App\Services\PortfolioService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PortfolioController extends Controller
{
    public function __construct(
        private readonly PortfolioService $portfolioService
    ) {}

    /**
     * GET /api/v1/me/portfolio
     * Charge le portfolio complet pour le dashboard Next.js.
     */
    public function show(Request $request): JsonResponse
    {
        $portfolio = $request->user()->portfolio()->firstOrFail();

        return (new PortfolioResource($portfolio, owner: true))->response();
    }

    /**
     * POST /api/v1/me/portfolio
     * Crée le portfolio lors de l'onboarding.
     * Un seul portfolio par utilisateur (user_id unique en DB).
     */
    public function store(StorePortfolioRequest $request): JsonResponse
    {
        if ($request->user()->hasPortfolio()) {
            return response()->json(['message' => 'Vous avez déjà un portfolio.'], 409);
        }

        $portfolio = $this->portfolioService->create($request->user(), $request->validated());

        return (new PortfolioResource($portfolio, owner: true))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * PATCH /api/v1/me/portfolio/template
     * Change le template sans toucher au contenu.
     * Appelé quand l'utilisateur sélectionne un autre design dans le dashboard.
     */
    public function updateTemplate(UpdateTemplateRequest $request): JsonResponse
    {
        $portfolio = $request->user()->portfolio()->firstOrFail();

        $portfolio->update([
            'template_id'      => $request->template_id,
            'template_version' => $request->template_version,
        ]);

        return (new PortfolioResource($portfolio->fresh(), owner: true))->response();
    }

    /**
     * PATCH /api/v1/me/portfolio/visibility
     * Publie ou dépublie le portfolio.
     * Appelé via le bouton "Publier" / "Dépublier" du dashboard.
     * Retourne l'URL publique si publié.
     */
    public function updateVisibility(UpdateVisibilityRequest $request): JsonResponse
    {
        $portfolio = $request->user()->portfolio()->firstOrFail();

        $portfolio->update(['is_public' => $request->boolean('is_public')]);

        return response()->json([
            'isPublic'  => $portfolio->is_public,
            'slug'      => $portfolio->slug,
            'publicUrl' => $portfolio->is_public
                ? rtrim(config('app.frontend_url'), '/') . '/p/' . $portfolio->slug
                : null,
        ]);
    }

    /**
     * DELETE /api/v1/me/portfolio
     */
    public function destroy(Request $request): JsonResponse
    {
        $request->user()->portfolio()->firstOrFail()->delete();

        return response()->json(null, 204);
    }

    /**
     * POST /api/v1/me/portfolio/preview
     * Génère un lien de preview privé (30 min).
     * Permet à l'utilisateur de voir le rendu final avant de publier.
     */
    public function preview(Request $request): JsonResponse
    {
        $portfolio = $request->user()->portfolio()->firstOrFail();
        $token     = $this->portfolioService->generatePreviewToken($portfolio);

        return response()->json([
            'previewUrl' => rtrim(config('app.frontend_url'), '/') . '/preview/' . $token->token,
            'expiresAt'  => $token->expires_at->toISOString(),
        ]);
    }

    /**
     * GET /api/v1/me/portfolio/stats
     * Statistiques de vues (total + par période).
     */
    public function stats(Request $request): JsonResponse
    {
        $portfolio = $request->user()->portfolio()->firstOrFail();

        $viewsTotal = $portfolio->views_count;
        $viewsLast7Days = $portfolio->portfolioViews()
            ->where('viewed_at', '>=', now()->subDays(7))
            ->count();
        $viewsLast30Days = $portfolio->portfolioViews()
            ->where('viewed_at', '>=', now()->subDays(30))
            ->count();

        return response()->json([
            'viewsTotal'     => $viewsTotal,
            'viewsLast7Days' => $viewsLast7Days,
            'viewsLast30Days'=> $viewsLast30Days,
        ]);
    }

    /**
     * GET /api/v1/me/portfolio/feedbacks
     * Liste des avis laissés par les visiteurs.
     */
    public function feedbacks(Request $request): JsonResponse
    {
        $portfolio = $request->user()->portfolio()->firstOrFail();

        $items = $portfolio->feedbacks()
            ->orderByDesc('created_at')
            ->limit(50)
            ->get()
            ->map(fn ($f) => [
                'id'       => $f->id,
                'rating'   => $f->rating,
                'message'  => $f->message,
                'createdAt'=> $f->created_at->toISOString(),
            ]);

        return response()->json(['feedbacks' => $items]);
    }

    /**
     * POST /api/v1/me/portfolio/featured-request
     * Candidature pour être mis en avant (portfolio de la semaine).
     */
    public function featuredRequest(Request $request): JsonResponse
    {
        $portfolio = $request->user()->portfolio()->firstOrFail();

        FeaturedRequestModel::firstOrCreate(
            ['portfolio_id' => $portfolio->id],
            ['message' => $request->input('message', '')]
        );

        return response()->json(['message' => 'Candidature enregistrée. Nous vous recontacterons si vous êtes sélectionné.'], 201);
    }
}
