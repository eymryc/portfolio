<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('portfolios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('slug', 100)->unique();
            $table->string('template_id', 50)->default('classic');
            $table->string('template_version', 20)->nullable();
            $table->json('content')->nullable()->comment('{ profile, skills, experiences, projects, education, contact }');
            $table->boolean('is_public')->default(false)->comment('false = brouillon | true = publié');
            $table->timestamps();

            $table->index(['slug', 'is_public']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolios');
    }
};
