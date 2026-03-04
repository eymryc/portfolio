<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Transforme Portfolio en JSON adapté Next.js.
 *
 * Mode public  (owner = false) : templateId + content uniquement (SSG/ISR)
 * Mode owner   (owner = true)  : toutes les métadonnées (dashboard)
 */
class PortfolioResource extends JsonResource
{
    public function __construct($resource, private readonly bool $owner = false)
    {
        parent::__construct($resource);
    }

    public function toArray(Request $request): array
    {
        $base = [
            'templateId'      => $this->template_id,
            'templateVersion' => $this->template_version,
            'content'         => $this->content ?? [],
        ];

        if (! $this->owner) {
            $base['slug'] = $this->slug;
            return $base;
        }

        return array_merge($base, [
            'id'         => $this->id,
            'slug'       => $this->slug,
            'isPublic'   => $this->is_public,
            'viewsCount' => (int) ($this->views_count ?? 0),
            'createdAt'  => $this->created_at?->toISOString(),
            'updatedAt'  => $this->updated_at?->toISOString(),
        ]);
    }
}
