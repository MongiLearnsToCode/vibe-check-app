<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Relationship;
use App\Models\Vibe;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VibeCheckTest extends TestCase
{
    use RefreshDatabase;

    public function test_vibe_check_endpoint_returns_false_when_no_vibe_submitted()
    {
        $user = User::factory()->create();
        $relationship = Relationship::factory()->create();
        $relationship->users()->attach($user);

        $response = $this->actingAs($user)->get('/api/vibes/check');

        $response->assertStatus(200);
        $response->assertJson(['submitted' => false]);
    }

    public function test_vibe_check_endpoint_returns_true_when_vibe_submitted_today()
    {
        $user = User::factory()->create();
        $relationship = Relationship::factory()->create();
        $relationship->users()->attach($user);

        Vibe::factory()->create([
            'user_id' => $user->id,
            'relationship_id' => $relationship->id,
            'created_at' => now(),
        ]);

        $response = $this->actingAs($user)->get('/api/vibes/check');

        $response->assertStatus(200);
        $response->assertJson(['submitted' => true]);
    }

    public function test_vibe_check_endpoint_returns_false_when_vibe_submitted_yesterday()
    {
        $user = User::factory()->create();
        $relationship = Relationship::factory()->create();
        $relationship->users()->attach($user);

        Vibe::factory()->create([
            'user_id' => $user->id,
            'relationship_id' => $relationship->id,
            'created_at' => now()->subDay(),
        ]);

        $response = $this->actingAs($user)->get('/api/vibes/check');

        $response->assertStatus(200);
        $response->assertJson(['submitted' => false]);
    }
}