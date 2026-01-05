<template>
  <transition
    enter-active-class="modal-backdrop-enter"
    leave-active-class="modal-backdrop-leave"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
      @click="handleBackdropClick"
    >
      <!-- Naval Background -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <NavalBackground intensity="medium" />
      </div>

      <!-- Modal Content -->
      <transition
        appear
        enter-active-class="modal-content-enter"
        leave-active-class="modal-content-leave"
      >
        <div
          v-if="isOpen"
          ref="modalContent"
          class="relative bg-white/98 dark:bg-gray-800/98 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] w-full max-w-2xl max-h-[85vh] flex flex-col border border-white/30 dark:border-gray-700/30 ring-1 ring-black/5 dark:ring-white/5"
          @click.stop
        >
        <!-- Header -->
        <div class="flex items-center justify-center p-6 border-b border-white/30 dark:border-gray-700/50 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm">
          <div class="flex items-center space-x-3">
            <div class="relative w-12 h-12 bg-gradient-to-br from-primary via-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
              <div class="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-spin-slow"></div>
              <i class="fas fa-robot text-white text-xl relative z-10"></i>
              <span class="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800 shadow-lg animate-pulse"></span>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white drop-shadow-sm">
                {{ $t('ai_assistant.title') }}
              </h3>
              <p class="text-xs text-gray-600 dark:text-gray-400">
                {{ $t('ai_assistant.subtitle') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Messages -->
        <div
          ref="messagesContainer"
          class="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-transparent via-gray-50/30 to-transparent dark:via-gray-900/30"
        >
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="flex"
            :class="message.type === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[80%] rounded-2xl px-5 py-3.5 shadow-sm"
              :class="
                message.type === 'user'
                  ? 'bg-gradient-to-br from-primary to-primary-600 text-white shadow-primary/20'
                  : 'bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50'
              "
            >
              <p class="text-sm whitespace-pre-wrap">{{ message.content }}</p>
              <span class="text-xs opacity-70 mt-1 block">{{ message.time }}</span>
            </div>
          </div>

          <!-- Typing indicator -->
          <div v-if="isTyping" class="flex justify-start">
            <div class="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3">
              <div class="flex space-x-2">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="p-6 border-t border-white/30 dark:border-gray-700/50 bg-gradient-to-t from-gray-50/50 to-transparent dark:from-gray-900/50 backdrop-blur-sm">
          <div class="flex items-center space-x-3">
            <input
              v-model="userInput"
              type="text"
              :placeholder="$t('ai_assistant.input_placeholder')"
              class="flex-1 px-5 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm backdrop-blur-sm"
              @keyup.enter="sendMessage"
            />
            <button
              @click="sendMessage"
              :disabled="!userInput.trim() || isTyping"
              class="px-6 py-3.5 bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5"
            >
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import NavalBackground from '@/components/common/NavalBackground.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const route = useRoute();
const { t } = useI18n();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const messages = ref([]);
const userInput = ref('');
const isTyping = ref(false);
const messagesContainer = ref(null);
const modalContent = ref(null);

/**
 * Get contextual help based on current route
 */
const getContextualHelp = () => {
  const path = route.path;
  const routeName = route.name;

  const helpContext = {
    '/dashboard': {
      title: t('ai_assistant.help.dashboard.title'),
      description: t('ai_assistant.help.dashboard.description'),
      features: [
        t('ai_assistant.help.dashboard.feature1'),
        t('ai_assistant.help.dashboard.feature2'),
        t('ai_assistant.help.dashboard.feature3'),
      ],
    },
    '/users': {
      title: t('ai_assistant.help.users.title'),
      description: t('ai_assistant.help.users.description'),
      features: [
        t('ai_assistant.help.users.feature1'),
        t('ai_assistant.help.users.feature2'),
        t('ai_assistant.help.users.feature3'),
      ],
    },
    '/groups': {
      title: t('ai_assistant.help.groups.title'),
      description: t('ai_assistant.help.groups.description'),
      features: [
        t('ai_assistant.help.groups.feature1'),
        t('ai_assistant.help.groups.feature2'),
      ],
    },
    '/categories': {
      title: t('ai_assistant.help.categories.title'),
      description: t('ai_assistant.help.categories.description'),
      features: [
        t('ai_assistant.help.categories.feature1'),
        t('ai_assistant.help.categories.feature2'),
      ],
    },
    '/roles': {
      title: t('ai_assistant.help.roles.title'),
      description: t('ai_assistant.help.roles.description'),
      features: [
        t('ai_assistant.help.roles.feature1'),
        t('ai_assistant.help.roles.feature2'),
      ],
    },
    '/settings': {
      title: t('ai_assistant.help.settings.title'),
      description: t('ai_assistant.help.settings.description'),
      features: [
        t('ai_assistant.help.settings.feature1'),
        t('ai_assistant.help.settings.feature2'),
      ],
    },
  };

  return helpContext[path] || {
    title: t('ai_assistant.help.default.title'),
    description: t('ai_assistant.help.default.description'),
    features: [],
  };
};

/**
 * Format help context as message
 */
const formatHelpMessage = (context) => {
  let message = `📍 **${context.title}**\n\n${context.description}`;

  if (context.features && context.features.length > 0) {
    message += '\n\n' + t('ai_assistant.available_features') + ':\n';
    context.features.forEach((feature, index) => {
      message += `${index + 1}. ${feature}\n`;
    });
  }

  message += '\n\n' + t('ai_assistant.ask_more');

  return message;
};

/**
 * Add message to chat
 */
const addMessage = (content, type = 'assistant') => {
  messages.value.push({
    content,
    type,
    time: new Date().toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  });

  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

/**
 * Send message
 */
const sendMessage = async () => {
  if (!userInput.value.trim() || isTyping.value) return;

  const message = userInput.value.trim();
  addMessage(message, 'user');
  userInput.value = '';

  isTyping.value = true;

  // Simulate AI response delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Generate response based on user input
  const response = generateResponse(message);
  addMessage(response);

  isTyping.value = false;
};

/**
 * Generate AI response
 */
const generateResponse = (message) => {
  const lowerMessage = message.toLowerCase();

  // Common questions
  if (lowerMessage.includes('cómo') || lowerMessage.includes('como')) {
    return t('ai_assistant.response.how_to');
  }

  if (lowerMessage.includes('qué') || lowerMessage.includes('que')) {
    const context = getContextualHelp();
    return formatHelpMessage(context);
  }

  if (lowerMessage.includes('ayuda') || lowerMessage.includes('help')) {
    return t('ai_assistant.response.help');
  }

  if (lowerMessage.includes('gracias') || lowerMessage.includes('thanks')) {
    return t('ai_assistant.response.thanks');
  }

  // Default response
  return t('ai_assistant.response.default');
};

/**
 * Handle backdrop click - close only if clicking outside modal content
 */
const handleBackdropClick = (event) => {
  if (modalContent.value && !modalContent.value.contains(event.target)) {
    close();
  }
};

/**
 * Close assistant
 */
const close = () => {
  isOpen.value = false;
};

/**
 * Initialize with contextual help when opened
 */
watch(isOpen, (newValue) => {
  if (newValue && messages.value.length === 0) {
    const context = getContextualHelp();
    const welcomeMessage = t('ai_assistant.welcome') + '\n\n' + formatHelpMessage(context);
    addMessage(welcomeMessage);
  }
});
</script>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Animations */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-0.5rem);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}

/* Slow spin animation for header icon */
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}

/* Glassmorphism effect */
.backdrop-blur-xl {
  backdrop-filter: blur(20px);
}

/* ============================================
   Professional Modal Animations
   Smooth, Symmetric, and Noticeable
   ============================================ */

/* Backdrop Animations - Smooth fade and blur */
.modal-backdrop {
  backdrop-filter: blur(0px);
}

.modal-backdrop-enter {
  animation: backdrop-enter 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.modal-backdrop-leave {
  animation: backdrop-leave 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes backdrop-enter {
  0% {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  100% {
    opacity: 1;
    backdrop-filter: blur(4px);
  }
}

@keyframes backdrop-leave {
  0% {
    opacity: 1;
    backdrop-filter: blur(4px);
  }
  100% {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
}

/* Modal Content Animations - Smooth elastic effect */
.modal-content-enter {
  animation: modal-content-enter 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.modal-content-leave {
  animation: modal-content-leave 0.5s cubic-bezier(0.4, 0, 0.6, 1) forwards;
}

@keyframes modal-content-enter {
  0% {
    opacity: 0;
    transform: scale(0.85) translateY(-40px);
  }
  60% {
    opacity: 1;
    transform: scale(1.02) translateY(5px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes modal-content-leave {
  0% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  100% {
    opacity: 0;
    transform: scale(0.88) translateY(30px);
  }
}
</style>
