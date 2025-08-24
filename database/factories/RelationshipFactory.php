<?php

namespace Database\Factories;

use App\Models\Relationship;
use Illuminate\Database\Eloquent\Factories\Factory;

class RelationshipFactory extends Factory
{
    protected $model = Relationship::class;

    public function definition()
    {
        return [
            'code' => $this->faker->unique()->word,
        ];
    }
}