<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Relationship;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RelationshipTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_relationship()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/api/relationships');

        $response->assertStatus(201);
        $this->assertDatabaseHas('relationships', [
            'id' => $response->json('id'),
        ]);
        $this->assertDatabaseHas('relationship_user', [
            'relationship_id' => $response->json('id'),
            'user_id' => $user->id,
        ]);
    }

    public function test_user_can_join_relationship()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $relationship = Relationship::factory()->create();
        $relationship->users()->attach($user1);

        $response = $this->actingAs($user2)->post('/api/relationships/join', [
            'code' => $relationship->code,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('relationship_user', [
            'relationship_id' => $relationship->id,
            'user_id' => $user2->id,
        ]);
    }

    public function test_user_cannot_join_full_relationship()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $user3 = User::factory()->create();
        $relationship = Relationship::factory()->create();
        $relationship->users()->attach([$user1->id, $user2->id]);

        $response = $this->actingAs($user3)->post('/api/relationships/join', [
            'code' => $relationship->code,
        ]);

        $response->assertStatus(400);
        $response->assertJson(['message' => 'This relationship is full.']);
    }
}