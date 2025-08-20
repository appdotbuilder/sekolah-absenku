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
        Schema::create('classes', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique()->comment('Class name (e.g., X-A, XI-IPA-1)');
            $table->string('grade')->comment('Grade level (e.g., X, XI, XII)');
            $table->string('major')->nullable()->comment('Major/specialization (e.g., IPA, IPS, Bahasa)');
            $table->foreignId('homeroom_teacher_id')->nullable()->constrained('users');
            $table->integer('capacity')->default(30)->comment('Maximum students');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('grade');
            $table->index('major');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classes');
    }
};