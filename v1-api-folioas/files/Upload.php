<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;

/**
 * @property-read string $url
 */
class Upload extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'portfolio_id', 'path', 'disk', 'mime', 'size'];

    protected $casts = ['size' => 'integer'];

    protected $appends = ['url'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function portfolio(): BelongsTo
    {
        return $this->belongsTo(Portfolio::class);
    }

    public function getUrlAttribute(): string
    {
        /** @var FilesystemAdapter $storage */
        $storage = Storage::disk($this->disk);

        return $storage->url($this->path);
    }
}
