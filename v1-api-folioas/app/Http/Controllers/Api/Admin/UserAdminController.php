<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class UserAdminController extends Controller
{
    /**
     * GET /api/v1/admin/users
     */
    public function index(): JsonResponse
    {
        $users = User::withCount(['portfolio'])
            ->latest()
            ->paginate(50);

        return response()->json($users);
    }
}
