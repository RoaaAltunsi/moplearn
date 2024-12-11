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
        Schema::create('courses', function (Blueprint $table) {
            $table -> id();
            $table -> string('title');
            $table -> string('image') -> nullable();
            $table -> string('link');
            $table -> enum('level', ['beginner', 'intermediate', 'expert']) ->nullable();
            $table -> float('rating') -> nullable();
            $table -> integer('total_reviews') -> nullable();
            $table -> decimal('price', 8, 2);
            $table -> decimal('old_price', 8, 2) -> nullable();
            $table -> foreignId('language_id') -> constrained('languages') -> cascadeOnDelete();
            $table -> foreignId('category_id') -> constrained('categories') -> cascadeOnDelete();
            $table -> foreignId('topic_id') -> constrained('topics') -> cascadeOnDelete();
            $table -> foreignId('platform_id') -> constrained('contributors') -> cascadeOnDelete();
            $table -> timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
