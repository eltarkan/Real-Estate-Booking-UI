<template>
  <div class="inline-flex items-center justify-between w-full rounded-full bg-[#EC1C80] px-4 py-2 h-14 shadow">
    <!-- Status chip -->
    <div class="flex lg:flex-row flex-col bg-white w-1/2 rounded-full h-full items-center justify-evenly">
      <span
        :class="[
        'inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold leading-none',
        statusColorClass
      ]"
      >
      {{ statusLabel }}
      </span>

        <!-- Time left (Upcoming) -->
      <span v-if="timeLeft" class="text-sm font-medium text-black opacity-90">
        {{ timeLeft }}
      </span>
    </div>

    <!-- Right block: clock + date -->
    <div class="ml-4 w-1/2 flex items-center gap-2 text-white">
      <Clock :size="18" class="opacity-90" />
      <span class="text-sm font-medium opacity-90">
        {{ formattedDate }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import moment from 'moment'
import 'moment/locale/en-gb'
import { Clock } from 'lucide-vue-next'

const props = defineProps({
  isoDate: { type: String, required: true },
  isCancelled: { type: Boolean, default: false },
  displayFormat: { type: String, default: 'DD/MM/YYYY HH:mm' },
})

const now = ref(moment())
let t = null
onMounted(() => {
  t = setInterval(() => { now.value = moment() }, 60_000)
})
onUnmounted(() => { if (t) clearInterval(t) })

const m = computed(() => moment(props.isoDate))

const statusLabel = computed(() => {
  if (props.isCancelled) return 'Cancelled'
  if (m.value.isValid() && m.value.isBefore(now.value)) return 'Completed'
  return 'Upcoming'
})

const timeLeft = computed(() => {
  if (props.isCancelled) return ''
  if (!m.value.isValid()) return ''
  if (m.value.isBefore(now.value)) return '' // completed
  return m.value.from(now.value, true) + ' left'
})

const statusColorClass = computed(() => {
  if (props.isCancelled) return 'text-pink-600'
  if (m.value.isValid() && m.value.isBefore(now.value)) return 'text-green-600'
  return 'text-orange-500'
})

const formattedDate = computed(() =>
  m.value.isValid() ? m.value.format(props.displayFormat) : '--/--/---- --:--'
)
</script>
