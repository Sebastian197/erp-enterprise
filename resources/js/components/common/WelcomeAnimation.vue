<template>
  <transition
    enter-active-class="transition duration-500 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-700 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-110"
  >
    <div
      v-if="visible"
      :class="[
        'fixed inset-y-0 right-0 z-50 flex items-center justify-center bg-themed-secondary transition-all duration-300',
        sidebarCollapsed ? 'lg:left-20' : 'lg:left-64',
        'left-0'
      ]"
    >
      <!-- Animated Background Gradient -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 animate-pulse"></div>

        <!-- Floating Particles -->
        <div class="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-ping opacity-75"></div>
        <div class="absolute top-1/3 right-1/3 w-3 h-3 bg-secondary rounded-full animate-ping opacity-50" style="animation-delay: 0.3s"></div>
        <div class="absolute bottom-1/3 left-1/3 w-2 h-2 bg-primary rounded-full animate-ping opacity-60" style="animation-delay: 0.6s"></div>
        <div class="absolute bottom-1/4 right-1/4 w-3 h-3 bg-secondary rounded-full animate-ping opacity-40" style="animation-delay: 0.9s"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 text-center px-6">
        <!-- Logo/Icon -->
        <div
          class="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl mb-6 shadow-2xl shadow-primary/50 animate-bounce"
          style="animation-duration: 2s"
        >
          <i class="fas fa-building text-white text-3xl"></i>
        </div>

        <!-- Typed Text -->
        <div class="mb-4">
          <h1
            ref="typedElement"
            class="text-4xl md:text-5xl lg:text-6xl font-bold text-themed-primary mb-2"
          ></h1>
        </div>

        <!-- Subtitle with fade in -->
        <p
          v-if="showSubtitle"
          class="text-lg md:text-xl text-themed-secondary animate-fadeIn"
        >
          {{ subtitle }}
        </p>

        <!-- Loading Dots -->
        <div class="flex justify-center space-x-2 mt-8">
          <div
            v-for="i in 3"
            :key="i"
            class="w-3 h-3 bg-primary rounded-full animate-bounce"
            :style="`animation-delay: ${i * 0.15}s`"
          ></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Typed from 'typed.js';

const props = defineProps({
  text: {
    type: String,
    default: 'Bienvenido de nuevo',
  },
  subtitle: {
    type: String,
    default: 'Cargando tu experiencia...',
  },
  duration: {
    type: Number,
    default: 2000, // 2 seconds
  },
  sidebarCollapsed: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['complete']);

const visible = ref(true);
const showSubtitle = ref(false);
const typedElement = ref(null);
let typed = null;

onMounted(() => {
  // Initialize Typed.js
  typed = new Typed(typedElement.value, {
    strings: [props.text],
    typeSpeed: 60,
    showCursor: true,
    cursorChar: '|',
    onComplete: () => {
      showSubtitle.value = true;

      // Hide after duration
      setTimeout(() => {
        visible.value = false;

        // Emit complete event after fade out animation
        setTimeout(() => {
          emit('complete');
        }, 700); // Match leave-active-class duration
      }, props.duration);
    },
  });
});

onUnmounted(() => {
  if (typed) {
    typed.destroy();
  }
});
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out forwards;
}
</style>
