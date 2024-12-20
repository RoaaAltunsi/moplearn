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
        Schema::create('user_languages', function (Blueprint $table) {
            $table -> id();
            $table -> foreignId('user_id') -> constrained('users') -> cascadeOnDelete();
            $table -> foreignId('language_id') -> constrained('languages') -> cascadeOnDelete();
            $table -> timestamps();

            $table -> unique(['user_id', 'language_id'], 'unique_user_language'); // Composite unique constraint
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_languages');
    }
};
