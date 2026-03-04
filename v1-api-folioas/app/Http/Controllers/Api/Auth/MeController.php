<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * GET /api/v1/auth/me
 * Retourne l'utilisateur connecté + indicateur hasPortfolio.
 * Next.js l'utilise pour rediriger vers l'onboarding ou le dashboard.
 */
class MeController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        return (new UserResource($request->user()))->response();
    }
}
