<?php

namespace App\Http\Controllers\Api\Me;

use App\Http\Controllers\Controller;
use App\Services\CvExtractLlmService;
use App\Services\CvExtractService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * POST /api/v1/me/portfolio/extract-from-cv
 *
 * Envoie un fichier PDF (CV). Le serveur extrait le texte (si smalot/pdfparser est installé),
 * parse les sections (expérience, formation, compétences) et retourne un contenu structuré.
 * Le frontend peut ensuite appeler PUT /sections/{section} pour enregistrer en base.
 *
 * Option : ?apply=1 pour que l'API applique directement les sections au portfolio.
 */
class CvExtractController extends Controller
{
    public function __construct(
        private readonly CvExtractService $cvExtract
    ) {}

    public function extract(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'max:5120', 'mimes:pdf'],
        ], [
            'file.required' => 'Veuillez envoyer un fichier PDF.',
            'file.mimes'    => 'Le fichier doit être un PDF.',
        ]);

        $file = $request->file('file');
        $text = $this->cvExtract->extractTextFromPdf($file);

        if ($text === null || trim($text) === '') {
            return response()->json([
                'success' => false,
                'message' => 'Impossible d\'extraire le texte du PDF. Installez la librairie : composer require smalot/pdfparser',
                'extracted' => null,
            ], 501);
        }

        $extracted = null;
        if (CvExtractLlmService::isConfigured() && config('portfolio.cv_use_llm')) {
            $llm = new CvExtractLlmService(
                config('portfolio.openai_api_key'),
                config('portfolio.openai_model', 'gpt-4o-mini')
            );
            $extracted = $llm->extractFromText($text);
        }
        if ($extracted === null) {
            $extracted = $this->cvExtract->parseCvText($text);
        }

        $apply = $request->boolean('apply');
        if ($apply) {
            $portfolio = $request->user()->portfolio()->firstOrFail();
            $content   = $portfolio->content ?? [];

            if (! empty($extracted['profile'])) {
                $existing = $content['profile'] ?? [];
                $new      = array_filter($extracted['profile'], fn ($v) => $v !== null && $v !== '');
                $content['profile'] = array_merge($existing, $new);
            }
            if (! empty($extracted['contact'])) {
                $existing = $content['contact'] ?? [];
                $new      = array_filter($extracted['contact'], fn ($v) => $v !== null && $v !== '');
                $content['contact'] = array_merge($existing, $new);
            }
            if (! empty($extracted['experiences'])) {
                $content['experiences'] = $this->normalizeExperiences($extracted['experiences']);
            }
            if (! empty($extracted['education'])) {
                $content['education'] = $this->normalizeEducation($extracted['education']);
            }
            if (! empty($extracted['skills'])) {
                $content['skills'] = $extracted['skills'];
            }

            $portfolio->update(['content' => $content]);
        }

        return response()->json([
            'success'   => true,
            'extracted' => $extracted,
            'applied'   => $apply,
        ]);
    }

    /**
     * S'assure que chaque expérience a les clés attendues (role, company, location, desc).
     */
    private function normalizeExperiences(array $items): array
    {
        return array_map(function ($item) {
            return [
                'id'       => $item['id'] ?? (string) Str::uuid(),
                'period'   => $item['period'] ?? null,
                'role'     => $item['role'] ?? 'Poste',
                'company'  => $item['company'] ?? 'Entreprise',
                'location' => $item['location'] ?? null,
                'current'  => (bool) ($item['current'] ?? false),
                'desc'     => $item['desc'] ?? $item['description'] ?? null,
            ];
        }, $items);
    }

    /**
     * S'assure que chaque formation a year, degree, school, location.
     */
    private function normalizeEducation(array $items): array
    {
        return array_map(function ($item) {
            return [
                'id'       => $item['id'] ?? (string) Str::uuid(),
                'year'     => $item['year'] ?? null,
                'degree'   => $item['degree'] ?? 'Formation',
                'school'   => $item['school'] ?? 'Établissement',
                'location' => $item['location'] ?? null,
            ];
        }, $items);
    }
}
