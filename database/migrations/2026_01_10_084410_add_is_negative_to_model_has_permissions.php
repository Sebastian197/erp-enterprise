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
        Schema::table('model_has_permissions', function (Blueprint $table) {
            $table->boolean('is_negative')->default(false)->after('permission_id')
                ->comment('True if permission is explicitly denied (negative permission)');

            // Add index for performance
            $table->index(['model_id', 'model_type', 'is_negative'], 'model_permissions_negative_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('model_has_permissions', function (Blueprint $table) {
            $table->dropIndex('model_permissions_negative_index');
            $table->dropColumn('is_negative');
        });
    }
};
