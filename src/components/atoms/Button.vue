<template>
  <button
    :class="[
      'rounded-lg font-medium transition',
      sizeClasses,
      variantClasses,
      customClass
    ]"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  customClass : { type: String },
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary': return 'text-white bg-[#EC1C80] p-3 px-4 rounded-lg'
    case 'secondary': return 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    default: return 'bg-gray-100 text-black'
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'px-3 py-1 text-sm'
    case 'lg': return 'px-6 py-3 text-lg'
    default: return 'px-4 py-2 text-md'
  }
})
</script>
