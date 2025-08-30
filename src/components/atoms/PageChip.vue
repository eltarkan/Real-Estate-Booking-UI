<template>
  <button
    type="button"
    :disabled="disabled"
    :aria-current="active ? 'page' : undefined"
    :class="[
      'inline-flex items-center justify-center select-none rounded-md border text-sm font-medium',
      'h-9 w-9',
      baseClasses,
      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100',
      active
        ? 'border-blue-400 ring-2 ring-blue-400/60 bg-white text-blue-600'
        : 'border-gray-200 bg-gray-50 text-slate-700'
    ]"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  active: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})

const baseClasses = 'transition focus:outline-none focus:ring-2 focus:ring-blue-400/60'
</script>
