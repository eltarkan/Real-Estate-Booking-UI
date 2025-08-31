<template>
  <div class="flex flex-row w-full px-2 py-4 border-b-2 border-gray-400 items-center gap-6">
    <!-- Left: avatars (multi-select) -->
    <AvatarGroup
      :items="agents"
      size="md"
      :max="5"
      overlap="-space-x-2"
      :ring="true"
      ring-color="ring-white"
      :show-counter="true"
      :selected="selectedAgents"
      @update:selected="val => selectedAgents = val"
    />

    <!-- Middle: filters -->
    <div class="flex flex-row gap-4 flex-1">
      <StatusSelect v-model="status" />
      <DateRangePicker v-model:from="from" v-model:to="to" />
    </div>

    <!-- Right: search -->
    <SearchBox v-model="q" placeholder="Search..." @submit="onSubmit" />
  </div>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import AvatarGroup from '@/components/molecules/AvatarGroup.vue'
import StatusSelect from '@/components/molecules/StatusSelect.vue'
import DateRangePicker from '@/components/molecules/DateRangePicker.vue'
import SearchBox from '@/components/molecules/SearchBox.vue'

type AgentRecord = {
  id: string
  fields: { number?: number; agent_name?: string; agent_surname?: string; color?: string; appointments?: string[] }
}

const props = defineProps<{ agents: AgentRecord[] }>()
const emit  = defineEmits<{
  (e:'update:filters', payload: { status:string; from:string; to:string; q:string; agents:string[] }): void
  (e:'search', q:string): void
}>()

const status = ref('all')
const from   = ref('')
const to     = ref('')
const q      = ref('')

let selectedAgents = ref<string[]>([])

watch([status, from, to, q, selectedAgents], () => {
  emit('update:filters', {
    status: status.value,
    from: from.value,
    to: to.value,
    q: q.value,
    agents: selectedAgents.value,
  })
}, { immediate: true })

function onSubmit(v:string) {
  emit('search', v)
}
</script>
