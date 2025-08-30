<template>
  <div :class="['flex', overlap]">
    <Avatar
      v-for="a in visible"
      :key="a.key"
      :initials="a.initials"
      :bg-color="a.bgColor"
      :text-class="a.textClass"
      :size="size"
      :ring="ring"
      :ring-color="ringColor"
      :title="a.title"
    />
    <Avatar
      v-if="hiddenCount > 0 && showCounter"
      :initials="`+${hiddenCount}`"
      bg-color="#F3F4F6"
      text-class="text-black"
      :size="size"
      :ring="ring"
      :ring-color="ringColor"
      title="More"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Avatar from '@/components/atoms/Avatar.vue'

type AgentRecord = {
  id: string
  fields: {
    number?: number
    agent_name?: string
    agent_surname?: string
    color?: string // "#RRGGBB"
  }
}

const props = defineProps<{
  items: AgentRecord[]
  size?: 'xs'|'sm'|'md'|'lg'
  max?: number
  showCounter?: boolean
  overlap?: string
  ring?: boolean
  ringColor?: string
}>()

const size = computed(() => props.size ?? 'md')
const max = computed(() => props.max ?? 5)
const showCounter = computed(() => props.showCounter ?? true)
const overlap = computed(() => props.overlap ?? '-space-x-2')
const ring = computed(() => props.ring ?? true)
const ringColor = computed(() => props.ringColor ?? 'ring-white')

function toInitials(name?: string, surname?: string, fallback?: string) {
  const n = (name ?? '').trim()
  const s = (surname ?? '').trim()
  const i = `${n[0] ?? ''}${s[0] ?? ''}`.toUpperCase()
  return i || (fallback ?? '?')
}

function pickTextColor(hex?: string) {
  if (!hex) return 'text-white'
  const h = hex.replace('#', '')
  if (h.length !== 6) return 'text-white'
  const r = parseInt(h.slice(0,2), 16)
  const g = parseInt(h.slice(2,4), 16)
  const b = parseInt(h.slice(4,6), 16)
  const yiq = (r*299 + g*587 + b*114) / 1000
  return yiq >= 128 ? 'text-black' : 'text-white'
}

const avatars = computed(() => {
  return (props.items ?? []).map((rec) => {
    const f = rec.fields ?? {}
    const initials = toInitials(f.agent_name, f.agent_surname, String(f.number ?? ''))
    const title = `${(f.agent_name ?? '').trim()} ${(f.agent_surname ?? '').trim()}`.trim() || `Agent #${f.number ?? ''}`
    const bgColor = f.color ?? '#9CA3AF'
    const textClass = pickTextColor(bgColor)
    return { key: rec.id, initials, title, bgColor, textClass }
  })
})

const visible = computed(() => {
  if (!max.value || avatars.value.length <= max.value) return avatars.value
  return avatars.value.slice(0, max.value)
})

const hiddenCount = computed(() => {
  if (!max.value) return 0
  return Math.max(avatars.value.length - max.value, 0)
})
</script>
