<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContributionForm extends Model
{
    use HasFactory;

    protected $fillable = [
        'platform_name',
        'logo',
        'email',
        'phone_number',
        'content',
        'status'
    ];

    // Define relationship
    public function contributor() 
    {
        return $this->hasOne(Contributor::class, 'form_id')->whereHas('ContributionForm', function($query) {
            $query->where('status', 'approved');
        });
    }
}
