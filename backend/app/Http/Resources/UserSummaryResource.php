<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserSummaryResource extends JsonResource
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
            'username' => $this->username,
            'full_name' => $this->profile?->full_name,
            'specialization' => $this->profile?->specialization,
            'image' => $this->profile?->image ? asset('storage/' . $this->profile?->image) : null,
            'interests' => $this->whenLoaded('interests', fn () =>
                $this->interests->pluck('title', 'id')->map(fn ($title, $id) => [
                    'id' => $id,
                    'title' => $title,
                ])->values()
            ),
        ];
    }
}
