<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContributionFormResource extends JsonResource
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
            'platform_name' => $this->platform_name,
            'logo' => $this->logo ? asset('storage/' . $this->logo) : null,
            'email' => $this->email,
            'phone_number' => $this->phone_number,
            'content' => $this->content,
            'status' => $this->status
        ];
    }
}
