<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // API : pas d’enveloppe "data" sur les ressources (Next.js attend templateId, user.hasPortfolio, etc. à la racine)
        JsonResource::withoutWrapping();

        // Gate admin — utilisé par middleware can:admin sur les routes /admin
        Gate::define('admin', fn (User $user) => $user->isAdmin());
    }
}
