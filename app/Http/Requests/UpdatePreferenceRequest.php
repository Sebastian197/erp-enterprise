<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Update Preference Request
 */
class UpdatePreferenceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'locale' => ['sometimes', 'string', 'in:en,es,fr,de'],
            'theme_id' => ['sometimes', 'nullable', 'integer', 'exists:themes,id'],
            'timezone' => ['sometimes', 'string', 'timezone'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'locale.in' => 'Selected locale is not supported.',
            'theme_id.exists' => 'Selected theme does not exist.',
            'timezone.timezone' => 'Invalid timezone.',
        ];
    }
}