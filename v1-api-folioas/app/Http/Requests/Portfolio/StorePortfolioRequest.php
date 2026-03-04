<?php

namespace App\Http\Requests\Portfolio;

use Illuminate\Foundation\Http\FormRequest;

class StorePortfolioRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'slug'             => ['nullable', 'string', 'max:100', 'unique:portfolios,slug', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'],
            'template_id'      => ['required', 'string', 'max:50'],
            'template_version' => ['nullable', 'string', 'max:20'],
        ];
    }

    public function messages(): array
    {
        return [
            'slug.regex'  => 'Le slug ne peut contenir que des minuscules, chiffres et tirets (ex: jean-dupont).',
            'slug.unique' => 'Ce slug est déjà utilisé, choisissez-en un autre.',
        ];
    }
}
