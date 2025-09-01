<template>
  <div class="w-screen h-screen flex flex-col relative">

    <CreateAppointmentModal
      :open="modalState"
      :appointments="appointmentsStore.allItems"
      :agents="agentStore.allItems"
      :error-message="errorMessage"
      :error-location="errorMessageLocation"
      :is-loading="isLoading"
      @cancel="onCancel"
      @create="onCreate"
    />

    <EditAppointmentModal
      :open="editModalState"
      :appointment="selectedRecord"
      :agents="agentStore.allItems"
      :related="relatedAppointments"
      @close="editModalState=false"
      @save="onSaveEdit"
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
        @update:filters="onFilters"
        @select="onSelectAppointment"
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
import { useToast } from "vue-toastification";

import { onMounted, ref } from 'vue'
import AgentToolbar from '@/components/organisms/AgentToolbar.vue'
import AppointmentDetailBar from '@/components/molecules/AppointmentDetailBar.vue'
import AppointmentList from '@/components/organisms/AppointmentList.vue'
import Pagination from '@/components/molecules/Pagination.vue'
import CreateAppointmentModal from '@/components/organisms/CreateAppointmentModal.vue'
import EditAppointmentModal from '@/components/organisms/EditAppointmentModal.vue'
import { useAppointments } from '@/stores/appointments'
import { useAgents } from '@/stores/agents'

const toast = useToast();

const appointmentsStore = useAppointments()
const agentStore = useAgents()

const modalState = ref(false)
const editModalState = ref(false)
const errorMessage = ref('Invalid input')
const errorMessageLocation = ref(-1)
const isLoading = ref(false)

const selectedRecord = ref(null)

const relatedAppointments = ref([])

onMounted(async () => {
  await appointmentsStore.fetchAll()
  await agentStore.fetchAll()
})

function onFilters(p) {
  console.log(agentStore.allItems)
  console.log('Selected agents:', p.agents)
  queueMicrotask(() =>
    appointmentsStore.filter(p.q, p.to, p.from, p.status, p.agents)
  )
}

function openModal() { modalState.value = true }
function onCancel() { modalState.value = false }

function onSelectAppointment(record) {
  selectedRecord.value = record
  console.log(selectedRecord.value)
  relatedAppointments.value = appointmentsStore.getUsersAppointments(selectedRecord.value)
  editModalState.value = true
}

function onCreate(payload) {
  isLoading.value = true
  appointmentsStore.createAppointment(payload)
    .then(() => {
      appointmentsStore.reset()
      appointmentsStore.fetchAll()
      toast.success("Appointment created successfully.", {
        timeout: 2000
      });
      modalState.value = false
    })
    .catch(console.error)
    .finally(() => { isLoading.value = false })
}

// Edit modal save
function onSaveEdit(updated) {
  isLoading.value = true
  appointmentsStore.updateAppointment(updated)
    .then(() => {
      appointmentsStore.reset()
      appointmentsStore.fetchAll()
      toast.success("Appointment saved successfully.", {
        timeout: 2000
      });
      editModalState.value = false
    })
    .catch(console.error)
    .finally(() => { isLoading.value = false })
}

</script>
