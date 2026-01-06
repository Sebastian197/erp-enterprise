<template>
  <div class="naval-background">
    <!-- Technical Grid -->
    <div class="technical-grid"></div>

    <!-- Animated Waves -->
    <svg class="waves" viewBox="0 0 1440 320" preserveAspectRatio="none">
      <path class="wave wave-1" d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,154.7C672,149,768,171,864,181.3C960,192,1056,192,1152,170.7C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      <path class="wave wave-2" d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,229.3C672,235,768,213,864,202.7C960,192,1056,192,1152,213.3C1248,235,1344,277,1392,298.7L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
    </svg>

    <!-- Canvas for Ship and Naval Elements -->
    <canvas ref="canvas" class="naval-canvas"></canvas>

    <!-- Mesh Gradient Base -->
    <MeshGradient :show-overlay="false" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useThemeStore } from '@/stores/theme';
import { PARTICLE_COLORS, createRGBA } from '@/utils/constants';
import MeshGradient from './MeshGradient.vue';

// Theme store
const themeStore = useThemeStore();

// Computed theme colors
const themeColors = computed(() => {
  const theme = themeStore.currentTheme;
  return PARTICLE_COLORS[theme] || PARTICLE_COLORS['default-light'];
});

const props = defineProps({
  intensity: {
    type: String,
    default: 'medium', // 'low', 'medium', 'high'
    validator: (value) => ['low', 'medium', 'high'].includes(value)
  }
});

const canvas = ref(null);
let animationId = null;
let navalElements = [];
let mouse = { x: null, y: null };

// Define quantities based on intensity
const getElementCounts = () => {
  const intensityMap = {
    low: { ships: 2, anchors: 2, gears: 3, dotsMultiplier: 0.5 },
    medium: { ships: 3, anchors: 4, gears: 5, dotsMultiplier: 1 },
    high: { ships: 6, anchors: 8, gears: 10, dotsMultiplier: 2 }
  };
  return intensityMap[props.intensity];
};

// Ship silhouette points (simplified ship profile)
const shipPath = [
  [0, 20], [10, 20], [12, 15], [18, 15], [20, 10],
  [25, 10], [27, 5], [30, 5], [32, 8], [35, 8],
  [35, 20], [45, 20], [45, 22], [0, 22]
];

// Helper functions to get theme-aware colors
const getShipColor = () => createRGBA(themeColors.value.secondary, 0.6);
const getAnchorColor = () => createRGBA(themeColors.value.primary, 0.5);
const getGearColor = () => createRGBA(themeColors.value.tertiary, 0.4);
const getDotColor = () => createRGBA(themeColors.value.primary, 0.6);
const getConnectionColor = (opacity) => createRGBA(themeColors.value.primary, opacity);
const getMouseFillColor = () => createRGBA(themeColors.value.primary, 0.4);
const getMouseStrokeColor = () => createRGBA(themeColors.value.secondary, 0.8);
const getMouseConnectionColor = (opacity) => createRGBA(themeColors.value.secondary, opacity);
const getGridColor = () => createRGBA(themeColors.value.primary, 0.03);
const getWaveColor1 = () => createRGBA(themeColors.value.primary, 0.3);
const getWaveColor2 = () => createRGBA(themeColors.value.secondary, 0.2);

class NavalElement {
  constructor(type, x, y, canvas) {
    this.type = type; // 'ship', 'anchor', 'gear', 'dot'
    this.x = x;
    this.y = y;
    this.canvas = canvas;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.01;
    this.scale = Math.random() * 0.5 + 0.5;
    this.opacity = Math.random() * 0.3 + 0.2;
    this.pulsePhase = Math.random() * Math.PI * 2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
    this.pulsePhase += 0.02;

    // Wrap around screen
    if (this.x < -100) this.x = this.canvas.width + 50;
    if (this.x > this.canvas.width + 100) this.x = -50;
    if (this.y < -100) this.y = this.canvas.height + 50;
    if (this.y > this.canvas.height + 100) this.y = -50;

    // Enhanced mouse interaction
    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 250 && distance > 0) {
        const force = (250 - distance) / 250;
        const angle = Math.atan2(dy, dx);

        // Repel particles away from mouse
        this.vx -= Math.cos(angle) * force * 0.5;
        this.vy -= Math.sin(angle) * force * 0.5;

        // Add slight rotation on hover
        this.rotationSpeed += (Math.random() - 0.5) * 0.02 * force;
      }
    }

    // Apply damping
    this.vx *= 0.98;
    this.vy *= 0.98;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.scale(this.scale, this.scale);

    const pulse = Math.sin(this.pulsePhase) * 0.2 + 0.8;
    ctx.globalAlpha = this.opacity * pulse;

    if (this.type === 'ship') {
      this.drawShip(ctx);
    } else if (this.type === 'anchor') {
      this.drawAnchor(ctx);
    } else if (this.type === 'gear') {
      this.drawGear(ctx);
    } else if (this.type === 'dot') {
      this.drawDot(ctx);
    }

    ctx.restore();
  }

  drawShip(ctx) {
    ctx.strokeStyle = getShipColor();
    ctx.lineWidth = 2;
    ctx.beginPath();
    shipPath.forEach((point, i) => {
      if (i === 0) ctx.moveTo(point[0], point[1]);
      else ctx.lineTo(point[0], point[1]);
    });
    ctx.closePath();
    ctx.stroke();

    // Mast
    ctx.beginPath();
    ctx.moveTo(15, 5);
    ctx.lineTo(15, -15);
    ctx.stroke();
  }

  drawAnchor(ctx) {
    ctx.strokeStyle = getAnchorColor();
    ctx.lineWidth = 2;
    ctx.beginPath();
    // Anchor shaft
    ctx.moveTo(0, -15);
    ctx.lineTo(0, 10);
    // Cross bar
    ctx.moveTo(-10, 0);
    ctx.lineTo(10, 0);
    // Flukes
    ctx.moveTo(0, 10);
    ctx.lineTo(-8, 15);
    ctx.moveTo(0, 10);
    ctx.lineTo(8, 15);
    // Ring
    ctx.moveTo(0, -15);
    ctx.arc(0, -15, 3, 0, Math.PI * 2);
    ctx.stroke();
  }

  drawGear(ctx) {
    ctx.strokeStyle = getGearColor();
    ctx.lineWidth = 1.5;
    const teeth = 8;
    const outerRadius = 12;
    const innerRadius = 8;

    ctx.beginPath();
    for (let i = 0; i < teeth * 2; i++) {
      const angle = (i * Math.PI) / teeth;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    // Center hole
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.stroke();
  }

  drawDot(ctx) {
    ctx.fillStyle = getDotColor();
    ctx.beginPath();
    ctx.arc(0, 0, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

const initNavalElements = () => {
  const canvasEl = canvas.value;
  if (!canvasEl) return;

  canvasEl.width = window.innerWidth;
  canvasEl.height = window.innerHeight;

  navalElements = [];
  const counts = getElementCounts();

  // Add ships
  for (let i = 0; i < counts.ships; i++) {
    navalElements.push(
      new NavalElement(
        'ship',
        Math.random() * canvasEl.width,
        Math.random() * canvasEl.height,
        canvasEl
      )
    );
  }

  // Add anchors
  for (let i = 0; i < counts.anchors; i++) {
    navalElements.push(
      new NavalElement(
        'anchor',
        Math.random() * canvasEl.width,
        Math.random() * canvasEl.height,
        canvasEl
      )
    );
  }

  // Add gears (for repair aspect)
  for (let i = 0; i < counts.gears; i++) {
    navalElements.push(
      new NavalElement(
        'gear',
        Math.random() * canvasEl.width,
        Math.random() * canvasEl.height,
        canvasEl
      )
    );
  }

  // Add connecting dots
  const dotCount = Math.floor((canvasEl.width * canvasEl.height) / 20000 * counts.dotsMultiplier);
  for (let i = 0; i < dotCount; i++) {
    navalElements.push(
      new NavalElement(
        'dot',
        Math.random() * canvasEl.width,
        Math.random() * canvasEl.height,
        canvasEl
      )
    );
  }
};

const drawConnections = (ctx) => {
  const dots = navalElements.filter(el => el.type === 'dot');

  // Draw connections between dots
  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const dx = dots[i].x - dots[j].x;
      const dy = dots[i].y - dots[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        const opacity = (1 - distance / 150) * 0.2;
        ctx.strokeStyle = getConnectionColor(opacity);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(dots[i].x, dots[i].y);
        ctx.lineTo(dots[j].x, dots[j].y);
        ctx.stroke();
      }
    }
  }
};

const drawMouseConnections = (ctx) => {
  if (mouse.x === null || mouse.y === null) return;

  // Draw mouse cursor highlight
  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, 8, 0, Math.PI * 2);
  ctx.fillStyle = getMouseFillColor();
  ctx.fill();
  ctx.strokeStyle = getMouseStrokeColor();
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw connections from mouse to all nearby elements
  navalElements.forEach(element => {
    const dx = mouse.x - element.x;
    const dy = mouse.y - element.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 250) {
      const opacity = (1 - distance / 250) * 0.5;
      const lineWidth = element.type === 'dot' ? 1 : 2;

      ctx.strokeStyle = getMouseConnectionColor(opacity);
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(mouse.x, mouse.y);
      ctx.lineTo(element.x, element.y);
      ctx.stroke();
    }
  });
};

const animate = () => {
  const ctx = canvas.value?.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

  // Draw connections first
  drawConnections(ctx);

  // Draw and update all naval elements
  navalElements.forEach(element => {
    element.update();
    element.draw(ctx);
  });

  // Draw mouse connections on top
  drawMouseConnections(ctx);

  animationId = requestAnimationFrame(animate);
};

const handleResize = () => {
  initNavalElements();
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

// Watch for theme changes and redraw
watch(() => themeStore.currentTheme, () => {
  if (canvas.value) {
    // Redraw on next frame
    requestAnimationFrame(() => {
      const ctx = canvas.value?.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
      }
    });
  }
});

onMounted(() => {
  initNavalElements();
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
.naval-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

/* Technical grid background */
.technical-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(v-bind(getGridColor) 1px, transparent 1px),
    linear-gradient(90deg, v-bind(getGridColor) 1px, transparent 1px);
  background-size: 50px 50px;
  z-index: 1;
}

/* Animated waves */
.waves {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 200px;
  z-index: 2;
  opacity: 0.15;
}

.wave {
  fill: v-bind(getWaveColor1);
  animation: wave-animation 15s ease-in-out infinite;
}

.wave-1 {
  animation-delay: 0s;
  animation-duration: 12s;
}

.wave-2 {
  animation-delay: -3s;
  animation-duration: 18s;
  fill: v-bind(getWaveColor2);
}

@keyframes wave-animation {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-25%);
  }
}

/* Naval canvas */
.naval-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  pointer-events: none;
}

/* Responsive */
@media (max-width: 768px) {
  .technical-grid {
    background-size: 30px 30px;
  }

  .waves {
    height: 150px;
  }
}
</style>
