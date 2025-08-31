<template>
  <div
    class="flex items-center justify-center rounded-full ring-1 font-light"
    :class="[sizeClasses, ring ? ringColor : 'ring-0', textClass]"
    :style="bgStyle"
    :title="title"
  >
    <slot>{{ initials }}</slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  initials?: string
  size?: 'xs'|'sm'|'md'|'lg'
  ring?: boolean
  ringColor?: string
  textClass?: string
  bgColor?: string | null
  title?: string
}>()

const sizeClasses = computed(() => {
  switch (props.size ?? 'md') {
    case 'xs': return 'h-6 w-6 text-[10px] font-semibold'
    case 'sm': return 'h-8 w-8 text-xs font-semibold'
    case 'lg': return 'h-12 w-12 text-base font-bold'
    default:   return 'h-10 w-10 text-sm font-bold'
  }
})

const ring = computed(() => props.ring ?? true)
const ringColor = computed(() => props.ringColor ?? 'ring-white')
const textClass = computed(() => props.textClass ?? 'text-white')
const bgStyle = computed(() => props.bgColor ? ({ backgroundColor: props.bgColor }) : undefined)
</script>
