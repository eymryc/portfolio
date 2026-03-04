<?php

namespace App\Http\Requests\Domain;

use Illuminate\Foundation\Http\FormRequest;

class StoreDomainRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'domain' => [
                'required',
                'string',
                'max:253',
                'unique:domains,domain',
                'regex:/^(?!-)([a-zA-Z0-9\-]{1,63}\.)+[a-zA-Z]{2,}$/',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'domain.regex'  => 'Format invalide. Exemple valide : cv.mondomaine.com',
            'domain.unique' => 'Ce domaine est déjà enregistré sur la plateforme.',
        ];
    }
}
