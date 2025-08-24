<?php

namespace App\Http\Controllers;

use App\Models\Relationship;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RelationshipController extends Controller
{
    public function store(Request $request)
    {
        $user = Auth::user();

        if ($user->relationships()->exists()) {
            return response()->json(['message' => 'You are already in a relationship.'], 400);
        }

        $relationship = Relationship::create();
        $relationship->users()->attach($user);

        return response()->json($relationship->fresh(), 201);
    }

    public function join(Request $request)
    {
        $request->validate([
            'code' => 'required|string|exists:relationships,code',
        ]);

        $user = Auth::user();
        $relationship = Relationship::where('code', $request->code)->first();

        if ($relationship->users()->count() >= 2) {
            return response()->json(['message' => 'This relationship is full.'], 400);
        }

        if ($user->relationships()->exists()) {
            return response()->json(['message' => 'You are already in a relationship.'], 400);
        }
        
        if ($relationship->users()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'You are already in this relationship.'], 400);
        }

        $relationship->users()->attach($user);

        return response()->json($relationship->load('users'));
    }

    public function show(Request $request)
    {
        $user = Auth::user();
        $relationship = $user->relationships()->first();

        if (!$relationship) {
            return response()->json(['message' => 'You are not in a relationship.'], 404);
        }

        return response()->json($relationship->load('users'));
    }
}
