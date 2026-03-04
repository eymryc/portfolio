<?php

namespace App\Services;

use App\Models\Portfolio;
use App\Models\PortfolioPreviewToken;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * PortfolioService
 * ────────────────
 * Toute la logique métier liée aux portfolios.
 * Les controllers délèguent ici — ils ne font que HTTP (request/response).
 */
final class PortfolioService
{
    /**
     * Crée un portfolio vide pour l'onboarding.
     * Si slug est vide, en génère un unique à partir du nom (ou email) de l'utilisateur.
     */
    public function create(User $user, array $validated): Portfolio
    {
        $slug = isset($validated['slug']) && (string) $validated['slug'] !== ''
            ? $validated['slug']
            : $this->generateUniqueSlug($user);

        return Portfolio::create([
            'user_id'          => $user->id,
            'slug'             => $slug,
            'template_id'      => $validated['template_id'],
            'template_version' => $validated['template_version'] ?? null,
            'content'          => Portfolio::emptyContent(),
            'is_public'        => false,
        ]);
    }

    /**
     * Génère un slug unique à partir du nom (ou email) de l'utilisateur.
     */
    private function generateUniqueSlug(User $user): string
    {
        $base = Str::slug($user->name ?: explode('@', $user->email)[0] ?? 'portfolio');
        $base = preg_replace('/^[^a-z0-9]+|[^a-z0-9]+$/i', '', $base) ?: 'portfolio';
        $base = Str::lower($base);

        $slug = $base;
        while (Portfolio::where('slug', $slug)->exists()) {
            $slug = $base . '-' . Str::lower(Str::random(5));
        }

        return $slug;
    }

    /**
     * Remplace toute une section du contenu en transaction.
     */
    public function replaceSection(Portfolio $portfolio, string $section, mixed $data): void
    {
        DB::transaction(fn () => $portfolio->setSection($section, $data));
    }

    /**
     * Ajoute un item dans une section array.
     * Génère un UUID si l'item n'en a pas.
     *
     * @return array L'item avec son id
     */
    public function addItem(Portfolio $portfolio, string $section, array $item): array
    {
        $item['id'] = (string) Str::uuid();

        DB::transaction(function () use ($portfolio, $section, $item) {
            $content           = $portfolio->content ?? [];
            $content[$section] = array_merge($content[$section] ?? [], [$item]);
            $portfolio->update(['content' => $content]);
        });

        return $item;
    }

    /**
     * Met à jour un item existant dans une section array.
     *
     * @return array L'item mis à jour
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException 409 si itemId introuvable
     */
    public function updateItem(Portfolio $portfolio, string $section, string $itemId, array $data): array
    {
        $updated = null;

        DB::transaction(function () use ($portfolio, $section, $itemId, $data, &$updated) {
            $content = $portfolio->content ?? [];
            $items   = $content[$section] ?? [];
            $index   = collect($items)->search(fn ($i) => ($i['id'] ?? null) === $itemId);

            if ($index === false) {
                abort(409, "Item '{$itemId}' introuvable dans '{$section}'.");
            }

            $data['id']        = $itemId;
            $items[$index]     = $data;
            $updated           = $data;
            $content[$section] = array_values($items);

            $portfolio->update(['content' => $content]);
        });

        return $updated;
    }

    /**
     * Supprime un item d'une section array.
     *
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException 409 si introuvable
     */
    public function destroyItem(Portfolio $portfolio, string $section, string $itemId): void
    {
        DB::transaction(function () use ($portfolio, $section, $itemId) {
            $content  = $portfolio->content ?? [];
            $items    = $content[$section] ?? [];
            $filtered = collect($items)->reject(fn ($i) => ($i['id'] ?? null) === $itemId)->values()->all();

            if (count($filtered) === count($items)) {
                abort(409, "Item '{$itemId}' introuvable dans '{$section}'.");
            }

            $content[$section] = $filtered;
            $portfolio->update(['content' => $content]);
        });
    }

    /**
     * Génère un token de preview (30 min).
     * Purge les anciens tokens expirés au passage.
     */
    public function generatePreviewToken(Portfolio $portfolio): PortfolioPreviewToken
    {
        $portfolio->previewTokens()->where('expires_at', '<', now())->delete();

        return $portfolio->previewTokens()->create([
            'token'      => Str::random(64),
            'expires_at' => now()->addMinutes(30),
        ]);
    }
}
