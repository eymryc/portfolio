<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('uploads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('portfolio_id')->nullable()->constrained()->nullOnDelete();
            $table->string('path');
            $table->string('disk', 20)->default('s3');
            $table->string('mime', 100)->nullable();
            $table->unsignedInteger('size')->nullable()->comment('Taille en octets');
            $table->timestamps();

            $table->index(['user_id', 'portfolio_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('uploads');
    }
};
