<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserFullResource extends JsonResource
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
            'email' => $this->email,
            'username' => $this->username,
            'full_name' => $this->profile?->full_name,
            'specialization' => $this->profile?->specialization,
            'image' => $this->profile?->image? asset('storage/'. $this->profile?->image) : null,
            'profile_background' => $this->profile?->profile_background? asset('storage/'. $this->profile?->profile_background) : null,
            'location' => $this->profile?->location,
            'bio' => $this->profile?->bio,
            'languages' => $this->languages->pluck('language', 'id')->map(fn ($name, $id) => [
                'id' => $id,
                'language' => $name,
            ])->values(),
            'interests' => $this->interests->pluck('title', 'id')->map(fn ($title, $id) => [
                'id' => $id,
                'title' => $title,
            ])->values(),
        ];
    }
}
