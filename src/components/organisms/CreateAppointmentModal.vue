<template>
  <div v-if="open" class="absolute inset-0 flex items-center justify-center bg-black/70 z-50">
    <div class="max-w-xl w-full mx-auto">
      <div class="bg-[#ECF3F3] border border-gray-300 rounded-lg p-6 shadow-lg shadow-black">
        <div class="flex items-center justify-center gap-2 mb-5">
          <CalendarPlus2 class="w-6 h-6 text-gray-700"/>
          <span class="text-md font-semibold text-gray-800">Create an Appointment</span>
        </div>

        <div class="mb-4">
          <SearchSuggest v-model="search" :source="appointments" @select="onPick"/>
        </div>

        <div class="mb-4">
          <AddressField v-model="address" :error="errorLocation===2 ? errorMessage : ''"/>
        </div>

        <div class="mb-4">
          <AgentSelect v-model="agentId" :agents="agents" :error="errorLocation===3 ? errorMessage : ''"/>
        </div>

        <div class="mb-8">
          <AppointmentDateField v-model="appointmentAt" :error="errorLocation===4 ? errorMessage : ''"/>
        </div>

        <div class="flex justify-end gap-3">
          <AppButton variant="dark" @click="$emit('cancel')">Cancel</AppButton>
          <AppButton :variant="createEnabled ? 'primary' : 'muted'" :disabled="!createEnabled" @click="submit">Create</AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { CalendarPlus2 } from 'lucide-vue-next'
import AppButton from '@/components/atoms/AppButton.vue'
import SearchSuggest from '@/components/molecules/SearchSuggest.vue'
import AddressField from '@/components/molecules/AddressField.vue'
import AgentSelect from '@/components/molecules/AgentSelect.vue'
import AppointmentDateField from '@/components/molecules/AppointmentDateField.vue'
import { safeGet } from '@/helpers/utils.js'

const props = defineProps({
  open: Boolean,
  appointments: { type: Array, default: () => [] }, // AppointmentRecord[]
  agents: { type: Array, default: () => [] },       // AgentRecord[]
  errorMessage: { type: String, default: 'Invalid input' },
  errorLocation: { type: Number, default: -1 },
})
const emit = defineEmits(['cancel','create'])

const search = ref('')
const address = ref('')
const agentId = ref('')
const appointmentAt = ref('')
const userId = ref('')

const createEnabled = computed(() => !!(userId.value && address.value && agentId.value && appointmentAt.value))

function onPick(item) {
  userId.value = item?.id || ''
  search.value = `${safeGet(item,'fields.contact_name[0]','')} ${safeGet(item,'fields.contact_surname[0]','')}`.trim()
  const addr = safeGet(item,'fields.appointment_address','')
  if (addr) address.value = addr
}

function submit() {
  emit('create', {
    userId: userId.value,
    address: address.value,
    agentId: agentId.value,
    appointmentAt: appointmentAt.value,
  })
}
</script>
