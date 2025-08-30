<template>
  <div class="w-screen h-screen flex flex-col">
    <AgentToolbar
      :agents="agentStore.allItems"
      @update:filters="onFilters"
    />

    <div class="flex flex-col">
      <AppointmentDetailBar
        :title="`${appointmentsStore.total} Appointments found.`"
        button-text="Create Appointment"
        button-variant="primary"
        button-size="md"
      />

      <AppointmentList
        :loading="appointmentsStore.loading"
        :error="appointmentsStore.error"
        :items="appointmentsStore.items"
        :assignees="agentStore.allItems"
      />

      <div class="mt-4">
        <Pagination
          v-model:page="appointmentsStore.page"
          :total-pages="appointmentsStore.totalPages"
          :sibling-count="1"
          :boundary-count="1"
          @update:page="appointmentsStore.setPage"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import AppointmentDetailBar from '@/components/molecules/AppointmentDetailBar.vue'
import AppointmentList from '@/components/organisms/AppointmentList.vue'
import Pagination from '@/components/molecules/Pagination.vue'
import { useAppointments } from '@/stores/appointments'
import { useAgents } from '@/stores/agents.js'
import AgentToolbar from '@/components/organisms/AgentToolbar.vue'

const appointmentsStore = useAppointments()
const agentStore = useAgents()

onMounted(async () => {
  await appointmentsStore.fetchAll()
  await agentStore.fetchAll()
})


function onFilters(payload) {
  queueMicrotask(() => {
    appointmentsStore.filter(payload.q, payload.to, payload.from, payload.status)
  })
}


</script>
