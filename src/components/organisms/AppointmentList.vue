<template>
  <div class="flex flex-col">
    <div v-if="loading">Loading…</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else class="flex flex-col gap-4 p-2">
      <AppointmentRow
        v-for="(it, i) in items"
        :key="i"
        :item="it"
        :assignees="assignees"
      />
    </div>
  </div>
</template>

<script setup>
import AppointmentRow from '@/components/organisms/AppointmentRow.vue'

const props = defineProps({
  loading: Boolean,
  error: [String, Boolean],
  items: { type: Array, default: () => [] },
  assignees: { type: Array, default: () => [] },
})

</script>
