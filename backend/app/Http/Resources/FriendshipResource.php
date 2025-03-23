<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class FriendshipResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Get the current authenticated user ID
        $authUserId = Auth::id();

        // Decide whether to show the sender or receiver
        $friend = $this->sender_id === $authUserId ? $this->receiver : $this->sender;

        return [
            'id' => $this->id,
            'status' => $this->status,

            // Include user summary (either sender or receiver)
            'user' => new UserSummaryResource($friend),
        ];
    }
}
