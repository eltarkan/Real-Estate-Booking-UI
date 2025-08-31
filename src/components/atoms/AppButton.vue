<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'px-5 py-2 rounded-md text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
      variant === 'primary' ? 'bg-[#EC1D80] hover:brightness-110' :
      variant === 'dark'    ? 'bg-black hover:brightness-110' :
                              'bg-gray-300 text-gray-700'
    ]"
  >
    <slot/>
  </button>
</template>

<script setup>
defineProps({
  type: { type: String, default: 'button' },
  variant: { type: String, default: 'primary' }, // primary|dark|muted
  disabled: { type: Boolean, default: false },
})
</script>
