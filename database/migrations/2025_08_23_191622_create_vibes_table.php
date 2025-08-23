<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vibes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('relationship_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->tinyInteger('mood');
            $table->string('note', 140)->nullable();
            $table->date('date');
            $table->timestamps();

            $table->index(['date', 'relationship_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vibes');
    }
};
