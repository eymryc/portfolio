<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

/**
 * POST /api/v1/auth/register
 * Crée un compte utilisateur. Ne crée PAS le portfolio.
 * Le portfolio est créé séparément via POST /me/portfolio (onboarding).
 */
class RegisterController extends Controller
{
    public function __invoke(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return (new UserResource($user))
            ->response()
            ->setStatusCode(201);
    }
}
