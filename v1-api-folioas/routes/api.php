<?php

/**
 * ============================================================
 * PORTFOLIO AS A SERVICE — API Routes
 * Laravel 12  |  Sanctum Auth  |  Versioned /api/v1
 * ============================================================
 */

use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\LogoutController;
use App\Http\Controllers\Api\Auth\MeController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\Me\DomainController;
use App\Http\Controllers\Api\Me\PortfolioController;
use App\Http\Controllers\Api\Me\SectionController;
use App\Http\Controllers\Api\Me\UploadController;
use App\Http\Controllers\Api\Public\FeaturedController;
use App\Http\Controllers\Api\Public\PortfolioFeedbackController;
use App\Http\Controllers\Api\Public\PortfolioPublicController;
use App\Http\Controllers\Api\Public\PortfolioViewController;
use App\Http\Controllers\Api\Public\PreviewController;
use App\Http\Controllers\Api\Public\SearchController;
use App\Http\Controllers\Api\Public\SitemapController;
use App\Http\Controllers\Api\Public\TemplateController;
use App\Http\Controllers\Api\Admin\UserAdminController;
use App\Http\Controllers\Api\Admin\PortfolioAdminController;
use App\Http\Controllers\Api\Admin\StatsAdminController;
use Illuminate\Support\Facades\Route;

// Sitemap — hors prefix /api
Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');

Route::prefix('v1')->name('v1.')->group(function () {

    // ── PUBLIC ───────────────────────────────────────────────
    Route::prefix('auth')->name('auth.')->group(function () {
        Route::post('/register', RegisterController::class)->name('register')->middleware('throttle:10,1');
        Route::post('/login',    LoginController::class)->name('login')->middleware('throttle:10,1');
    });

    Route::get('/portfolios/{slug}', PortfolioPublicController::class)->name('portfolios.show');
    Route::post('/portfolios/{slug}/view', PortfolioViewController::class)->name('portfolios.view')->middleware('throttle:30,1');
    Route::post('/portfolios/{slug}/feedback', PortfolioFeedbackController::class)->name('portfolios.feedback')->middleware('throttle:10,1');
    Route::get('/featured', FeaturedController::class)->name('featured');
    Route::get('/preview/{token}', PreviewController::class)->name('preview');
    Route::get('/search', SearchController::class)->name('search')->middleware('throttle:30,1');

    Route::prefix('templates')->name('templates.')->group(function () {
        Route::get('/',            [TemplateController::class, 'index'])->name('index');
        Route::get('/{id}/schema', [TemplateController::class, 'schema'])->name('schema');
    });

    // ── PRIVÉ — auth:sanctum ─────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {

        Route::prefix('auth')->name('auth.')->group(function () {
            Route::post('/logout', LogoutController::class)->name('logout');
            Route::get('/me',      MeController::class)->name('me');
        });

        Route::prefix('me')->name('me.')->group(function () {

            Route::prefix('portfolio')->name('portfolio.')->group(function () {
                Route::get('/',             [PortfolioController::class, 'show'])->name('show');
                Route::post('/',            [PortfolioController::class, 'store'])->name('store');
                Route::patch('/template',   [PortfolioController::class, 'updateTemplate'])->name('update-template');
                Route::patch('/visibility', [PortfolioController::class, 'updateVisibility'])->name('update-visibility');
                Route::delete('/',          [PortfolioController::class, 'destroy'])->name('destroy');
                Route::post('/preview',     [PortfolioController::class, 'preview'])->name('preview');
                Route::get('/stats',           [PortfolioController::class, 'stats'])->name('stats');
                Route::get('/feedbacks',      [PortfolioController::class, 'feedbacks'])->name('feedbacks');
                Route::post('/featured-request', [PortfolioController::class, 'featuredRequest'])->name('featured-request');

                Route::prefix('sections')->name('sections.')->group(function () {
                    Route::get('/{section}',                   [SectionController::class, 'show'])->name('show');
                    Route::put('/{section}',                   [SectionController::class, 'replace'])->name('replace');
                    Route::post('/{section}/items',            [SectionController::class, 'storeItem'])->name('items.store');
                    Route::put('/{section}/items/{itemId}',    [SectionController::class, 'updateItem'])->name('items.update');
                    Route::delete('/{section}/items/{itemId}', [SectionController::class, 'destroyItem'])->name('items.destroy');
                });

                Route::post('/upload', [UploadController::class, 'store'])->name('upload')->middleware('throttle:20,1');
                Route::post('/upload-cv', [UploadController::class, 'storeCv'])->name('upload-cv')->middleware('throttle:10,1');
                Route::post('/extract-from-cv', [\App\Http\Controllers\Api\Me\CvExtractController::class, 'extract'])->name('extract-from-cv')->middleware('throttle:5,1');
            });

            Route::prefix('uploads')->name('uploads.')->group(function () {
                Route::get('/',        [UploadController::class, 'index'])->name('index');
                Route::delete('/{id}', [UploadController::class, 'destroy'])->name('destroy');
            });

            Route::prefix('domains')->name('domains.')->group(function () {
                Route::get('/',             [DomainController::class, 'index'])->name('index');
                Route::post('/',            [DomainController::class, 'store'])->name('store');
                Route::post('/{id}/verify', [DomainController::class, 'verify'])->name('verify');
                Route::delete('/{id}',      [DomainController::class, 'destroy'])->name('destroy');
            });
        });

        // ── ADMIN ────────────────────────────────────────────
        Route::middleware('can:admin')->prefix('admin')->name('admin.')->group(function () {
            Route::get('/users',        [UserAdminController::class, 'index'])->name('users.index');
            Route::get('/portfolios',   [PortfolioAdminController::class, 'index'])->name('portfolios.index');
            Route::get('/stats',        [StatsAdminController::class, 'index'])->name('stats.index');
            Route::post('/cache/flush', [StatsAdminController::class, 'flushCache'])->name('cache.flush');
        });
    });
});
