<?php

namespace App\Http\Requests\Section;

use Illuminate\Foundation\Http\FormRequest;

/**
 * POST / PUT /me/portfolio/sections/{section}/items[/{id}]
 */
class SectionItemRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return match ($this->route('section')) {
            'experiences' => [
                'period'   => ['nullable', 'string', 'max:100'],
                'role'     => ['required', 'string', 'max:255'],
                'company'  => ['required', 'string', 'max:255'],
                'location' => ['nullable', 'string', 'max:255'],
                'desc'     => ['nullable', 'string', 'max:2000'],
                'tags'     => ['nullable', 'array'],
                'tags.*'   => ['string', 'max:100'],
                'current'  => ['nullable', 'boolean'],
            ],
            'projects' => [
                'title'    => ['required', 'string', 'max:255'],
                'desc'     => ['nullable', 'string', 'max:2000'],
                'tags'     => ['nullable', 'array'],
                'tags.*'   => ['string', 'max:100'],
                'category' => ['nullable', 'string', 'max:100'],
                'icon'     => ['nullable', 'string', 'max:100'],
                'color'    => ['nullable', 'string', 'max:50'],
                'link'     => ['nullable', 'url'],
            ],
            'education' => [
                'year'     => ['nullable', 'string', 'max:50'],
                'degree'   => ['required', 'string', 'max:255'],
                'school'   => ['required', 'string', 'max:255'],
                'location' => ['nullable', 'string', 'max:255'],
            ],
            default => [],
        };
    }

    public function messages(): array
    {
        return [
            'role.required'    => 'Le poste/rôle est obligatoire.',
            'company.required' => "Le nom de l'entreprise est obligatoire.",
            'title.required'   => 'Le titre du projet est obligatoire.',
            'degree.required'  => 'Le diplôme est obligatoire.',
            'school.required'  => "Le nom de l'établissement est obligatoire.",
            'link.url'         => 'Le lien doit être une URL valide (https://...).',
        ];
    }
}
