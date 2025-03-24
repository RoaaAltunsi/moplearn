<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FriendshipResource extends JsonResource
{
    protected $viewingUserId;

    public function __construct($resource, $viewingUserId = null)
    {
        parent::__construct($resource);
        $this->viewingUserId = $viewingUserId;
    }

    public function toArray(Request $request): array
    {
        // Get the user who is NOT the viewer
        $friend = $this->sender_id == $this->viewingUserId
            ? $this->receiver
            : $this->sender;

        return [
            'id' => $this->id,
            'status' => $this->status,

            // Include user summary (either sender or receiver)
            'user' => new UserSummaryResource($friend),
        ];
    }
}