<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

/**
 * GET /sitemap.xml
 * Sitemap de tous les portfolios publics. Mis en cache 1h.
 */
class SitemapController extends Controller
{
    public function __invoke(): Response
    {
        $xml = Cache::remember('sitemap.xml', 3600, function () {
            $base       = rtrim(config('app.frontend_url', config('app.url')), '/');
            $portfolios = Portfolio::published()
                ->select(['slug', 'updated_at'])
                ->orderByDesc('updated_at')
                ->get();

            $urls = $portfolios->map(fn (Portfolio $p) => implode("\n", [
                '  <url>',
                "    <loc>{$base}/p/" . e($p->slug) . '</loc>',
                '    <lastmod>' . $p->updated_at->toAtomString() . '</lastmod>',
                '    <changefreq>weekly</changefreq>',
                '    <priority>0.8</priority>',
                '  </url>',
            ]))->implode("\n");

            return <<<XML
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{$urls}
</urlset>
XML;
        });

        return response($xml, 200)
            ->header('Content-Type', 'application/xml')
            ->header('Cache-Control', 'public, max-age=3600');
    }
}
