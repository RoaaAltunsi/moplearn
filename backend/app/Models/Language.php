<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Language extends Model
{
    use HasFactory;

    protected $fillable = [
        'language'
    ];

    // Define relationships
    public function courses()
    {
        return $this->hasMany(Course::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_languages', 'language_id', 'user_id');
    }
}
