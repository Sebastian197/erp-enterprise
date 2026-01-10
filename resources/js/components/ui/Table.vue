<template>
  <div class="w-full">
    <!-- Mobile Card View (< 640px) -->
    <div class="block sm:hidden space-y-4">
      <!-- Loading State Mobile -->
      <template v-if="loading">
        <div
          v-for="i in perPage"
          :key="`mobile-loading-${i}`"
          class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3"
        >
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
        </div>
      </template>

      <!-- Data Cards Mobile -->
      <template v-else-if="data.length > 0">
        <div
          v-for="(row, index) in data"
          :key="row.id || index"
          class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3 hover:shadow-md transition-shadow"
        >
          <!-- Checkbox for mobile -->
          <div v-if="selectable" class="flex items-center pb-2 border-b border-gray-200 dark:border-gray-700">
            <input
              type="checkbox"
              :checked="isSelected(row)"
              @change="toggleSelect(row)"
              class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2 mr-2"
            />
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ $t('table.select_item') }}</span>
          </div>

          <!-- Mobile Card Content -->
          <div class="space-y-2">
            <div
              v-for="column in columns"
              :key="column.key"
              class="flex justify-between items-start"
            >
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase min-w-[100px]">
                {{ column.label }}
              </span>
              <div class="text-sm text-gray-900 dark:text-white text-right flex-1">
                <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                  {{ formatValue(row[column.key], column) }}
                </slot>
              </div>
            </div>
          </div>

          <!-- Actions for mobile -->
          <div v-if="$slots.actions" class="pt-3 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-end space-x-2">
              <slot name="actions" :row="row"></slot>
            </div>
          </div>
        </div>
      </template>

      <!-- Empty State Mobile -->
      <div
        v-else
        class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-12"
      >
        <div class="flex flex-col items-center justify-center space-y-3">
          <i class="fas fa-inbox text-4xl text-gray-300 dark:text-gray-600"></i>
          <p class="text-gray-500 dark:text-gray-400 text-center">
            {{ emptyMessage || $t('table.no_data') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Desktop/Tablet Table View (>= 640px) -->
    <div class="hidden sm:block overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <div class="inline-block min-w-full align-middle">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <!-- Table Header -->
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <!-- Select All Checkbox -->
            <th
              v-if="selectable"
              class="w-12 px-4 py-3"
            >
              <input
                type="checkbox"
                :checked="allSelected"
                @change="toggleSelectAll"
                class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
              />
            </th>

            <!-- Column Headers -->
            <th
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              :class="column.sortable && 'cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-700'"
              @click="column.sortable && handleSort(column.key)"
            >
              <div class="flex items-center space-x-2">
                <span>{{ column.label }}</span>
                <span v-if="column.sortable" class="flex flex-col">
                  <i
                    :class="[
                      'fas fa-sort-up -mb-1.5',
                      sortKey === column.key && sortOrder === 'asc'
                        ? 'text-primary'
                        : 'text-gray-300 dark:text-gray-600',
                    ]"
                  ></i>
                  <i
                    :class="[
                      'fas fa-sort-down -mt-1.5',
                      sortKey === column.key && sortOrder === 'desc'
                        ? 'text-primary'
                        : 'text-gray-300 dark:text-gray-600',
                    ]"
                  ></i>
                </span>
              </div>
            </th>

            <!-- Actions Column -->
            <th
              v-if="$slots.actions"
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              {{ $t('table.actions') }}
            </th>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          <!-- Loading State -->
          <template v-if="loading">
            <tr v-for="i in perPage" :key="`loading-${i}`">
              <td v-if="selectable" class="px-4 py-4">
                <div class="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              <td
                v-for="column in columns"
                :key="column.key"
                class="px-6 py-4"
              >
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              <td v-if="$slots.actions" class="px-6 py-4">
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24 ml-auto"></div>
              </td>
            </tr>
          </template>

          <!-- Data Rows -->
          <template v-else-if="data.length > 0">
            <tr
              v-for="(row, index) in data"
              :key="row.id || index"
              class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <!-- Select Checkbox -->
              <td v-if="selectable" class="px-4 py-4">
                <input
                  type="checkbox"
                  :checked="isSelected(row)"
                  @change="toggleSelect(row)"
                  class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                />
              </td>

              <!-- Data Cells -->
              <td
                v-for="column in columns"
                :key="column.key"
                class="px-6 py-4 text-sm text-gray-900 dark:text-white"
              >
                <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                  {{ formatValue(row[column.key], column) }}
                </slot>
              </td>

              <!-- Actions Cell -->
              <td v-if="$slots.actions" class="px-6 py-4 text-right text-sm">
                <slot name="actions" :row="row"></slot>
              </td>
            </tr>
          </template>

          <!-- Empty State -->
          <tr v-else>
            <td
              :colspan="columnCount"
              class="px-6 py-12 text-center"
            >
              <div class="flex flex-col items-center justify-center space-y-3">
                <i class="fas fa-inbox text-4xl text-gray-300 dark:text-gray-600"></i>
                <p class="text-gray-500 dark:text-gray-400">
                  {{ emptyMessage || $t('table.no_data') }}
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="pagination && pagination.last_page > 1"
      class="flex flex-col sm:flex-row items-center justify-between mt-4 px-2 sm:px-4 space-y-3 sm:space-y-0"
    >
      <!-- Info -->
      <div class="text-xs sm:text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left">
        {{ $t('table.showing') }}
        <span class="font-medium">{{ pagination.from || 0 }}</span>
        {{ $t('table.to') }}
        <span class="font-medium">{{ pagination.to || 0 }}</span>
        {{ $t('table.of') }}
        <span class="font-medium">{{ pagination.total || 0 }}</span>
        {{ $t('table.results') }}
      </div>

      <!-- Pagination Controls -->
      <div class="flex items-center space-x-1 sm:space-x-2">
        <!-- Previous Button -->
        <button
          @click="changePage(pagination.current_page - 1)"
          :disabled="pagination.current_page === 1"
          class="px-2 sm:px-3 py-2 text-xs sm:text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <i class="fas fa-chevron-left"></i>
        </button>

        <!-- Page Numbers -->
        <template v-for="page in visiblePages" :key="page">
          <button
            v-if="page !== '...'"
            @click="changePage(page)"
            :class="[
              'px-2 sm:px-3 py-2 text-xs sm:text-sm rounded-md border transition-colors min-w-[32px] sm:min-w-[36px]',
              page === pagination.current_page
                ? 'border-primary bg-primary text-white'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
            ]"
          >
            {{ page }}
          </button>
          <span v-else class="px-1 sm:px-2 text-gray-500 text-xs sm:text-sm">...</span>
        </template>

        <!-- Next Button -->
        <button
          @click="changePage(pagination.current_page + 1)"
          :disabled="pagination.current_page === pagination.last_page"
          class="px-2 sm:px-3 py-2 text-xs sm:text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

/**
 * Table Component
 * Advanced data table with sorting, pagination, and selection
 * Features: Column sorting, row selection, responsive design, loading states
 */

const props = defineProps({
  columns: {
    type: Array,
    required: true,
    validator: (columns) => columns.every(col => col.key && col.label),
  },
  data: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  pagination: {
    type: Object,
    default: null,
  },
  sortable: {
    type: Boolean,
    default: true,
  },
  selectable: {
    type: Boolean,
    default: false,
  },
  emptyMessage: {
    type: String,
    default: null,
  },
  perPage: {
    type: Number,
    default: 10,
  },
});

const emit = defineEmits(['sort', 'page-change', 'selection-change']);

// State
const sortKey = ref(null);
const sortOrder = ref('asc');
const selectedRows = ref([]);

// Computed
const columnCount = computed(() => {
  let count = props.columns.length;
  if (props.selectable) count++;
  return count;
});

const allSelected = computed(() => {
  return props.data.length > 0 && selectedRows.value.length === props.data.length;
});

const visiblePages = computed(() => {
  if (!props.pagination) return [];

  const current = props.pagination.current_page;
  const last = props.pagination.last_page;
  const delta = 2;
  const range = [];
  const rangeWithDots = [];

  for (let i = Math.max(2, current - delta); i <= Math.min(last - 1, current + delta); i++) {
    range.push(i);
  }

  if (current - delta > 2) {
    rangeWithDots.push(1, '...');
  } else {
    rangeWithDots.push(1);
  }

  rangeWithDots.push(...range);

  if (current + delta < last - 1) {
    rangeWithDots.push('...', last);
  } else if (last !== 1) {
    rangeWithDots.push(last);
  }

  return rangeWithDots;
});

/**
 * Handle column sort
 */
const handleSort = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }

  emit('sort', { key: sortKey.value, order: sortOrder.value });
};

/**
 * Change page
 */
const changePage = (page) => {
  emit('page-change', page);
};

/**
 * Toggle select all
 */
const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedRows.value = [];
  } else {
    selectedRows.value = [...props.data];
  }
  emit('selection-change', selectedRows.value);
};

/**
 * Toggle row selection
 */
const toggleSelect = (row) => {
  const index = selectedRows.value.findIndex(r => r.id === row.id);
  if (index > -1) {
    selectedRows.value.splice(index, 1);
  } else {
    selectedRows.value.push(row);
  }
  emit('selection-change', selectedRows.value);
};

/**
 * Check if row is selected
 */
const isSelected = (row) => {
  return selectedRows.value.some(r => r.id === row.id);
};

/**
 * Format cell value
 */
const formatValue = (value, column) => {
  if (value === null || value === undefined) return '-';
  if (column.format && typeof column.format === 'function') {
    return column.format(value);
  }
  return value;
};
</script>
