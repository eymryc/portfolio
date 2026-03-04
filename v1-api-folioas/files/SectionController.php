<?php

namespace App\Http\Controllers\Api\Me;

use App\Http\Controllers\Controller;
use App\Http\Requests\Section\SectionItemRequest;
use App\Http\Requests\Section\SectionReplaceRequest;
use App\Models\Portfolio;
use App\Services\PortfolioService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Gère les sections du contenu portfolio.
 *
 * L'éditeur Next.js envoie les données section par section.
 * Deux comportements selon le type de section :
 *
 * OBJET  (profile, skills, contact)
 *   → GET  /sections/{s}          lire
 *   → PUT  /sections/{s}          remplacer tout l'objet
 *
 * ARRAY  (experiences, projects, education)
 *   → GET  /sections/{s}          lire le tableau
 *   → PUT  /sections/{s}          remplacer tout le tableau (bulk)
 *   → POST /sections/{s}/items    ajouter un item (uuid auto)
 *   → PUT  /sections/{s}/items/{id}   modifier
 *   → DELETE /sections/{s}/items/{id} supprimer
 */
class SectionController extends Controller
{
    public function __construct(
        private readonly PortfolioService $portfolioService
    ) {}

    /**
     * GET /api/v1/me/portfolio/sections/{section}
     */
    public function show(Request $request, string $section): JsonResponse
    {
        $this->validateSection($section);

        return response()->json(
            $request->user()->portfolio()->firstOrFail()->getSection($section)
        );
    }

    /**
     * PUT /api/v1/me/portfolio/sections/{section}
     * Remplace toute la section (objet ou tableau complet).
     */
    public function replace(SectionReplaceRequest $request, string $section): JsonResponse
    {
        $this->validateSection($section);

        $portfolio = $request->user()->portfolio()->firstOrFail();
        $this->portfolioService->replaceSection($portfolio, $section, $request->validated('data'));

        return response()->json($portfolio->fresh()->getSection($section));
    }

    /**
     * POST /api/v1/me/portfolio/sections/{section}/items
     */
    public function storeItem(SectionItemRequest $request, string $section): JsonResponse
    {
        $this->validateArraySection($section);

        $portfolio = $request->user()->portfolio()->firstOrFail();
        $item      = $this->portfolioService->addItem($portfolio, $section, $request->validated());

        return response()->json($item, 201);
    }

    /**
     * PUT /api/v1/me/portfolio/sections/{section}/items/{itemId}
     */
    public function updateItem(SectionItemRequest $request, string $section, string $itemId): JsonResponse
    {
        $this->validateArraySection($section);

        $portfolio = $request->user()->portfolio()->firstOrFail();
        $item      = $this->portfolioService->updateItem($portfolio, $section, $itemId, $request->validated());

        return response()->json($item);
    }

    /**
     * DELETE /api/v1/me/portfolio/sections/{section}/items/{itemId}
     */
    public function destroyItem(Request $request, string $section, string $itemId): JsonResponse
    {
        $this->validateArraySection($section);

        $portfolio = $request->user()->portfolio()->firstOrFail();
        $this->portfolioService->destroyItem($portfolio, $section, $itemId);

        return response()->json(null, 204);
    }

    // ─── Guards ──────────────────────────────────────────────

    private function validateSection(string $section): void
    {
        if (! in_array($section, Portfolio::SECTIONS, true)) {
            abort(422, "Section invalide. Valeurs : " . implode(', ', Portfolio::SECTIONS));
        }
    }

    private function validateArraySection(string $section): void
    {
        $this->validateSection($section);

        if (! in_array($section, Portfolio::ARRAY_SECTIONS, true)) {
            abort(422, "La section '{$section}' est un objet. Utilisez PUT /{$section} pour la modifier.");
        }
    }
}
