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
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date')->comment('Attendance date');
            $table->enum('status', ['hadir', 'izin', 'sakit', 'alpha'])->default('alpha')->comment('Attendance status');
            $table->time('check_in')->nullable()->comment('Check in time');
            $table->time('check_out')->nullable()->comment('Check out time');
            $table->text('notes')->nullable()->comment('Additional notes from teacher');
            $table->foreignId('marked_by')->nullable()->constrained('users');
            $table->timestamps();
            
            // Unique constraint to prevent duplicate attendance for same date
            $table->unique(['user_id', 'date']);
            
            // Indexes for performance
            $table->index(['user_id', 'date']);
            $table->index('status');
            $table->index('date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};