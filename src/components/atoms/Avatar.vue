<template>
  <div
    class="flex items-center justify-center rounded-full ring-1"
    :class="[
      sizeClasses,
      ringClasses,
      bgClass,
      textClass,
      extraClass
    ]"
    :title="title"
  >
    <slot>{{ initials }}</slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  initials: { type: String, default: '' },
  size: { type: String, default: 'md' }, // xs|sm|md|lg
  bgClass: { type: String, default: 'bg-gray-200' },
  textClass: { type: String, default: 'text-black' },
  ring: { type: Boolean, default: true },
  ringColor: { type: String, default: 'ring-white' },
  extraClass: { type: String, default: '' },
  title: { type: String, default: '' },
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs': return 'h-6 w-6 text-[10px] font-semibold'
    case 'sm': return 'h-8 w-8 text-xs font-semibold'
    case 'lg': return 'h-12 w-12 text-base font-bold'
    default:   return 'h-10 w-10 text-sm font-bold'
  }
})

const ringClasses = computed(() => props.ring ? `ring-2 ${props.ringColor}` : 'ring-0')
</script>
