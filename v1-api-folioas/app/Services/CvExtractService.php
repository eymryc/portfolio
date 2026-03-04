<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

/**
 * Extrait le texte d'un PDF (CV) et parse les sections pour les mapper
 * exactement sur le schéma portfolio : profile, experiences (desc), education, skills.
 *
 * Pour l'extraction PDF : composer require smalot/pdfparser
 */
final class CvExtractService
{
    private const SECTION_HEADERS = [
        'experiences' => [
            'expérience', 'experiences', 'expériences professionnelles', 'parcours professionnel',
            'work experience', 'professional experience', 'emploi', 'emplois', 'carrière',
        ],
        'education' => [
            'formation', 'formations', 'études', 'education', 'parcours scolaire', 'diplômes',
            'diplôme', 'formations et diplômes', 'scolarité', 'academic', 'training',
        ],
        'skills' => [
            'compétences', 'competences', 'skills', 'techniques', 'savoirs', 'compétences techniques',
            'langages', 'outils', 'technologies', 'expertise', 'savoirs-faire',
        ],
    ];

    public function extractTextFromPdf(UploadedFile $file): ?string
    {
        if (! class_exists(\Smalot\PdfParser\Parser::class)) {
            return null;
        }

        try {
            $parser = new \Smalot\PdfParser\Parser();
            $pdf    = $parser->parseFile($file->getRealPath());

            return $pdf->getText();
        } catch (\Throwable) {
            return null;
        }
    }

    /**
     * Parse le texte du CV et retourne un tableau structuré aligné sur le schéma portfolio.
     * - profile: name, title, bio
     * - contact: email, phone (détectés dans tout le texte)
     * - experiences: [{ id, period, role, company, location, current, desc }]
     * - education: [{ id, year, degree, school, location }]
     * - skills: { "Catégorie": ["item1", "item2"] }
     */
    public function parseCvText(string $text): array
    {
        $text  = preg_replace('/\r\n|\r/', "\n", $text) ?: $text;
        $lines = array_map('trim', explode("\n", $text));
        $lines = array_values(array_filter($lines, fn ($l) => $l !== ''));

        $result = [
            'profile'     => ['name' => null, 'title' => null, 'bio' => null],
            'contact'     => ['email' => null, 'phone' => null],
            'experiences' => [],
            'education'   => [],
            'skills'      => [],
        ];

        $sectionRanges = $this->detectSectionRanges($lines);
        $headerIndices = array_keys($sectionRanges);

        $this->extractProfile($lines, $headerIndices, $result['profile']);
        $this->extractContact($text, $result['contact']);

        if (isset($sectionRanges['experiences'])) {
            $result['experiences'] = $this->parseExperiences(
                $this->sliceLines($lines, $sectionRanges['experiences'])
            );
        }
        if (isset($sectionRanges['education'])) {
            $result['education'] = $this->parseEducation(
                $this->sliceLines($lines, $sectionRanges['education'])
            );
        }
        if (isset($sectionRanges['skills'])) {
            $result['skills'] = $this->parseSkills(
                $this->sliceLines($lines, $sectionRanges['skills'])
            );
        }

        return $result;
    }

    /**
     * Détecte email et téléphone dans tout le texte du CV.
     */
    private function extractContact(string $text, array &$contact): void
    {
        $text = preg_replace('/\s+/', ' ', $text) ?: $text;

        if (preg_match('/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/', $text, $m)) {
            $contact['email'] = trim($m[0]);
        }

        $phonePatterns = [
            '/\+?\d{1,4}[\s.-]?(?:\(\d{2,4}\)[\s.-]?)?\d{2,4}[\s.-]?\d{2,4}[\s.-]?\d{2,4}[\s.-]?\d{0,4}/',
            '/0[1-9](?:[\s.-]?\d{2}){4}/',
            '/\+225[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}/',
        ];
        foreach ($phonePatterns as $pattern) {
            if (preg_match($pattern, $text, $m)) {
                $phone = preg_replace('/[\s.-]/', ' ', trim($m[0]));
                $phone = preg_replace('/\s+/', ' ', $phone) ?: $phone;
                if (strlen($phone) >= 8 && strlen($phone) <= 25) {
                    $contact['phone'] = $phone;
                    break;
                }
            }
        }
    }

    /**
     * Détecte les index de lignes où commencent les sections (expérience, formation, compétences).
     *
     * @return array<string, array{0: int, 1: int}> section => [start, end]
     */
    private function detectSectionRanges(array $lines): array
    {
        $ranges   = [];
        $current  = null;
        $startIdx = null;

        $sectionKeywords = [];
        foreach (self::SECTION_HEADERS as $key => $keywords) {
            foreach ($keywords as $kw) {
                $sectionKeywords[$key][] = $this->normalize($kw);
            }
        }

        foreach ($lines as $i => $line) {
            $lineNorm = $this->normalize($line);
            $isShort  = strlen($line) <= 60;

            foreach ($sectionKeywords as $section => $kws) {
                $match = $isShort && $this->lineMatchesKeywords($lineNorm, $kws);
                if ($match) {
                    if ($current !== null && $startIdx !== null) {
                        $ranges[$current] = [$startIdx, $i - 1];
                    }
                    $current  = $section;
                    $startIdx = $i + 1;
                    break;
                }
            }
        }

        if ($current !== null && $startIdx !== null) {
            $ranges[$current] = [$startIdx, count($lines) - 1];
        }

        return $ranges;
    }

    private function normalize(string $s): string
    {
        $s = mb_strtolower($s);
        $s = preg_replace('/\s+/', ' ', $s) ?: $s;

        return trim($s);
    }

    private function lineMatchesKeywords(string $lineNorm, array $keywords): bool
    {
        foreach ($keywords as $kw) {
            if ($lineNorm === $kw || str_starts_with($lineNorm, $kw . ' ') || str_ends_with($lineNorm, ' ' . $kw)) {
                return true;
            }
            if (str_contains($lineNorm, $kw) && strlen($lineNorm) <= 50) {
                return true;
            }
        }

        return false;
    }

    private function sliceLines(array $lines, array $range): array
    {
        [$start, $end] = $range;
        $end = min($end, count($lines) - 1);
        if ($start > $end) {
            return [];
        }

        return array_slice($lines, $start, $end - $start + 1);
    }

    private function extractProfile(array $lines, array $headerIndices, array &$profile): void
    {
        $firstSectionIdx = count($lines);
        if ($headerIndices !== []) {
            $firstSectionIdx = min($headerIndices);
        }

        $topLines = array_slice($lines, 0, min(20, $firstSectionIdx));
        $name     = null;
        $title    = null;
        $bioLines = [];

        $skipWords = ['curriculum', 'vitae', 'cv', 'résumé', 'resume', 'portfolio'];
        foreach ($topLines as $line) {
            $norm = $this->normalize($line);
            if (strlen($norm) <= 2) {
                continue;
            }
            if ($this->shouldSkipLine($norm, $skipWords)) {
                continue;
            }
            if ($name === null && $this->looksLikeName($line)) {
                $name = $line;
                continue;
            }
            if ($title === null && strlen($line) < 120 && ! $this->looksLikeDateRange($line)) {
                $title = $line;
                continue;
            }
            $bioLines[] = $line;
        }

        $profile['name']  = $name;
        $profile['title'] = $title;
        if ($bioLines !== []) {
            $profile['bio'] = preg_replace('/\s+/', ' ', implode(' ', array_slice($bioLines, 0, 5))) ?: null;
        }
    }

    private function shouldSkipLine(string $norm, array $skipWords): bool
    {
        foreach ($skipWords as $w) {
            if ($norm === $w || str_starts_with($norm, $w . ' ')) {
                return true;
            }
        }

        return false;
    }

    private function looksLikeName(string $line): bool
    {
        if (strlen($line) > 60 || preg_match('/\d/', $line)) {
            return false;
        }
        $words = preg_split('/\s+/u', trim($line), -1, PREG_SPLIT_NO_EMPTY);

        return count($words) >= 2 && count($words) <= 5;
    }

    private function looksLikeDateRange(string $line): bool
    {
        return (bool) preg_match('/\d{4}\s*[-–—]\s*(\d{4}|présent|actuel)/ui', $line)
            || (bool) preg_match('/depuis\s+\d{4}/ui', $line)
            || (bool) preg_match('/\d{2}\/\d{4}/', $line);
    }

    /**
     * Parse le bloc expériences. Chaque entrée : id, period, role, company, location, current, desc.
     */
    private function parseExperiences(array $lines): array
    {
        $block = implode("\n", $lines);
        $entries = [];

        $pattern = '/(?=\d{4}\s*[-–—]|\d{2}\/\d{4}|depuis\s+\d{4}|janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)/ui';
        $chunks = preg_split($pattern, $block, -1, PREG_SPLIT_NO_EMPTY);

        foreach ($chunks as $chunk) {
            $chunk = trim($chunk);
            if (strlen($chunk) < 5) {
                continue;
            }

            $period = null;
            if (preg_match('/(\d{4}\s*[-–—]\s*(?:\d{4}|présent|actuel)|depuis\s+\d{4}|\d{2}\/\d{4}\s*[-–—]\s*\d{2}\/\d{4})/ui', $chunk, $m)) {
                $period = trim($m[1]);
            }

            $current = (bool) preg_match('/présent|actuel|en cours|depuis/ui', $chunk);

            $chunkLines = array_values(array_filter(explode("\n", $chunk)));
            $role       = null;
            $company    = null;
            $location   = null;
            $descParts  = [];

            foreach ($chunkLines as $idx => $l) {
                $l = trim($l);
                if ($l === '') {
                    continue;
                }
                if ($period && str_contains($l, $period)) {
                    $withoutPeriod = trim(preg_replace('/\d{4}\s*[-–—].*$/u', '', $l));
                    if (strlen($withoutPeriod) > 1) {
                        $role = $withoutPeriod;
                    }
                    continue;
                }
                if ($role === null && strlen($l) < 120 && ! $this->looksLikeDateRange($l)) {
                    $role = $l;
                    continue;
                }
                if ($company === null && strlen($l) < 150 && ! $this->looksLikeDateRange($l)) {
                    $company = $l;
                    continue;
                }
                if ($location === null && $this->looksLikeLocation($l)) {
                    $location = $l;
                    continue;
                }
                $descParts[] = $l;
            }

            $desc = $descParts !== [] ? implode(' ', $descParts) : null;
            if ($desc !== null && strlen($desc) < 10) {
                $desc = null;
            }

            $entries[] = [
                'id'       => (string) Str::uuid(),
                'period'   => $period,
                'role'     => $role ?? 'Poste',
                'company'  => $company ?? 'Entreprise',
                'location' => $location,
                'current'  => $current,
                'desc'     => $desc,
            ];
        }

        if ($entries === [] && strlen($block) > 30) {
            $entries[] = [
                'id'       => (string) Str::uuid(),
                'period'   => null,
                'role'     => 'Poste',
                'company'  => 'Entreprise',
                'location' => null,
                'current'  => false,
                'desc'     => $block,
            ];
        }

        return $entries;
    }

    private function looksLikeLocation(string $line): bool
    {
        if (strlen($line) > 80 || preg_match('/\d{4}\s*[-–—]/', $line)) {
            return false;
        }
        $line = trim($line);
        if (strlen($line) < 2) {
            return false;
        }
        if (preg_match('/^[A-Za-zÀ-ÿ\s,-]+$/u', $line) && preg_match('/,|\(.*\)/', $line)) {
            return true;
        }
        $words = preg_split('/\s+/u', $line, -1, PREG_SPLIT_NO_EMPTY);

        return count($words) <= 4 && ! preg_match('/^\d+$/', $line);
    }

    /**
     * Parse le bloc formation. Chaque entrée : id, year, degree, school, location.
     */
    private function parseEducation(array $lines): array
    {
        $entries = [];
        $block   = implode("\n", $lines);

        $pattern = '/(?=\d{4}\s*[-–—]?\s*\d{0,4}|bac|bts|licence|master|mastère|doctorat|ingénieur|mba|deug|dut)/ui';
        $chunks = preg_split($pattern, $block, -1, PREG_SPLIT_NO_EMPTY);

        foreach ($chunks as $chunk) {
            $chunk = trim($chunk);
            if (strlen($chunk) < 4) {
                continue;
            }

            $year = null;
            if (preg_match('/^(\d{4}\s*[-–—]?\s*\d{0,4})\s*(.*)/us', $chunk, $m)) {
                $year  = trim($m[1]);
                $chunk = trim($m[2]);
            }

            $chunkLines = array_values(array_filter(explode("\n", $chunk)));
            $degree     = $chunkLines[0] ?? null;
            $school     = $chunkLines[1] ?? null;
            $location   = $chunkLines[2] ?? null;

            if ($degree === null && $chunk !== '') {
                $degree = $chunk;
            }

            $entries[] = [
                'id'       => (string) Str::uuid(),
                'year'     => $year,
                'degree'   => $degree ?? 'Formation',
                'school'   => $school ?? 'Établissement',
                'location' => $location,
            ];
        }

        return $entries;
    }

    /**
     * Parse le bloc compétences. Retourne { "Catégorie": ["a", "b"] }.
     */
    private function parseSkills(array $lines): array
    {
        $skills = [];
        $currentCategory = 'Compétences';
        $currentList = [];

        $categoryKeywords = ['langages', 'langage', 'outils', 'outil', 'frameworks', 'framework', 'bases de données', 'méthodologies', 'savoir-faire', 'techniques'];

        foreach ($lines as $line) {
            $line = trim($line, " \t•\-–—");
            if ($line === '') {
                if ($currentList !== []) {
                    $skills[$currentCategory] = array_merge($skills[$currentCategory] ?? [], $currentList);
                    $currentList = [];
                }
                continue;
            }

            $norm = $this->normalize($line);
            $isCategory = strlen($line) < 40 && (
                in_array($norm, $categoryKeywords, true)
                || (count(explode(' ', $norm)) <= 2 && preg_match('/^[a-zà-ÿ\s]+$/u', $norm))
            );

            if ($isCategory && preg_match('/^[a-zà-ÿ]/u', $norm)) {
                if ($currentList !== []) {
                    $skills[$currentCategory] = array_merge($skills[$currentCategory] ?? [], $currentList);
                    $currentList = [];
                }
                $currentCategory = ucfirst($line);
                continue;
            }

            $items = preg_split('/[,;·|]\s*/u', $line);
            foreach ($items as $item) {
                $item = trim($item);
                if (strlen($item) >= 2 && strlen($item) < 80) {
                    $currentList[] = $item;
                }
            }
        }

        if ($currentList !== []) {
            $skills[$currentCategory] = array_merge($skills[$currentCategory] ?? [], $currentList);
        }

        foreach ($skills as $k => $v) {
            $skills[$k] = array_values(array_unique(array_slice($v, 0, 50)));
        }

        return $skills;
    }
}
