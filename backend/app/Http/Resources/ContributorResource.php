<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContributorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'form_id' => $this->contributionForm->id,
            'platform_name' => $this->contributionForm->platform_name,
            'logo' => $this->contributionForm->logo ? asset('storage/' . $this->contributionForm->logo) : null,
            'email' => $this->contributionForm->email,
            'phone_number' => $this->contributionForm->phone_number
        ];
    }
}
