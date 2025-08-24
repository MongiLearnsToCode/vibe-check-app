<?php

use App\Http\Controllers\RelationshipController;
use App\Http\Controllers\VibeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/relationships', [RelationshipController::class, 'store'])->name('relationships.store');
    Route::post('/relationships/join', [RelationshipController::class, 'join'])->name('relationships.join');
    Route::get('/relationships/mine', [RelationshipController::class, 'show'])->name('relationships.show');

    Route::post('/vibes', [VibeController::class, 'store'])->name('vibes.store');
    Route::get('/vibes/check', [VibeController::class, 'check'])->name('vibes.check');
    Route::get('/vibes/{relationship}', [VibeController::class, 'index'])->name('vibes.index');
});
