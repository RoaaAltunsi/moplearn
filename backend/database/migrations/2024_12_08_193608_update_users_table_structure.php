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
        Schema::table('users', function (Blueprint $table) {
            $table -> dropColumn('name');
            $table -> string('username') -> unique();
            $table -> string('full_name') -> nullable();
            $table -> enum('gender', ['male', 'female']) -> nullable() -> after('password');
            $table -> string('specialization') -> nullable();
            $table -> string('image') -> nullable();
            $table -> string('profile_background') -> nullable();
            $table -> string('location') -> nullable();
            $table -> text('bio') -> nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function(Blueprint $table) {
            $table -> string('name');
            $table -> dropColumn(([
                'username',
                'full_name',
                'gender',
                'specialization',
                'image',
                'profile_background',
                'location',
                'bio'
            ]));
        });
    }
};
