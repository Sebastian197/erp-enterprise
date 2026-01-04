<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Update Category Costs Request
 */
class UpdateCategoryCostsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('categories.update');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'hourly_rate_pvp' => ['required', 'numeric', 'min:0'],
            'hourly_rate_pc' => ['required', 'numeric', 'min:0'],
            'overtime_rate_pvp' => ['required', 'numeric', 'min:0'],
            'overtime_rate_pc' => ['required', 'numeric', 'min:0'],
            'holiday_rate_pvp' => ['required', 'numeric', 'min:0'],
            'holiday_rate_pc' => ['required', 'numeric', 'min:0'],
            'daily_rate_pvp' => ['required', 'numeric', 'min:0'],
            'daily_rate_pc' => ['required', 'numeric', 'min:0'],
            'daily_minimum_hours' => ['required', 'integer', 'min:1', 'max:24'],
            'currency' => ['sometimes', 'string', 'size:3'],
            'valid_from' => ['required', 'date'],
            'valid_to' => ['nullable', 'date', 'after:valid_from'],
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
            'hourly_rate_pvp.required' => 'Hourly rate (PVP) is required.',
            'hourly_rate_pc.required' => 'Hourly rate (PC) is required.',
            'valid_from.required' => 'Valid from date is required.',
            'valid_to.after' => 'Valid to date must be after valid from date.',
        ];
    }
}