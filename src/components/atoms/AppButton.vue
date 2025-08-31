<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'relative flex items-center justify-center gap-2 px-5 py-2 rounded-md text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
      variant === 'primary' ? 'bg-[#EC1D80] hover:brightness-110' :
      variant === 'dark'    ? 'bg-black hover:brightness-110' :
                              'bg-gray-300 text-gray-700'
    ]"
  >
    <!-- Spinner -->
    <div
      v-if="loading"
      class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
    ></div>

    <!-- Default slot -->
    <span :class="{ 'opacity-70': loading }">
      <slot/>
    </span>
  </button>
</template>

<script setup>
defineProps({
  type: { type: String, default: 'button' },
  variant: { type: String, default: 'primary' }, // primary|dark|muted
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
})
</script>
