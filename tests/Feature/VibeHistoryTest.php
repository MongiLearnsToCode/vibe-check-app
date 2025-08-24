<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Relationship;
use App\Models\Vibe;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VibeHistoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_vibe_history_endpoint_returns_formatted_data()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $relationship = Relationship::factory()->create();
        $relationship->users()->attach([$user1->id, $user2->id]);

        // Create vibes for the past 7 days
        for ($i = 0; $i < 7; $i++) {
            Vibe::factory()->create([
                'user_id' => $user1->id,
                'relationship_id' => $relationship->id,
                'mood' => 3,
                'note' => 'User 1 note ' . $i,
                'date' => now()->subDays($i),
                'created_at' => now()->subDays($i),
            ]);

            Vibe::factory()->create([
                'user_id' => $user2->id,
                'relationship_id' => $relationship->id,
                'mood' => 4,
                'note' => 'User 2 note ' . $i,
                'date' => now()->subDays($i),
                'created_at' => now()->subDays($i),
            ]);
        }

        $response = $this->actingAs($user1)->get("/api/vibes/{$relationship->id}");

        $response->assertStatus(200);
        $responseData = $response->json();

        // Should have 7 days of data
        $this->assertCount(7, $responseData);

        // Check the structure of the first entry
        $this->assertArrayHasKey('date', $responseData[0]);
        $this->assertArrayHasKey($user1->id, $responseData[0]);
        $this->assertArrayHasKey($user2->id, $responseData[0]);
        
        // Check that the data is properly formatted
        $this->assertEquals(3, $responseData[0][$user1->id]['mood']);
        $this->assertEquals('User 1 note 0', $responseData[0][$user1->id]['note']);
        $this->assertEquals(4, $responseData[0][$user2->id]['mood']);
        $this->assertEquals('User 2 note 0', $responseData[0][$user2->id]['note']);
    }
}