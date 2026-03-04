<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int         $id
 * @property int         $user_id
 * @property string      $slug
 * @property string      $template_id
 * @property string|null $template_version
 * @property array|null  $content
 * @property bool        $is_public
 */
class Portfolio extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'slug',
        'template_id',
        'template_version',
        'content',
        'is_public',
    ];

    protected $casts = [
        'content'   => 'array',
        'is_public' => 'boolean',
    ];

    // ─── Sections ────────────────────────────────────────────

    /** Toutes les sections disponibles */
    public const SECTIONS = [
        'profile', 'skills', 'contact',        // objets
        'experiences', 'projects', 'education', // tableaux d'items
    ];

    /** Sections qui sont des objets (remplacées en bloc) */
    public const OBJECT_SECTIONS = ['profile', 'skills', 'contact'];

    /** Sections qui sont des tableaux (items CRUD) */
    public const ARRAY_SECTIONS = ['experiences', 'projects', 'education'];

    // ─── Relations ───────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function uploads(): HasMany
    {
        return $this->hasMany(Upload::class);
    }

    public function domains(): HasMany
    {
        return $this->hasMany(Domain::class);
    }

    public function previewTokens(): HasMany
    {
        return $this->hasMany(PortfolioPreviewToken::class);
    }

    // ─── Scopes ──────────────────────────────────────────────

    public function scopePublished($query)
    {
        return $query->where('is_public', true);
    }

    // ─── Helpers section ─────────────────────────────────────

    public function getSection(string $section): mixed
    {
        $content = $this->content ?? [];

        return $content[$section] ?? (in_array($section, self::ARRAY_SECTIONS) ? [] : null);
    }

    public function setSection(string $section, mixed $data): void
    {
        $content           = $this->content ?? [];
        $content[$section] = $data;

        $this->update(['content' => $content]);
    }

    // ─── Structure de contenu vide (onboarding) ──────────────

    public static function emptyContent(): array
    {
        return [
            'profile' => [
                'name'  => null,
                'title' => null,
                'bio'   => null,
                'photo' => null,
                'links' => ['linkedin' => null, 'github' => null, 'website' => null],
            ],
            'skills'      => [],   // { "Frontend": ["React", ...] }
            'experiences' => [],   // [{id, period, role, company, ...}]
            'projects'    => [],   // [{id, title, desc, tags, link, ...}]
            'education'   => [],   // [{id, year, degree, school, ...}]
            'contact'     => [
                'email'              => null,
                'phone'              => null,
                'messagePlaceholder' => null,
            ],
        ];
    }
}
