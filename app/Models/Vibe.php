<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vibe extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'relationship_id',
        'mood',
        'note',
        'date',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($vibe) {
            if (empty($vibe->date)) {
                $vibe->date = $vibe->created_at ?? now()->toDateString();
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function relationship()
    {
        return $this->belongsTo(Relationship::class);
    }
}
