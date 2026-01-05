<template>
  <div class="mesh-gradient-container">
    <div class="mesh-gradient">
      <!-- Gradient orbs -->
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
      <div class="orb orb-4"></div>

      <!-- Additional accent shapes -->
      <div class="accent accent-1"></div>
      <div class="accent accent-2"></div>
      <div class="accent accent-3"></div>
    </div>
    <div v-if="showOverlay" class="mesh-overlay"></div>
  </div>
</template>

<script setup>
/**
 * MeshGradient Component
 * Creates a beautiful fluid mesh gradient background
 * Modern design with flowing orbs and accent shapes
 */

defineProps({
  showOverlay: {
    type: Boolean,
    default: true,
  },
});
</script>

<style scoped>
.mesh-gradient-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.mesh-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(ellipse at top left, #1e3a8a 0%, transparent 50%),
    radial-gradient(ellipse at top right, #1e293b 0%, transparent 50%),
    radial-gradient(ellipse at bottom left, #0f172a 0%, transparent 50%),
    radial-gradient(ellipse at bottom right, #1e40af 0%, transparent 50%),
    #0a0f1e;
}

/* Main gradient orbs */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.8;
  mix-blend-mode: lighten;
}

.orb-1 {
  width: 800px;
  height: 800px;
  top: -20%;
  left: -15%;
  background: radial-gradient(
    circle,
    rgba(59, 130, 246, 0.6) 0%,
    rgba(37, 99, 235, 0.4) 30%,
    rgba(29, 78, 216, 0.2) 60%,
    transparent 100%
  );
  animation: float-1 25s ease-in-out infinite;
}

.orb-2 {
  width: 700px;
  height: 700px;
  top: -10%;
  right: -10%;
  background: radial-gradient(
    circle,
    rgba(96, 165, 250, 0.5) 0%,
    rgba(59, 130, 246, 0.3) 30%,
    rgba(37, 99, 235, 0.15) 60%,
    transparent 100%
  );
  animation: float-2 20s ease-in-out infinite;
}

.orb-3 {
  width: 900px;
  height: 900px;
  bottom: -25%;
  left: 15%;
  background: radial-gradient(
    circle,
    rgba(29, 78, 216, 0.7) 0%,
    rgba(30, 64, 175, 0.4) 30%,
    rgba(30, 58, 138, 0.2) 60%,
    transparent 100%
  );
  animation: float-3 30s ease-in-out infinite;
}

.orb-4 {
  width: 650px;
  height: 650px;
  bottom: -5%;
  right: -5%;
  background: radial-gradient(
    circle,
    rgba(147, 197, 253, 0.5) 0%,
    rgba(96, 165, 250, 0.3) 30%,
    rgba(59, 130, 246, 0.15) 60%,
    transparent 100%
  );
  animation: float-4 22s ease-in-out infinite;
}

/* Accent shapes for additional depth */
.accent {
  position: absolute;
  filter: blur(40px);
  opacity: 0.5;
  mix-blend-mode: screen;
}

.accent-1 {
  width: 400px;
  height: 400px;
  top: 20%;
  left: 25%;
  background: radial-gradient(
    ellipse,
    rgba(59, 130, 246, 0.4) 0%,
    transparent 70%
  );
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  animation: morph-1 15s ease-in-out infinite;
}

.accent-2 {
  width: 350px;
  height: 350px;
  top: 50%;
  right: 20%;
  background: radial-gradient(
    ellipse,
    rgba(96, 165, 250, 0.3) 0%,
    transparent 70%
  );
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  animation: morph-2 18s ease-in-out infinite;
}

.accent-3 {
  width: 450px;
  height: 450px;
  bottom: 30%;
  left: 40%;
  background: radial-gradient(
    ellipse,
    rgba(37, 99, 235, 0.4) 0%,
    transparent 70%
  );
  border-radius: 70% 30% 50% 50% / 40% 50% 50% 60%;
  animation: morph-3 20s ease-in-out infinite;
}

.mesh-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(10, 15, 30, 0.2);
  backdrop-filter: blur(1px);
  z-index: 1;
}

/* Float animations for orbs */
@keyframes float-1 {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(50px, -80px) scale(1.1);
  }
  66% {
    transform: translate(-30px, -50px) scale(0.95);
  }
}

@keyframes float-2 {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(-60px, 70px) scale(1.15);
  }
}

@keyframes float-3 {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  40% {
    transform: translate(-40px, 60px) scale(1.05);
  }
  80% {
    transform: translate(40px, -40px) scale(0.9);
  }
}

@keyframes float-4 {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(50px, -50px) scale(1.1);
  }
}

/* Morph animations for accent shapes */
@keyframes morph-1 {
  0%, 100% {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    transform: rotate(0deg) translate(0, 0);
  }
  50% {
    border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
    transform: rotate(180deg) translate(20px, -20px);
  }
}

@keyframes morph-2 {
  0%, 100% {
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    transform: rotate(0deg) translate(0, 0);
  }
  50% {
    border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%;
    transform: rotate(-180deg) translate(-30px, 30px);
  }
}

@keyframes morph-3 {
  0%, 100% {
    border-radius: 70% 30% 50% 50% / 40% 50% 50% 60%;
    transform: rotate(0deg) scale(1);
  }
  33% {
    border-radius: 50% 50% 30% 70% / 60% 40% 60% 40%;
    transform: rotate(120deg) scale(1.1);
  }
  66% {
    border-radius: 30% 70% 70% 30% / 50% 50% 50% 50%;
    transform: rotate(240deg) scale(0.95);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .orb {
    filter: blur(50px);
  }

  .orb-1 { width: 600px; height: 600px; }
  .orb-2 { width: 500px; height: 500px; }
  .orb-3 { width: 650px; height: 650px; }
  .orb-4 { width: 450px; height: 450px; }

  .accent {
    filter: blur(30px);
  }

  .accent-1 { width: 300px; height: 300px; }
  .accent-2 { width: 250px; height: 250px; }
  .accent-3 { width: 350px; height: 350px; }
}

@media (max-width: 480px) {
  .orb {
    filter: blur(40px);
  }

  .orb-1 { width: 400px; height: 400px; }
  .orb-2 { width: 350px; height: 350px; }
  .orb-3 { width: 450px; height: 450px; }
  .orb-4 { width: 300px; height: 300px; }

  .accent {
    filter: blur(25px);
  }

  .accent-1 { width: 200px; height: 200px; }
  .accent-2 { width: 180px; height: 180px; }
  .accent-3 { width: 250px; height: 250px; }
}
</style>
