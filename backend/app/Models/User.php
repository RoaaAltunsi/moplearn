<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
// use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the profile associated with the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function profile() 
    {
        return $this -> hasOne(UserProfile::class);
    }

    public function languages()
    {
        return $this->belongsToMany(Language::class, 'user_languages', 'user_id', 'language_id');
    }

    public function interests()
    {
        return $this->belongsToMany(Topic::class, 'user_interests', 'user_id', 'topic_id');
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'partners_list', 'user_id', 'course_id');
    }

    public function sentFriendships()
    {
        return $this->hasMany(Friendship::class, 'sender_id');
    }

    public function receivedFriendships()
    {
        return $this->hasMany(Friendship::class, 'receiver_id');
    }

    // friendship that I started
    public function friendsOfMine()
    {
        return $this->belongsToMany(User::class, 'friendship', 'sender_id', 'receiver_id')
            ->wherePivot('status', 'accepted')
            ->withPivot('status');
    }

    // friendship that I was invited to 
    public function friendsOf()
    {
        return $this->belongsToMany(User::class, 'friendship', 'receiver_id', 'sender_id')
            ->wherePivot('status', 'accepted')
            ->withPivot('status');
    }

    // Accessor: use $user->friends to get all accepted friends
    public function getFriendsAttribute()
    {
        return $this->friendsOfMine->merge($this->friendsOf);
    }
}
