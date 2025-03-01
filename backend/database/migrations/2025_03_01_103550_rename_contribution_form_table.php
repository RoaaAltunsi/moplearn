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
        Schema::rename('contribution_form', 'contribution_forms');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::rename('contribution_forms', 'contribution_form');
    }
};
