<template>
  <div :class="['flex', overlapClass]">
    <Avatar
      v-for="(u, idx) in visibleItems"
      :key="idx"
      :initials="u.initials"
      :bg-class="u.bg ?? 'bg-gray-200'"
      :text-class="u.text ?? 'text-black'"
      :size="size"
      :ring="ring"
      :ring-color="ringColor"
      :extra-class="avatarClass"
      :title="u.title ?? u.initials"
    />
    <Avatar
      v-if="hiddenCount > 0 && showCounter"
      :initials="`+${hiddenCount}`"
      :bg-class="counterBgClass"
      :text-class="counterTextClass"
      :size="size"
      :ring="ring"
      :ring-color="ringColor"
      :extra-class="avatarClass"
      title="More"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Avatar from '@/components/atoms/Avatar.vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => [], // [{ initials, bg, text, title }]
  },
  size: { type: String, default: 'md' },          // xs|sm|md|lg
  max: { type: Number, default: 0 },              // 0 = no limit
  showCounter: { type: Boolean, default: true },
  overlap: { type: String, default: '-space-x-3' }, // Tailwind overlap class
  ring: { type: Boolean, default: true },
  ringColor: { type: String, default: 'ring-white' },
  avatarClass: { type: String, default: '' },     // extra utility for every avatar
  counterBgClass: { type: String, default: 'bg-gray-100' },
  counterTextClass: { type: String, default: 'text-black' },
})

const overlapClass = computed(() => props.overlap)

const visibleItems = computed(() => {
  if (!props.max || props.items.length <= props.max) return props.items
  return props.items.slice(0, props.max)
})

const hiddenCount = computed(() => {
  if (!props.max) return 0
  return Math.max(props.items.length - props.max, 0)
})
</script>
