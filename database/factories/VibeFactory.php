<?php

namespace Database\Factories;

use App\Models\Vibe;
use Illuminate\Database\Eloquent\Factories\Factory;

class VibeFactory extends Factory
{
    protected $model = Vibe::class;

    public function definition()
    {
        return [
            'mood' => $this->faker->numberBetween(1, 5),
            'note' => $this->faker->sentence,
            'date' => $this->faker->date,
        ];
    }
}