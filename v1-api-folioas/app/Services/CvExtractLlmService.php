<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

/**
 * Extraction CV par LLM (OpenAI) — logique type LinkedIn / parseurs modernes.
 *
 * Utilise un prompt structuré pour obtenir un JSON aligné sur le schéma portfolio.
 * À utiliser en priorité si OPENAI_API_KEY est configuré ; sinon fallback sur CvExtractService (règles).
 *
 * @see docs/CV-EXTRACTION.md
 */
final class CvExtractLlmService
{
    private const SYSTEM_PROMPT = <<<'PROMPT'
Tu es un extracteur de données CV. Tu reçois le texte brut d'un CV et tu dois renvoyer UNIQUEMENT un objet JSON valide, sans markdown ni commentaire, avec exactement cette structure :

{
  "profile": { "name": "string ou null", "title": "string ou null", "bio": "string ou null" },
  "contact": { "email": "string ou null", "phone": "string ou null" },
  "experiences": [
    { "period": "ex: 2020 - 2023", "role": "poste", "company": "entreprise", "location": "ville, pays ou null", "current": false, "desc": "description du poste" }
  ],
  "education": [
    { "year": "ex: 2020 - 2022", "degree": "diplôme", "school": "établissement", "location": "ville ou null" }
  ],
  "skills": { "Nom de catégorie": ["compétence1", "compétence2"], "Autre catégorie": [] }
}

Règles strictes :
- N'extrais QUE les informations explicitement présentes dans le CV. N'invente rien.
- profile.name : nom complet (souvent en tête du CV).
- profile.title : titre professionnel ou intitulé du poste visé.
- profile.bio : courte phrase de résumé si présente.
- contact : email (format xxx@yyy.zz) et numéro de téléphone (tous formats).
- experiences : pour chaque emploi, period (dates), role (intitulé du poste), company (nom entreprise), location (ville/pays si indiqué), current (true si "présent" / "actuel"), desc (résumé des missions, en une phrase ou plus).
- education : year, degree, school, location pour chaque formation.
- skills : regrouper les compétences par catégorie si le CV le fait (ex: "Langages", "Outils"); sinon une seule clé "Compétences" avec un tableau.
- Si le texte ne ressemble pas à un CV (pas d'expérience, pas de formation, pas de nom), renvoie : {"valid_cv": false}.
- Langue : garder le texte extrait dans sa langue d'origine.
PROMPT;

    public function __construct(
        private readonly string $apiKey,
        private readonly string $model = 'gpt-4o-mini'
    ) {}

    public static function isConfigured(): bool
    {
        $key = config('portfolio.openai_api_key', env('OPENAI_API_KEY'));

        return is_string($key) && $key !== '';
    }

    /**
     * Extrait les données structurées du texte CV via OpenAI.
     * Retourne le même format que CvExtractService::parseCvText() ou null en cas d'erreur / valid_cv: false.
     *
     * @return array{profile: array, contact: array, experiences: array, education: array, skills: array}|null
     */
    public function extractFromText(string $text): ?array
    {
        $text = trim($text);
        if (strlen($text) < 50) {
            return null;
        }

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->apiKey,
            'Content-Type'  => 'application/json',
        ])->timeout(30)->post('https://api.openai.com/v1/chat/completions', [
            'model'            => $this->model,
            'messages'         => [
                ['role' => 'system', 'content' => self::SYSTEM_PROMPT],
                ['role' => 'user', 'content' => "Extrais les données de ce CV et renvoie uniquement le JSON demandé.\n\n---\n\n" . $text],
            ],
            'response_format' => ['type' => 'json_object'],
            'temperature'     => 0.1,
        ]);

        if (! $response->successful()) {
            return null;
        }

        $body = $response->json();
        $content = $body['choices'][0]['message']['content'] ?? null;
        if ($content === null) {
            return null;
        }

        $decoded = json_decode($content, true);
        if (! is_array($decoded)) {
            return null;
        }

        if (isset($decoded['valid_cv']) && $decoded['valid_cv'] === false) {
            return null;
        }

        return $this->normalizeToPortfolioSchema($decoded);
    }

    /**
     * Mappe la réponse LLM vers le schéma portfolio (ids, clés exactes).
     */
    private function normalizeToPortfolioSchema(array $decoded): array
    {
        $result = [
            'profile'     => [
                'name'  => $decoded['profile']['name'] ?? null,
                'title' => $decoded['profile']['title'] ?? null,
                'bio'   => $decoded['profile']['bio'] ?? null,
            ],
            'contact'     => [
                'email' => $decoded['contact']['email'] ?? null,
                'phone' => $decoded['contact']['phone'] ?? null,
            ],
            'experiences' => [],
            'education'   => [],
            'skills'      => [],
        ];

        foreach ($decoded['experiences'] ?? [] as $exp) {
            $result['experiences'][] = [
                'id'       => (string) Str::uuid(),
                'period'   => $exp['period'] ?? null,
                'role'     => $exp['role'] ?? 'Poste',
                'company'  => $exp['company'] ?? 'Entreprise',
                'location' => $exp['location'] ?? null,
                'current'  => (bool) ($exp['current'] ?? false),
                'desc'     => $exp['desc'] ?? $exp['description'] ?? null,
            ];
        }

        foreach ($decoded['education'] ?? [] as $edu) {
            $result['education'][] = [
                'id'       => (string) Str::uuid(),
                'year'     => $edu['year'] ?? null,
                'degree'   => $edu['degree'] ?? 'Formation',
                'school'   => $edu['school'] ?? 'Établissement',
                'location' => $edu['location'] ?? null,
            ];
        }

        $skills = $decoded['skills'] ?? [];
        if (is_array($skills)) {
            $result['skills'] = $skills;
        }

        return $result;
    }
}
