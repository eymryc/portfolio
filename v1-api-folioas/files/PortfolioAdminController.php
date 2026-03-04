<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use Illuminate\Http\JsonResponse;

class PortfolioAdminController extends Controller
{
    /**
     * GET /api/v1/admin/portfolios
     */
    public function index(): JsonResponse
    {
        $portfolios = Portfolio::with('user:id,name,email')
            ->latest()
            ->paginate(50);

        return response()->json($portfolios);
    }
}
