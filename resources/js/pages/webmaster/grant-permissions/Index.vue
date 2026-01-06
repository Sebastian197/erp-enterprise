<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <i class="fas fa-user-shield text-primary text-xl"></i>
        </div>
        <div>
          <h1 class="text-3xl font-bold text-themed">
            {{ $t('webmaster.grant_permissions') }}
          </h1>
          <p class="text-sm text-themed-secondary mt-1">
            {{ $t('webmaster.title') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Content Card -->
    <div class="bg-card rounded-xl shadow-sm border border-themed p-8">
      <div class="text-center py-12">
        <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-user-shield text-primary text-3xl"></i>
        </div>
        <h3 class="text-xl font-semibold text-themed mb-2">
          Módulo de Dar Permisos
        </h3>
        <p class="text-themed-secondary max-w-md mx-auto">
          Este módulo permitirá asignar y otorgar permisos específicos a usuarios y roles,
          gestionar el acceso granular a funcionalidades del sistema y administrar
          los privilegios de manera flexible y segura.
        </p>
        <div class="mt-6 p-4 bg-info/10 rounded-lg max-w-md mx-auto">
          <p class="text-sm text-themed">
            <i class="fas fa-info-circle mr-2"></i>
            Módulo en desarrollo
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Grant Permissions Index Page
 * Manages granting and assigning permissions to users and roles
 */
</script>
