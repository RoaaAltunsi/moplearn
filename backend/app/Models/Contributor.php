<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contributor extends Model
{
    use HasFactory;

    protected $fillable = [
        'form_id'
    ];

    // Define relationships
    public function contributionForm()
    {
        return $this->belongsTo(ContributionForm::class, 'form_id');
    }

    public function getPlatformNameAttribute()
    {
        return $this->contributionForm ? $this->contributionForm->platform_name : null;
    }
}
