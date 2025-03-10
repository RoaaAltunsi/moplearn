<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
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
            'title' => $this->title,
            'image' => $this->image,
            'link' => $this->link,
            'level' => $this->level,
            'rating' => $this->rating,
            'total_reviews' => $this->total_reviews,
            'price' => $this->price,
            'old_price' => $this->old_price,
            'language' => $this->language 
            ?   [
                'id' => $this->language->id ,
                'language' => $this->language->language
                ] 
            : null,
            'category' => $this->category 
            ?   [
                'id' => $this->category->id ,
                'title' => $this->category->title
                ] 
            : null,
            'topic' => $this->topic
            ?   [
                'id' => $this->topic->id ,
                'title' => $this->topic->title
                ] 
            : null,
            'platform' => $this->contributor
            ?   [
                'id' => $this->contributor->id ,
                'platform_name' => $this->contributor->platformName
                ] 
            : null,
            'created_at' => $this->created_at
        ];
    }
}
