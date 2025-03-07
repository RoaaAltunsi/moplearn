<?php

namespace App\Models;

use Carbon\Language;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'image',
        'link',
        'level',
        'rating',
        'total_reviews',
        'price',
        'old_price',
        'language_id',
        'category_id',
        'topic_id',
        'platform_id',
    ];

    // Define relationships
    public function topic()
    {
        return $this->belongsTo(Topic::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function contributor()
    {
        return $this->belongsTo(Contributor::class);
    }

    public function language()
    {
        return $this->belongsTo(Language::class);
    }
}
