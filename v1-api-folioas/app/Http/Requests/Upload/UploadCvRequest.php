<?php

namespace App\Http\Requests\Upload;

use Illuminate\Foundation\Http\FormRequest;

class UploadCvRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $maxKb = (int) config('portfolio.upload_max_kb', 5120);

        return [
            'file' => ['required', 'file', "max:{$maxKb}", 'mimes:pdf'],
        ];
    }

    public function messages(): array
    {
        return [
            'file.required' => 'Aucun fichier fourni.',
            'file.mimes' => 'Le CV doit être un fichier PDF.',
            'file.max' => 'Le fichier ne doit pas dépasser 5 Mo.',
        ];
    }
}
