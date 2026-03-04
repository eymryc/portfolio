<?php

namespace App\Providers;

use App\Models\User;
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
        // Gate admin — utilisé par middleware can:admin sur les routes /admin
        Gate::define('admin', fn (User $user) => $user->isAdmin());
    }
}
