<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Relationship extends Model
{
    use HasFactory;

    protected $fillable = ['code'];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($relationship) {
            $relationship->code = Str::random(8);
        });
    }

    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    public function vibes()
    {
        return $this->hasMany(Vibe::class);
    }
}
