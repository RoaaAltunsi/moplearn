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
        Schema::create('contribution_form', function (Blueprint $table) {
            $table -> id();
            $table -> string('platform_name');
            $table -> string('logo') -> nullable();
            $table -> string('email');
            $table -> string('phone_number') -> nullable();
            $table -> text('content');
            $table -> enum('status', ['pending', 'accepted', 'rejected']) -> default('pending');
            $table -> timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contribution_form');
    }
};
