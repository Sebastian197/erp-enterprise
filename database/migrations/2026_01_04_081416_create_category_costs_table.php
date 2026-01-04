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
        Schema::create('category_costs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->unique()->constrained('categories')->onDelete('cascade');

            // Horas Normales
            $table->decimal('hourly_rate_pvp', 10, 2)->default(0)->comment('PVP hora normal');
            $table->decimal('hourly_rate_pc', 10, 2)->default(0)->comment('PC hora normal');

            // Horas Extras
            $table->decimal('overtime_rate_pvp', 10, 2)->default(0)->comment('PVP hora extra');
            $table->decimal('overtime_rate_pc', 10, 2)->default(0)->comment('PC hora extra');

            // Horas Festivas
            $table->decimal('holiday_rate_pvp', 10, 2)->default(0)->comment('PVP hora festiva');
            $table->decimal('holiday_rate_pc', 10, 2)->default(0)->comment('PC hora festiva');

            // Coste por Día
            $table->decimal('daily_rate_pvp', 10, 2)->default(0)->comment('PVP día completo');
            $table->decimal('daily_rate_pc', 10, 2)->default(0)->comment('PC día completo');
            $table->integer('daily_minimum_hours')->default(8)->comment('Mínimo de horas para tarifa diaria');

            $table->string('currency', 3)->default('EUR');
            $table->date('valid_from')->nullable();
            $table->date('valid_to')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('category_costs');
    }
};
