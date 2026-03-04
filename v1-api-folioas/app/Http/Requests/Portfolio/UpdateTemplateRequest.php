<?php

namespace App\Http\Requests\Portfolio;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTemplateRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'template_id'      => ['required', 'string', 'max:50'],
            'template_version' => ['nullable', 'string', 'max:20'],
        ];
    }
}
