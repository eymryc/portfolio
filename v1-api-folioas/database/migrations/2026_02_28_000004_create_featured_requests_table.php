<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('featured_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('portfolio_id')->constrained()->cascadeOnDelete();
            $table->string('message', 500)->nullable();
            $table->timestamps();
            $table->index('portfolio_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('featured_requests');
    }
};
