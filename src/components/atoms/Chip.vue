<template>
  <span
    :class="[
      'inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold leading-none',
      variantClass
    ]"
  >
    <slot />
  </span>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  variant: { type: String, default: 'light' }, // light | dark | inverse
})
const variantClass = computed(() => {
  switch (props.variant) {
    case 'inverse': return 'bg-white text-pink-600'
    case 'dark':    return 'bg-pink-700 text-white'
    default:        return 'bg-white/80 text-slate-700'
  }
})
</script>
