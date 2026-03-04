<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

/**
 * Expose les templates disponibles.
 * Chaque template Next.js est un dossier dans resources/templates/{id}/
 * avec :
 *   - meta.json   → { id, name, version, description, thumbnail, designed? }
 *   - schema.json → JSON Schema des champs pour générer l'éditeur dynamiquement
 *
 * Query: ?designed=1 ou ?designed=true → ne retourne que les templates avec designed: true (vue Next.js existante).
 */
class TemplateController extends Controller
{
    /**
     * GET /api/v1/templates
     *
     * @queryParam designed optional 1 ou true pour ne retourner que les templates conçus (vue Next.js disponible).
     */
    public function index(Request $request): JsonResponse
    {
        $onlyDesigned = $request->boolean('designed');

        $templates = collect(File::directories(resource_path('templates')))
            ->map(fn (string $dir) => $this->readJson($dir . '/meta.json'))
            ->filter()
            ->values();

        if ($onlyDesigned) {
            $templates = $templates->filter(fn (array $meta) => ! empty($meta['designed']));
        }

        return response()->json($templates->values()->all());
    }

    /**
     * GET /api/v1/templates/{id}/schema
     */
    public function schema(string $id): JsonResponse
    {
        $schema = $this->readJson(resource_path("templates/{$id}/schema.json"));

        if (! $schema) {
            return response()->json(['message' => 'Template introuvable.'], 404);
        }

        return response()->json($schema);
    }

    private function readJson(string $path): ?array
    {
        if (! File::exists($path)) {
            return null;
        }

        return json_decode(File::get($path), true) ?: null;
    }
}
