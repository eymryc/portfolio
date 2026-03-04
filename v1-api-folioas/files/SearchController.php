<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * GET /api/v1/search?query=...&per_page=15
 *
 * Recherche full-text dans les portfolios publics.
 * Recherche sur : profile.name, profile.title, profile.bio, slug.
 */
class SearchController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $request->validate([
            'query'    => ['required', 'string', 'min:2', 'max:100'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $query   = $request->string('query')->trim();
        $perPage = $request->integer('per_page', 15);

        $results = Portfolio::published()
            ->where(function ($q) use ($query) {
                $q->whereRaw("JSON_EXTRACT(content, '$.profile.name') LIKE ?",  ["%{$query}%"])
                  ->orWhereRaw("JSON_EXTRACT(content, '$.profile.title') LIKE ?", ["%{$query}%"])
                  ->orWhereRaw("JSON_EXTRACT(content, '$.profile.bio') LIKE ?",  ["%{$query}%"])
                  ->orWhere('slug', 'like', "%{$query}%");
            })
            ->select(['id', 'slug', 'template_id', 'content'])
            ->paginate($perPage);

        $results->getCollection()->transform(function (Portfolio $p) {
            $profile = $p->content['profile'] ?? [];

            return [
                'slug'  => $p->slug,
                'name'  => $profile['name'] ?? null,
                'title' => $profile['title'] ?? null,
                'bio'   => isset($profile['bio']) ? Str::limit($profile['bio'], 120) : null,
                'photo' => $profile['photo'] ?? null,
            ];
        });

        return response()->json($results);
    }
}
