<template>
  <div
    v-motion-slide-visible-once-bottom
    :class="[
      'bg-card rounded-lg shadow-card border border-card p-6 transition-all duration-300',
      'hover:shadow-lg hover:-translate-y-1',
    ]"
  >
    <div class="flex items-center justify-between">
      <!-- Content -->
      <div class="flex-1">
        <h3 class="text-sm font-medium text-themed-secondary mb-1">
          {{ title }}
        </h3>

        <!-- Value -->
        <div v-if="!loading" class="text-3xl font-bold text-themed-primary mb-2">
          {{ displayValue }}
        </div>

        <!-- Loading Skeleton -->
        <div v-else class="space-y-2 mb-2">
          <div class="h-9 bg-themed-tertiary rounded animate-pulse"></div>
        </div>

        <!-- Trend (Optional) -->
        <div v-if="trend !== null && !loading" class="flex items-center space-x-2 text-sm">
          <span
            :class="[
              'flex items-center space-x-1',
              trend > 0 ? 'text-success' : 'text-danger',
            ]"
          >
            <i :class="trend > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
            <span>{{ Math.abs(trend) }}%</span>
          </span>
          <span class="text-themed-muted">
            {{ $t('widget.vs_last_period') }}
          </span>
        </div>
      </div>

      <!-- Icon -->
      <div
        :class="[
          'w-16 h-16 rounded-full flex items-center justify-center',
          iconBackgroundClass,
        ]"
      >
        <i :class="[icon, 'text-2xl', iconColorClass]"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue';

/**
 * Widget Component
 * Dashboard statistics card with animated counter
 * Features: Loading state, trend indicator, colored icon, hover effect
 */

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [Number, String],
    default: 0,
  },
  icon: {
    type: String,
    default: 'fas fa-chart-line',
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'danger', 'warning', 'info', 'secondary'].includes(value),
  },
  loading: {
    type: Boolean,
    default: false,
  },
  trend: {
    type: Number,
    default: null,
  },
  format: {
    type: String,
    default: 'number', // 'number', 'currency', 'percentage'
  },
});

// Animated value
const animatedValue = ref(0);

// Color mappings using CSS variables
const colorMap = {
  primary: {
    bg: 'bg-primary/10',
    text: 'text-primary',
  },
  success: {
    bg: 'bg-success/10',
    text: 'text-success',
  },
  danger: {
    bg: 'bg-danger/10',
    text: 'text-danger',
  },
  warning: {
    bg: 'bg-warning/10',
    text: 'text-warning',
  },
  info: {
    bg: 'bg-info/10',
    text: 'text-info',
  },
  secondary: {
    bg: 'bg-themed-tertiary',
    text: 'text-themed-secondary',
  },
};

const iconBackgroundClass = computed(() => colorMap[props.color]?.bg || colorMap.primary.bg);
const iconColorClass = computed(() => colorMap[props.color]?.text || colorMap.primary.text);

/**
 * Format display value
 */
const displayValue = computed(() => {
  const val = animatedValue.value;

  switch (props.format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);

    case 'percentage':
      return `${val.toFixed(1)}%`;

    case 'number':
    default:
      return new Intl.NumberFormat('en-US').format(val);
  }
});

/**
 * Animate value counter
 */
const animateValue = (start, end, duration = 1000) => {
  const startTime = Date.now();
  const difference = end - start;

  const step = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    animatedValue.value = Math.floor(start + difference * easeOut);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      animatedValue.value = end;
    }
  };

  requestAnimationFrame(step);
};

// Watch for value changes and animate
watch(
  () => props.value,
  (newValue, oldValue) => {
    if (!props.loading) {
      const numValue = typeof newValue === 'number' ? newValue : parseFloat(newValue) || 0;
      const oldNumValue = typeof oldValue === 'number' ? oldValue : parseFloat(oldValue) || 0;
      animateValue(oldNumValue, numValue);
    }
  },
  { immediate: true }
);
</script>