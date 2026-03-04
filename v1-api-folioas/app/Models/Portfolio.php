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
 * @property int         $views_count
 * @property \Carbon\Carbon|null $featured_at
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
        'views_count',
        'featured_at',
    ];

    protected $casts = [
        'content'     => 'array',
        'is_public'   => 'boolean',
        'featured_at' => 'datetime',
    ];

    // ─── Sections ────────────────────────────────────────────

    /** Toutes les sections disponibles */
    public const SECTIONS = [
        'profile', 'skills', 'contact', 'seo', // objets
        'experiences', 'projects', 'education', 'testimonials', 'services', // tableaux d'items
    ];

    /** Sections qui sont des objets (remplacées en bloc) */
    public const OBJECT_SECTIONS = ['profile', 'skills', 'contact', 'seo'];

    /** Sections qui sont des tableaux (items CRUD) */
    public const ARRAY_SECTIONS = ['experiences', 'projects', 'education', 'testimonials', 'services'];

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

    public function portfolioViews(): HasMany
    {
        return $this->hasMany(PortfolioView::class);
    }

    public function feedbacks(): HasMany
    {
        return $this->hasMany(PortfolioFeedback::class);
    }

    public function featuredRequests(): HasMany
    {
        return $this->hasMany(FeaturedRequest::class);
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
                'yearsOfExperience' => null,
                'projectsCount' => null,
                'hobbies' => [],
                'cv' => null,
                'links' => ['linkedin' => null, 'github' => null, 'website' => null, 'cv' => null],
                'openToWork' => false,
                'openToWorkMessage' => null,
            ],
            'skills'      => [],   // { "Frontend": ["React", ...] }
            'experiences' => [],   // [{id, period, role, company, current, desc?, ...}]
            'projects'    => [],   // [{id, title, desc, tags, link, icon?, color?, category?}]
            'education'    => [],   // [{id, year, degree, school, location?}]
            'testimonials' => [],   // [{id, author, company, role?, text, photo?}]
            'services'     => [],   // [{id, title, description?, price?}]
            'contact'      => [
                'email'              => null,
                'phone'              => null,
                'messagePlaceholder' => null,
            ],
            'seo' => [
                'title'       => null,
                'description' => null,
            ],
        ];
    }
}
