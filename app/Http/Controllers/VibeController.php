<?php

namespace App\Http\Controllers;

use App\Models\Relationship;
use App\Models\Vibe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;

class VibeController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'mood' => 'required|integer|min:1|max:5',
            'note' => 'nullable|string|max:140',
        ]);

        $user = Auth::user();
        $relationship = $user->relationships()->first();

        if (!$relationship) {
            return response()->json(['message' => 'You are not in a relationship.'], 400);
        }

        $existingVibe = Vibe::where('user_id', $user->id)
            ->where('relationship_id', $relationship->id)
            ->whereDate('created_at', today())
            ->exists();

        if ($existingVibe) {
            return response()->json(['message' => 'You have already submitted your vibe for today.'], 409);
        }

        $vibe = Vibe::create([
            'user_id' => $user->id,
            'relationship_id' => $relationship->id,
            'mood' => $request->mood,
            'note' => $request->note,
            'date' => today(),
        ]);

        return response()->json($vibe, 201);
    }

    public function check(Request $request)
    {
        $user = Auth::user();
        $relationship = $user->relationships()->first();

        if (!$relationship) {
            return response()->json(['submitted' => false]);
        }

        $existingVibe = Vibe::where('user_id', $user->id)
            ->where('relationship_id', $relationship->id)
            ->whereDate('created_at', today())
            ->exists();

        return response()->json(['submitted' => $existingVibe]);
    }

    public function index(Relationship $relationship)
    {
        // Check if the authenticated user belongs to this relationship
        $user = Auth::user();
        if (!$relationship->users->contains($user)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $vibes = Vibe::where('relationship_id', $relationship->id)
            ->where('date', '>=', today()->subDays(7))
            ->orderBy('date', 'desc')
            ->get();

        $users = $relationship->users;
        $userA = $users->get(0);
        $userB = $users->get(1);

        $formattedVibes = $vibes->groupBy('date')->map(function ($dayVibes) use ($userA, $userB) {
            $vibeA = $dayVibes->firstWhere('user_id', $userA->id);
            $vibeB = $dayVibes->firstWhere('user_id', $userB->id);

            return [
                'date' => $dayVibes->first()->date->format('Y-m-d'),
                $userA->id => $vibeA ? ['mood' => $vibeA->mood, 'note' => $vibeA->note] : null,
                $userB->id => $vibeB ? ['mood' => $vibeB->mood, 'note' => $vibeB->note] : null,
            ];
        })->values();

        return response()->json($formattedVibes);
    }
}
