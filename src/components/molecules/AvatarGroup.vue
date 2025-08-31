<template>
  <div class="relative">
    <!-- compact bar -->
    <div :class="['flex items-center', overlap]">
      <div
        v-for="a in visible"
        :key="a.key"
        class="rounded-full cursor-pointer transition-shadow"
        :class="isSelected(a.key) ? 'ring-2 ring-[#EC1D80]' : 'ring-0'"
        @click="toggle(a.key)"
        :title="a.title"
      >
        <Avatar
          :initials="a.initials"
          :bg-color="a.bgColor"
          :text-class="a.textClass"
          :size="size"
          :ring="ring"
          :ring-color="ringColor"
        />
      </div>

      <!-- counter (+N) -->
      <div
        v-if="hiddenCount > 0 && showCounter"
        class="rounded-full cursor-pointer"
        @click="expanded = true"
        title="Show all agents"
      >
        <Avatar
          :initials="`+${hiddenCount}`"
          bg-color="#F3F4F6"
          text-class="text-black"
          :size="size"
          :ring="ring"
          :ring-color="ringColor"
        />
      </div>
    </div>

    <!-- expanded panel -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="expanded"
        class="absolute z-50 mt-2 w-64 max-h-80 overflow-auto bg-white border border-gray-200 rounded-xl shadow-lg p-2"
      >
        <div class="flex items-center justify-between px-1 py-1">
          <span class="text-sm font-medium text-gray-700">Select agents</span>
          <button class="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200" @click="expanded=false">Done</button>
        </div>

        <ul class="divide-y divide-gray-100">
          <li
            v-for="a in avatars"
            :key="a.key"
            class="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-50 px-2 rounded"
            @click="toggle(a.key)"
          >
            <div class="rounded-full" :class="isSelected(a.key) ? 'ring-2 ring-[#EC1D80]' : 'ring-0'">
              <Avatar
                :initials="a.initials"
                :bg-color="a.bgColor"
                :text-class="a.textClass"
                size="sm"
                :ring="ring"
                :ring-color="ringColor"
              />
            </div>
            <div class="min-w-0">
              <div class="text-sm font-medium text-gray-900 truncate">{{ a.title }}</div>
            </div>
            <div class="ml-auto">
              <input type="checkbox" class="h-4 w-4" :checked="isSelected(a.key)" @change.stop="toggle(a.key)" />
            </div>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
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
  selected?: string[]
}>()

const emit = defineEmits<{
  (e:'update:selected', value: string[]): void
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

/** selection state */
const selectedIds = ref<string[]>(props.selected ?? [])
function isSelected(id: string) {
  return selectedIds.value.includes(id)
}
function toggle(id: string) {
  const idx = selectedIds.value.indexOf(id)
  if (idx === -1) selectedIds.value = [...selectedIds.value, id]
  else selectedIds.value = selectedIds.value.filter(x => x !== id)
  emit('update:selected', selectedIds.value)
}

/** expand panel */
const expanded = ref(false)
function onDocClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  // detect outside click
  if (!target.closest) return
  const root = target.closest('.relative')
  if (!root) expanded.value = false
}
onMounted(() => document.addEventListener('click', onDocClick, true))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick, true))
</script>
