<template>
  <div class="auth-background min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
    <!-- Canvas for Network Effect -->
    <canvas ref="canvas" class="particle-canvas"></canvas>

    <div class="w-full max-w-md relative z-10">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-4 shadow-2xl shadow-primary-500/50">
          <i class="fas fa-cube text-white text-2xl"></i>
        </div>
        <h1 class="text-2xl font-bold text-white drop-shadow-lg">{{ appName }}</h1>
        <p class="text-gray-300 mt-1 drop-shadow">{{ $t('auth.welcome_message') }}</p>
      </div>

      <!-- Main Content -->
      <router-view v-slot="{ Component }">
        <transition
          mode="out-in"
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <component :is="Component" />
        </transition>
      </router-view>

      <!-- Language Switcher -->
      <div class="mt-6 text-center">
        <LanguageSwitcher />
      </div>

      <!-- Footer -->
      <div class="mt-8 text-center text-xs text-gray-400">
        <p>&copy; {{ currentYear }} {{ appName }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { APP } from '@/utils/constants';
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue';

const appName = computed(() => APP.NAME);
const currentYear = computed(() => new Date().getFullYear());

const canvas = ref(null);
let animationId = null;
let particles = [];
let mouse = { x: null, y: null, radius: 150 };

class Particle {
  constructor(x, y, canvas) {
    this.x = x;
    this.y = y;
    this.canvas = canvas;
    this.baseX = x;
    this.baseY = y;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.radius = Math.random() * 2 + 1;
    this.opacity = Math.random() * 0.5 + 0.5;
  }

  update() {
    // Move towards mouse if close
    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        const force = (mouse.radius - distance) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        this.vx -= Math.cos(angle) * force * 0.1;
        this.vy -= Math.sin(angle) * force * 0.1;
      }
    }

    this.x += this.vx;
    this.y += this.vy;

    // Bounce off edges
    if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;

    // Apply friction
    this.vx *= 0.99;
    this.vy *= 0.99;

    // Pull back to base position gently
    const dxBase = this.baseX - this.x;
    const dyBase = this.baseY - this.y;
    this.vx += dxBase * 0.001;
    this.vy += dyBase * 0.001;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`;
    ctx.fill();

    // Glow effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(59, 130, 246, 0.8)';
  }
}

const initParticles = () => {
  const canvasEl = canvas.value;
  if (!canvasEl) return;

  canvasEl.width = window.innerWidth;
  canvasEl.height = window.innerHeight;

  particles = [];
  const particleCount = Math.floor((canvasEl.width * canvasEl.height) / 15000);

  for (let i = 0; i < particleCount; i++) {
    particles.push(
      new Particle(
        Math.random() * canvasEl.width,
        Math.random() * canvasEl.height,
        canvasEl
      )
    );
  }
};

const drawConnections = (ctx) => {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 120) {
        const opacity = (1 - distance / 120) * 0.3;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
};

const drawMouseConnections = (ctx) => {
  if (mouse.x === null || mouse.y === null) return;

  // Draw mouse cursor highlight
  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, 5, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
  ctx.fill();
  ctx.shadowBlur = 20;
  ctx.shadowColor = 'rgba(59, 130, 246, 1)';

  // Draw connections from mouse to nearby particles
  particles.forEach(particle => {
    const dx = mouse.x - particle.x;
    const dy = mouse.y - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouse.radius) {
      const opacity = (1 - distance / mouse.radius) * 0.5;
      ctx.beginPath();
      ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
      ctx.lineWidth = 1;
      ctx.moveTo(mouse.x, mouse.y);
      ctx.lineTo(particle.x, particle.y);
      ctx.stroke();
    }
  });

  ctx.shadowBlur = 0;
};

const animate = () => {
  const ctx = canvas.value?.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

  particles.forEach(particle => {
    particle.update();
    particle.draw(ctx);
  });

  drawConnections(ctx);
  drawMouseConnections(ctx);

  animationId = requestAnimationFrame(animate);
};

const handleResize = () => {
  initParticles();
};

const handleMouseMove = (e) => {
  const rect = canvas.value?.getBoundingClientRect();
  if (rect) {
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }
};

const handleMouseLeave = () => {
  mouse.x = null;
  mouse.y = null;
};

onMounted(() => {
  initParticles();
  animate();
  window.addEventListener('resize', handleResize);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseleave', handleMouseLeave);
});

onBeforeUnmount(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseleave', handleMouseLeave);
});
</script>

<style scoped>
.auth-background {
  background: linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #1e293b 100%);
  position: relative;
}

.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}
</style>
