<template>
  <transition
    enter-active-class="backdrop-enter-active"
    leave-active-class="backdrop-leave-active"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      style="z-index: 9998;"
      @click="handleBackdropClick"
    >
      <!-- Naval Background -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
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
          class="relative bg-white/98 dark:bg-gray-800/98 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
          style="z-index: 9999;"
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
          class="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-transparent via-gray-50/30 to-transparent dark:via-gray-900/30 custom-scrollbar"
        >
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="flex message-item"
            :class="message.type === 'user' ? 'justify-end' : 'justify-start'"
            :style="{ '--message-index': index }"
          >
            <div
              :class="[
                'rounded-2xl px-5 py-3.5 shadow-sm transition-all duration-300 hover:shadow-md',
                message.type === 'user'
                  ? 'max-w-[80%] bg-gradient-to-br from-primary to-primary-600 text-white shadow-primary/20 hover:shadow-primary/30'
                  : message.isWelcome
                  ? 'w-full bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50'
                  : 'max-w-[80%] bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 hover:border-gray-300/70 dark:hover:border-gray-500/70'
              ]"
            >
              <!-- Typewriter effect for welcome message -->
              <div v-if="message.isWelcome && message.typing" class="text-sm whitespace-pre-wrap">
                <span :id="`typed-text-${index}`"></span>
                <span class="typed-cursor">|</span>
              </div>
              <!-- Regular message -->
              <div v-else>
                <p class="text-sm whitespace-pre-wrap">{{ message.content }}</p>
                <div class="mt-3 pt-2 border-t border-gray-200/30 dark:border-gray-600/30 space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="text-xs opacity-70">{{ message.date }}</span>
                    <span class="text-xs opacity-70 font-semibold">{{ message.time }}</span>
                  </div>
                  <div class="flex items-center justify-center">
                    <i class="fas fa-globe-americas text-xs opacity-50 mr-1"></i>
                    <span class="text-xs opacity-60">{{ message.timezone }}</span>
                  </div>
                </div>
              </div>
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
import { ref, computed, nextTick, watch, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Typed from 'typed.js';
import NavalBackground from '@/components/common/NavalBackground.vue';
import { searchKnowledge, formatKnowledgeResponse, getKnowledgeForLanguage } from '@/utils/aiKnowledge';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const route = useRoute();
const { t, locale } = useI18n();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const messages = ref([]);
const userInput = ref('');
const isTyping = ref(false);
const messagesContainer = ref(null);
const modalContent = ref(null);
let typedInstance = null;

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
    '/hrm/employees': {
      title: t('ai_assistant.help.users.title'),
      description: t('ai_assistant.help.users.description'),
      features: [
        t('ai_assistant.help.users.feature1'),
        t('ai_assistant.help.users.feature2'),
        t('ai_assistant.help.users.feature3'),
      ],
    },
    '/hrm/masters/groups': {
      title: t('ai_assistant.help.groups.title'),
      description: t('ai_assistant.help.groups.description'),
      features: [
        t('ai_assistant.help.groups.feature1'),
        t('ai_assistant.help.groups.feature2'),
      ],
    },
    '/hrm/masters/categories': {
      title: t('ai_assistant.help.categories.title'),
      description: t('ai_assistant.help.categories.description'),
      features: [
        t('ai_assistant.help.categories.feature1'),
        t('ai_assistant.help.categories.feature2'),
      ],
    },
    '/webmaster/roles': {
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
 * Get user's locale and timezone
 */
const getUserLocale = () => {
  return navigator.language || navigator.userLanguage || 'es-ES';
};

const getUserTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Add message to chat
 */
const addMessage = (content, type = 'assistant', isWelcome = false) => {
  const now = new Date();
  const userLocale = getUserLocale();
  const userTimezone = getUserTimezone();

  // Create reactive message object
  const message = reactive({
    content,
    type,
    date: now.toLocaleDateString(userLocale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: userTimezone,
    }),
    time: now.toLocaleTimeString(userLocale, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: userTimezone,
    }),
    timezone: userTimezone,
    isWelcome,
    typing: isWelcome, // Only welcome messages have typing effect initially
  });

  const messageIndex = messages.value.length;
  messages.value.push(message);

  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }

    // Initialize typewriter effect for welcome message
    if (isWelcome) {
      initTypewriter(content, message, messageIndex);
    }
  });
};

/**
 * Initialize typewriter effect
 */
const initTypewriter = (content, message, index) => {
  // Destroy previous instance if exists
  if (typedInstance) {
    typedInstance.destroy();
  }

  // Wait a bit before starting the typewriter effect
  setTimeout(() => {
    const element = document.getElementById(`typed-text-${index}`);
    if (element) {
      typedInstance = new Typed(`#typed-text-${index}`, {
        strings: [content],
        typeSpeed: 15,
        backSpeed: 0,
        showCursor: false,
        onComplete: () => {
          // Mark typing as complete
          message.typing = false;
          nextTick(() => {
            if (messagesContainer.value) {
              messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
            }
          });
        },
      });
    }
  }, 300); // Delay start for better UX
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
 * Get current module from route
 */
const getCurrentModule = () => {
  const path = route.path;
  if (path.includes('/hrm/employees')) return 'users';
  if (path.includes('/hrm/masters/groups')) return 'groups';
  if (path.includes('/hrm/masters/categories')) return 'categories';
  if (path.includes('/webmaster/roles')) return 'roles';
  if (path.includes('/profile')) return 'profile';
  if (path.includes('/settings')) return 'settings';
  return 'dashboard';
};

/**
 * Generate AI response using knowledge base
 */
const generateResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  const currentModule = getCurrentModule();
  const knowledge = getKnowledgeForLanguage(locale.value);

  // Check if greeting
  if (lowerMessage.includes('hola') || lowerMessage.includes('hi') ||
      lowerMessage.includes('hello') || lowerMessage.includes('buenos días')) {
    return `¡Hola! 👋 Soy tu asistente de IA para ${knowledge.general.name}. Estoy aquí para ayudarte a entender y usar todas las funcionalidades del sistema. ¿En qué puedo ayudarte hoy?`;
  }

  // Check if thanks
  if (lowerMessage.includes('gracias') || lowerMessage.includes('thanks') ||
      lowerMessage.includes('thank you')) {
    return '¡De nada! 😊 Si tienes más preguntas sobre el sistema, no dudes en preguntar. Estoy aquí para ayudarte.';
  }

  // Check if asking about system in general
  if (lowerMessage.includes('qué es este sistema') || lowerMessage.includes('qué hace') ||
      lowerMessage.includes('para qué sirve')) {
    return `**${knowledge.general.name}** es un ${knowledge.general.description}\n\n**Funcionalidades principales:**\n${knowledge.general.mainFeatures.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\n¿Te gustaría saber más sobre alguna funcionalidad específica?`;
  }

  // Search in knowledge base
  const knowledgeResult = searchKnowledge(message, currentModule, locale.value);

  // Debug: log the search result
  console.log('AI Search:', { query: message, module: currentModule, locale: locale.value, result: knowledgeResult });

  if (knowledgeResult) {
    const formattedResponse = formatKnowledgeResponse(knowledgeResult);
    if (formattedResponse) {
      // Vary the ending messages
      const endings = [
        '\n\n💡 ¿Necesitas ayuda con algo más?',
        '\n\n¿Te gustaría saber algo más?',
        '\n\n¿Hay algo más en lo que pueda ayudarte?',
        '\n\n¿Tienes alguna otra pregunta?',
      ];
      const randomEnding = endings[Math.floor(Math.random() * endings.length)];
      return formattedResponse + randomEnding;
    }
  }

  // If asking "how" questions
  if (lowerMessage.includes('cómo') || lowerMessage.includes('como')) {
    const module = knowledge.modules[currentModule];
    if (module && Object.keys(module.howTo || {}).length > 0) {
      const howToTasks = Object.keys(module.howTo);
      return `En **${module.name}**, puedo ayudarte con:\n\n${howToTasks.map((task, i) => `${i + 1}. Cómo ${task}`).join('\n')}\n\n¿Sobre cuál te gustaría saber más?`;
    }
  }

  // If asking "what" questions
  if (lowerMessage.includes('qué puedo') || lowerMessage.includes('que puedo') ||
      lowerMessage.includes('funciones') || lowerMessage.includes('características')) {
    const module = knowledge.modules[currentModule];
    if (module) {
      return `En **${module.name}**, puedes:\n\n${module.features.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\n¿Te gustaría saber cómo hacer algo específico?`;
    }
  }

  // Default contextual response
  const module = knowledge.modules[currentModule];
  return `Estoy aquí para ayudarte con **${module.name}**. Puedes preguntarme sobre:\n\n• Qué funcionalidades están disponibles\n• Cómo realizar tareas específicas\n• Información sobre ${knowledge.general.name}\n\n¿En qué puedo ayudarte específicamente?`;
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
    addMessage(welcomeMessage, 'assistant', true); // Mark as welcome message for typewriter effect
  }
});

/**
 * Cleanup on component unmount
 */
watch(isOpen, (newValue) => {
  if (!newValue && typedInstance) {
    typedInstance.destroy();
    typedInstance = null;
  }
});
</script>

<style scoped>
/* Custom scrollbar - Professional gradient style */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  margin: 8px 0;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(99, 102, 241, 0.3) 0%, rgba(168, 85, 247, 0.5) 100%);
  border-radius: 10px;
  border: 2px solid transparent;
  background-clip: padding-box;
  transition: background 0.3s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(99, 102, 241, 0.5) 0%, rgba(168, 85, 247, 0.7) 100%);
  background-clip: padding-box;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(165, 180, 252, 0.3) 0%, rgba(216, 180, 254, 0.5) 100%);
  background-clip: padding-box;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(165, 180, 252, 0.5) 0%, rgba(216, 180, 254, 0.7) 100%);
  background-clip: padding-box;
}

/* Smooth scroll behavior */
.custom-scrollbar {
  scroll-behavior: smooth;
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

/* ============================================
   Professional Modal Animations - Ultra Smooth
   ============================================ */

/* Backdrop Animations - Simple and smooth */
.backdrop-enter-active {
  animation: backdrop-fade-in 0.3s ease-out;
}

.backdrop-leave-active {
  animation: backdrop-fade-out 0.25s ease-in;
}

@keyframes backdrop-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes backdrop-fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/* Modal Content Animations - Smooth without jumps */
.modal-content-enter {
  animation: modal-content-enter 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.modal-content-leave {
  animation: modal-content-leave 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53);
}

@keyframes modal-content-enter {
  0% {
    opacity: 0;
    transform: scale(0.95) translateY(-20px);
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
    transform: scale(0.95) translateY(-20px);
  }
}

/* Message items animation - Smooth fade in */
.message-item {
  animation: message-fade-in 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) backwards;
  animation-delay: calc(var(--message-index, 0) * 50ms);
}

@keyframes message-fade-in {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Optimize rendering performance */
.modal-content-enter,
.modal-content-leave,
.message-item {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Responsive adjustments */
@media (max-height: 700px) {
  .max-h-\[85vh\] {
    max-height: 90vh;
  }
}

/* Typewriter cursor animation */
.typed-cursor {
  display: inline-block;
  margin-left: 2px;
  opacity: 1;
  animation: blink 0.7s infinite;
  font-weight: 300;
  color: currentColor;
}

@keyframes blink {
  0%, 49% {
    opacity: 1;
  }
  50%, 100% {
    opacity: 0;
  }
}
</style>
