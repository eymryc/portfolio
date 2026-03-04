<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('portfolio_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('portfolio_id')->constrained()->cascadeOnDelete();
            $table->timestamp('viewed_at')->useCurrent();
            $table->string('referrer', 500)->nullable();
            $table->index(['portfolio_id', 'viewed_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolio_views');
    }
};
