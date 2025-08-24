<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Relationship;
use App\Models\Vibe;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VibeSubmissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_vibe_submission_fails_when_already_submitted_today()
    {
        $user = User::factory()->create();
        $relationship = Relationship::factory()->create();
        $relationship->users()->attach($user);

        // Create a vibe for today
        Vibe::factory()->create([
            'user_id' => $user->id,
            'relationship_id' => $relationship->id,
            'created_at' => now(),
        ]);

        // Try to submit another vibe for today
        $response = $this->actingAs($user)->post('/api/vibes', [
            'mood' => 3,
            'note' => 'Test note',
        ]);

        $response->assertStatus(409);
        $response->assertJson(['message' => 'You have already submitted your vibe for today.']);
    }

    public function test_vibe_submission_succeeds_when_no_vibe_submitted_today()
    {
        $user = User::factory()->create();
        $relationship = Relationship::factory()->create();
        $relationship->users()->attach($user);

        $response = $this->actingAs($user)->post('/api/vibes', [
            'mood' => 3,
            'note' => 'Test note',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('vibes', [
            'user_id' => $user->id,
            'relationship_id' => $relationship->id,
            'mood' => 3,
            'note' => 'Test note',
        ]);
    }
}