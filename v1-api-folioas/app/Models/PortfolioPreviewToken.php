<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PortfolioPreviewToken extends Model
{
    protected $fillable = ['portfolio_id', 'token', 'expires_at'];

    protected $casts = ['expires_at' => 'datetime'];

    public function portfolio(): BelongsTo
    {
        return $this->belongsTo(Portfolio::class);
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }
}
