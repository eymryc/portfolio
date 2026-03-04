<?php

namespace App\Http\Requests\Section;

use App\Models\Portfolio;
use Illuminate\Foundation\Http\FormRequest;

/**
 * PUT /me/portfolio/sections/{section}
 * Le body contient { "data": <contenu de la section> }
 */
class SectionReplaceRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        $section = $this->route('section');

        $dataRules = match ($section) {
            'profile' => [
                'data'                => ['required', 'array'],
                'data.name'           => ['nullable', 'string', 'max:255'],
                'data.title'          => ['nullable', 'string', 'max:255'],
                'data.bio'            => ['nullable', 'string', 'max:2000'],
                'data.photo'          => ['nullable', 'string', 'max:500'],
                'data.links'          => ['nullable', 'array'],
                'data.links.linkedin' => ['nullable', 'url'],
                'data.links.github'   => ['nullable', 'url'],
                'data.links.website'  => ['nullable', 'url'],
            ],
            'skills' => [
                'data'   => ['required', 'array'],
                'data.*' => ['array'],
            ],
            'contact' => [
                'data'                        => ['required', 'array'],
                'data.email'                  => ['nullable', 'email'],
                'data.phone'                  => ['nullable', 'string', 'max:30'],
                'data.messagePlaceholder'     => ['nullable', 'string', 'max:255'],
            ],
            'experiences', 'projects', 'education' => [
                'data'   => ['required', 'array'],
                'data.*' => ['array'],
            ],
            default => ['data' => ['required']],
        };

        return $dataRules;
    }
}
