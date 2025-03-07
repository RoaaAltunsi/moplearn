<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Translation\FileLoader;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
    ];

    // Define relationships
    public function topics() {
        return $this->hasMany(Topic::class);
    }
}
