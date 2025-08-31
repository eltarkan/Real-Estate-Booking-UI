<template>
  <div class="w-screen h-screen flex flex-col relative">
    <CreateAppointmentModal
      :open="modalState"
      :appointments="appointmentsStore.allItems"
      :agents="agentStore.allItems"
      :error-message="errorMessage"
      :error-location="errorMessageLocation"
      @cancel="onCancel"
      @create="onCreate"
    />

    <AgentToolbar :agents="agentStore.allItems" @update:filters="onFilters" />

    <div class="flex flex-col">
      <AppointmentDetailBar
        :title="`${appointmentsStore.total} Appointments found.`"
        button-text="Create Appointment"
        button-variant="primary"
        button-size="md"
        @open:modal="openModal"
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
import { onMounted, ref } from 'vue'
import AgentToolbar from '@/components/organisms/AgentToolbar.vue'
import AppointmentDetailBar from '@/components/molecules/AppointmentDetailBar.vue'
import AppointmentList from '@/components/organisms/AppointmentList.vue'
import Pagination from '@/components/molecules/Pagination.vue'
import CreateAppointmentModal from '@/components/organisms/CreateAppointmentModal.vue'
import { useAppointments } from '@/stores/appointments'
import { useAgents } from '@/stores/agents'

const appointmentsStore = useAppointments()
const agentStore = useAgents()

const modalState = ref(true)
const errorMessage = ref('Invalid input')
const errorMessageLocation = ref(-1)

onMounted(async () => {
  await appointmentsStore.fetchAll()
  await agentStore.fetchAll()
})

function onFilters(p) { queueMicrotask(() => appointmentsStore.filter(p.q, p.to, p.from, p.status)) }
function openModal() { modalState.value = true }
function onCancel() { modalState.value = false }
function onCreate(payload) {
  console.log('create payload:', payload)
  modalState.value = false
  // TODO: API call
}
</script>
