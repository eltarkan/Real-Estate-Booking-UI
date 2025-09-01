<template>
  <div v-if="open" class="absolute inset-0 flex items-center justify-center bg-black/70 z-50 overflow-auto">
    <div class="max-w-md w-full mx-auto max-h-screen">
      <div class="bg-[#ECF3F3] border border-gray-300 rounded-2xl p-5 shadow-2xl shadow-black">
        <!-- Header -->
        <div class="flex items-center justify-center gap-2 mb-4">
          <CalendarPlus2 class="w-5 h-5 text-gray-700" />
          <span class="text-base font-semibold text-gray-800">Edit the Appointment</span>
        </div>

        <!-- Contact -->
        <div class="mb-3">
          <div class="rounded-xl border border-gray-300 bg-white p-3">
            <div class="flex items-start gap-3">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 text-sm text-gray-800 font-medium">
                  <User class="w-4 h-4 text-gray-500" />
                  <span class="truncate">{{ contactFullName }}</span>
                </div>
                <div class="mt-1 flex items-center gap-2 text-xs text-gray-500">
                  <Mail class="w-4 h-4" />
                  <span class="truncate">{{ contactEmail }}</span>
                </div>
                <div class="mt-1 flex items-center gap-2 text-xs text-gray-500">
                  <Phone class="w-4 h-4" />
                  <span class="truncate">{{ contactPhone }}</span>
                </div>
              </div>
              <button class="text-gray-400 hover:text-gray-600" @click="$emit('close')">
                <X class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Address -->
        <div class="mb-4">
          <AddressField v-model="local.address" />
        </div>

        <div class="mb-4">
          <AgentSelect v-model="local.agentId" :agents="agents" />
        </div>

        <!-- Date -->
        <div class="mb-4">
          <AppointmentDateField v-model="local.appointmentAt" />
        </div>

        <!-- Status -->
        <div class="mb-5">
          <div class="rounded-xl border border-gray-300 bg-white px-3 py-2">
            <div class="flex items-center gap-2">
              <ChevronDown class="w-5 h-5 text-gray-500 shrink-0" />
              <select v-model="local.status" class="flex-1 bg-transparent outline-none text-sm">
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div class="mb-2">
          <span class="text-sm text-gray-700">Related Appointments:</span>
        </div>

        <div class="mb-6 max-h-52 overflow-auto">
          <div
            v-for="ra in related"
            :key="ra.id"
            class="rounded-xl border border-gray-300 bg-white px-3 py-3 mb-2"
          >
            <div class="flex items-center gap-3">
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium text-gray-800 truncate flex flex-row gap-3">
                  <Home class="w-5 h-5 text-gray-500 shrink-0" />
                  {{ ra.appointmentAddress }}
                </div>
                <div class="mt-2 flex items-center justify-between gap-2 w-full">
                  <div class="inline-flex items-center justify-between rounded-full bg-[#EC1C80] p-3 w-2/3">
                    <span class="inline-flex items-center rounded-full bg-white p-2 text-xs font-semibold leading-none text-green-600">
                      {{ ra.status}}
                    </span>
                    <span class="flex items-center gap-1 text-xs text-white">
                      <Clock class="w-3.5 h-3.5 opacity-90" />
                      {{ ra.appointmentDate }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3">
          <AppButton variant="dark" @click="$emit('close')">Close</AppButton>
          <AppButton variant="primary" @click="onSave">Save</AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, computed } from 'vue'
import { CalendarPlus2, ChevronDown, Clock, Home, Mail, Phone, User, X } from 'lucide-vue-next'
import AppButton from '@/components/atoms/AppButton.vue'
import AgentSelect from '@/components/molecules/AgentSelect.vue'
import AppointmentDateField from '@/components/molecules/AppointmentDateField.vue'
import AddressField from '@/components/molecules/AddressField.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  // Airtable record
  appointment: { type: Object, default: null },
  agents: { type: Array, default: () => [] },
  related: { type: Array, default: () => [] },
})
const emit = defineEmits(['close', 'save'])

const local = reactive({
  address: '',
  agentId: '',
  appointmentAt: '',
  status: 'upcoming',
})

/** helpers */
const f = computed(() => props.appointment?.fields ?? {})
const contactFullName = computed(() => {
  const n = (f.value.contact_name?.[0] ?? '').trim()
  const s = (f.value.contact_surname?.[0] ?? '').trim()
  return [n, s].filter(Boolean).join(' ') || '—'
})
const contactEmail = computed(() => f.value.contact_email?.[0] ?? '—')
const contactPhone = computed(() => String(f.value.contact_phone?.[0] ?? '—'))

function toInputLocal(v) {
  if (!v) return ''
  const d = new Date(v)
  if (isNaN(d.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  // YYYY-MM-DDTHH:mm
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

watch(
  () => props.appointment,
  (rec) => {
    const fv = rec?.fields ?? {}
    local.address       = fv.appointment_address ?? ''
    local.agentId       = (fv.agent_id?.[0] ?? '')
    local.appointmentAt = toInputLocal(fv.appointment_date)

    if (fv.is_cancelled) local.status = 'cancelled'
    else {
      const ts = fv.appointment_date ? new Date(fv.appointment_date).getTime() : NaN
      local.status = !isNaN(ts) && ts < Date.now() ? 'completed' : 'upcoming'
    }
  },
  { immediate: true }
)

function onSave() {
  emit('save', {
    appointmentId: props.appointment?.id,
    userId: props.appointment.fields.contact_id,
    address: local.address,
    agentId: local.agentId,
    appointmentAt: local.appointmentAt, // datetime-local
    isCancelled: local.status == 'cancelled',
  })
}
</script>
