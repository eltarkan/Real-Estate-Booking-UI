<template>
  <nav class="flex items-center gap-2 w-full justify-end pb-4 p-2" role="navigation" aria-label="Pagination">
    <!-- Prev -->
    <PageChip
      :disabled="page <= 1"
      @click="go(page - 1)"
      aria-label="Previous page"
    >
      ‹
    </PageChip>

    <!-- Numbers / Dots -->
    <template v-for="(it, i) in items" :key="i">
      <PageChip
        v-if="it.type === 'page'"
        :active="it.value === page"
        @click="go(it.value)"
        :aria-label="`Page ${it.value}`"
      >
        {{ it.value }}
      </PageChip>
      <span
        v-else
        class="inline-flex items-center justify-center h-9 w-9 text-slate-400"
        aria-hidden="true"
      >
        …
      </span>
    </template>

    <!-- Next -->
    <PageChip
      :disabled="page >= totalPages"
      @click="go(page + 1)"
      aria-label="Next page"
    >
      ›
    </PageChip>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import PageChip from '@/components/atoms/PageChip.vue'

const props = defineProps({
  page: { type: Number, default: 1 },
  totalPages: { type: Number, required: true },
  siblingCount: { type: Number, default: 1 },
  boundaryCount: { type: Number, default: 1 },
})

const emit = defineEmits(['update:page'])

function go(p) {
  const clamped = Math.min(Math.max(1, p), props.totalPages)
  if (clamped !== props.page) emit('update:page', clamped)
}

const items = computed(() => {
  const total = props.totalPages
  const page = props.page
  const sib = Math.max(0, props.siblingCount)
  const bound = Math.max(0, props.boundaryCount)

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => ({ type: 'page', value: i + 1 }))
  }

  const startPages = range(1, Math.min(bound, total))
  const endPages = range(Math.max(total - bound + 1, bound + 1), total)

  const left = Math.max(Math.min(page - sib, total), bound + 2)
  const right = Math.min(Math.max(page + sib, 0), total - bound - 1)

  const middle = range(left, right)

  const showLeftDots = left > bound + 2
  const showRightDots = right < total - bound - 1

  return [
    ...startPages.map(v => ({ type: 'page', value: v })),
    ...(showLeftDots ? [{ type: 'dots' }] : (left === bound + 2 ? [{ type: 'page', value: bound + 1 }] : [])),
    ...middle.map(v => ({ type: 'page', value: v })),
    ...(showRightDots ? [{ type: 'dots' }] : (right === total - bound - 1 ? [{ type: 'page', value: total - bound }] : [])),
    ...endPages.map(v => ({ type: 'page', value: v })),
  ]
})

function range(a, b) {
  if (b < a) return []
  return Array.from({ length: b - a + 1 }, (_, i) => a + i)
}
</script>
