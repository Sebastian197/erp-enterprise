<template>
  <footer class="bg-navbar border-t border-navbar py-4 px-4 lg:px-6 overflow-x-hidden">
    <div class="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0 max-w-full">
      <!-- Copyright -->
      <div class="text-sm text-themed-secondary text-center md:text-left">
        {{ copyrightText }}
      </div>

      <!-- Links -->
      <div class="flex items-center space-x-4 text-sm">
        <a
          href="/privacy"
          class="text-themed-secondary hover:text-primary transition-colors"
        >
          {{ $t('footer.privacy') }}
        </a>
        <span class="text-muted">|</span>
        <a
          href="/terms"
          class="text-themed-secondary hover:text-primary transition-colors"
        >
          {{ $t('footer.terms') }}
        </a>
        <span class="text-muted">|</span>
        <a
          href="/support"
          class="text-themed-secondary hover:text-primary transition-colors"
        >
          {{ $t('footer.support') }}
        </a>
      </div>

      <!-- Version & AI Assistant Button -->
      <div class="flex items-center space-x-4">
        <div class="text-sm text-muted">
          {{ versionText }}
        </div>

        <!-- AI Assistant Button Container - Completely Isolated -->
        <div class="ai-button-wrapper">
          <div class="ai-button-container">
            <!-- Floating particles (behind everything) -->
            <div class="ai-particles">
              <span class="particle particle-1"></span>
              <span class="particle particle-2"></span>
              <span class="particle particle-3"></span>
              <span class="particle particle-4"></span>
            </div>

            <!-- Pulsating glow rings -->
            <div class="ai-glow-ring ai-glow-ring-1"></div>
            <div class="ai-glow-ring ai-glow-ring-2"></div>

            <!-- Main button -->
            <button
              @click="openAIAssistant"
              class="ai-button"
              :aria-label="$t('ai_assistant.title')"
            >
              <!-- Sparkle effect (behind icon) -->
              <div class="ai-sparkles">
                <span class="sparkle sparkle-1"></span>
                <span class="sparkle sparkle-2"></span>
                <span class="sparkle sparkle-3"></span>
              </div>

              <!-- Rotating gradient overlay (behind icon) -->
              <div class="ai-gradient-overlay"></div>

              <!-- Icon (on top) -->
              <i class="fas fa-robot text-white text-xl ai-icon"></i>

              <!-- Status indicator (on top) -->
              <span class="ai-status-indicator">
                <span class="ai-status-ping"></span>
                <span class="ai-status-dot"></span>
              </span>

              <!-- Ripple effect on hover (behind icon) -->
              <span class="ai-ripple"></span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Assistant Modal -->
    <AIAssistant v-model="isAIAssistantOpen" />
  </footer>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { APP } from '@/utils/constants';
import AIAssistant from '@/components/common/AIAssistant.vue';

/**
 * Footer Component
 * Simple footer with copyright, links, and version information
 * Features: Responsive layout, theme-aware styling, AI assistant integration
 */

const { t } = useI18n();

// State
const isAIAssistantOpen = ref(false);

// Computed
const currentYear = computed(() => new Date().getFullYear());
const copyrightText = computed(() => `© ${currentYear.value} ${APP.NAME}. ${t('footer.all_rights_reserved')}`);
const versionText = computed(() => `v${APP.VERSION}`);

/**
 * Open AI Assistant
 */
const openAIAssistant = () => {
  isAIAssistantOpen.value = true;
};
</script>

<style scoped>
/* ============================================
   AI Button - Completely Isolated Container
   NO LAYOUT SHIFT - FIXED DIMENSIONS
   ============================================ */

/* Wrapper - Fixed dimensions to prevent ANY layout shift */
.ai-button-wrapper {
  width: 60px;
  height: 48px;
  min-width: 60px;
  flex-shrink: 0;
  position: relative;
  contain: layout style;
  isolation: isolate;
  overflow: visible;
}

/* Container - All animations happen within this fixed space */
.ai-button-container {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

/* Main Button - Fixed size, centered */
.ai-button {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #8b5cf6 0%, #9333ea 50%, #ec4899 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px -5px rgba(139, 92, 246, 0.5);
  cursor: pointer;
  pointer-events: auto;
  z-index: 10;
  border: none;
  outline: none;
  transition: filter 0.3s ease;
}

.ai-button:hover {
  filter: brightness(1.2);
}

.ai-button:active {
  filter: brightness(0.9);
}

/* Icon - Smooth floating animation */
.ai-icon {
  position: relative;
  z-index: 20;
  animation: float-icon 4s ease-in-out infinite;
}

@keyframes float-icon {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-3px);
  }
}

.ai-button:hover .ai-icon {
  animation-duration: 1s;
}

/* Status Indicator */
.ai-status-indicator {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 14px;
  height: 14px;
  z-index: 30;
  pointer-events: none;
}

.ai-status-ping {
  position: absolute;
  display: inline-flex;
  height: 100%;
  width: 100%;
  border-radius: 50%;
  background-color: #10b981;
  opacity: 0.75;
  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.ai-status-dot {
  position: relative;
  display: inline-flex;
  border-radius: 50%;
  height: 14px;
  width: 14px;
  background-color: #10b981;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Glow Rings - Behind button */
.ai-glow-ring {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.4), rgba(168, 85, 247, 0.2), transparent);
  z-index: 0;
  pointer-events: none;
}

.ai-glow-ring-1 {
  animation: pulse-glow-1 3s ease-in-out infinite;
}

.ai-glow-ring-2 {
  animation: pulse-glow-2 3s ease-in-out infinite 1.5s;
}

@keyframes pulse-glow-1 {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.3);
    opacity: 0.2;
  }
}

@keyframes pulse-glow-2 {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.4;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.4);
    opacity: 0.1;
  }
}

/* Particles - Behind everything */
.ai-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: linear-gradient(135deg, #a855f7, #ec4899);
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(168, 85, 247, 0.8);
}

.particle-1 {
  bottom: 50%;
  left: 20%;
  animation: float-particle 2.5s ease-out infinite;
}

.particle-2 {
  bottom: 50%;
  right: 20%;
  animation: float-particle 2.5s ease-out infinite 0.6s;
}

.particle-3 {
  bottom: 50%;
  left: 50%;
  animation: float-particle 2.5s ease-out infinite 1.2s;
}

.particle-4 {
  bottom: 50%;
  right: 40%;
  animation: float-particle 2.5s ease-out infinite 1.8s;
}

@keyframes float-particle {
  0% {
    transform: translateY(0) scale(0);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 0.5;
  }
  100% {
    transform: translateY(-30px) scale(1);
    opacity: 0;
  }
}

.ai-button:hover ~ .ai-particles .particle {
  animation-duration: 1.5s;
}

/* Sparkles - Inside button */
.ai-sparkles {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.sparkle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
}

.sparkle-1 {
  top: 25%;
  left: 25%;
  animation: sparkle 2s ease-in-out infinite;
}

.sparkle-2 {
  top: 30%;
  right: 25%;
  animation: sparkle 2s ease-in-out infinite 0.7s;
}

.sparkle-3 {
  bottom: 30%;
  left: 30%;
  animation: sparkle 2s ease-in-out infinite 1.4s;
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Gradient Overlay - Inside button */
.ai-gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  border-radius: 50%;
  z-index: 2;
  pointer-events: none;
  animation: rotate-gradient 8s linear infinite;
}

@keyframes rotate-gradient {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Ripple Effect - Inside button on hover */
.ai-ripple {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.5);
  opacity: 0;
  pointer-events: none;
  z-index: 1;
}

.ai-button:hover .ai-ripple {
  animation: ripple 1.5s ease-out infinite;
}

@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.8);
    opacity: 0;
  }
}

/* Global cursor pointer for interactive elements */
button,
a,
[role="button"],
.cursor-pointer {
  cursor: pointer;
}
</style>