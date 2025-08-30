<template>
  <div class="inline-flex items-center gap-3 rounded-full bg-pink-600 px-4 py-2 shadow">
    <Chip variant="inverse">{{ statusText }}</Chip>
    <div class="flex items-center gap-2 text-white">
      <Clock :size="18" class="opacity-90" />
      <span class="text-sm font-medium opacity-90">{{ dateText }}</span>
    </div>
  </div>
</template>

<script setup>
import { Clock } from 'lucide-vue-next'
import Chip from '@/components/atoms/Chip.vue'

const props = defineProps({
  statusText: { type: String, default: 'Cancelled' },
  dateText:   { type: String, default: '08/05/2024 09:00' },
})
</script>
