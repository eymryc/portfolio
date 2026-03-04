<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use App\Models\Upload;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class StatsAdminController extends Controller
{
    /**
     * GET /api/v1/admin/stats
     */
    public function index(): JsonResponse
    {
        $stats = Cache::remember('admin:stats', 300, fn () => [
            'users' => [
                'total'        => User::count(),
                'with_portfolio' => User::whereHas('portfolio')->count(),
            ],
            'portfolios' => [
                'total'    => Portfolio::count(),
                'published'=> Portfolio::published()->count(),
                'drafts'   => Portfolio::where('is_public', false)->count(),
            ],
            'uploads' => [
                'total'      => Upload::count(),
                'total_size' => Upload::sum('size'),
            ],
        ]);

        return response()->json($stats);
    }

    /**
     * POST /api/v1/admin/cache/flush
     */
    public function flushCache(): JsonResponse
    {
        Cache::flush();

        return response()->json(['message' => 'Cache vidé avec succès.']);
    }
}
