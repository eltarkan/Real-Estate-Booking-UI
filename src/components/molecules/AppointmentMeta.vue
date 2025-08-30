<template>
  <div class="inline-flex items-center justify-between w-full rounded-full bg-[#EC1C80] px-4 py-2 h-14 shadow">
    <!-- Status chip -->
    <div class="flex flex-row bg-white w-1/2 rounded-full h-full items-center justify-evenly">
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
import moment from 'moment'
import 'moment/locale/en-gb'
import { Clock } from 'lucide-vue-next'

const props = defineProps({
  // ISO date (example: 2024-05-08T09:00:00Z)
  isoDate: { type: String, required: true },
  // cancelled
  isCancelled: { type: Boolean, default: false },
  // date format
  displayFormat: { type: String, default: 'DD/MM/YYYY HH:mm' },
})

const m = moment(props.isoDate)

let statusLabel = 'Upcoming'
let timeLeft = ''
let statusColorClass = 'text-pink-600'

if (props.isCancelled) {
  statusLabel = 'Cancelled'
  timeLeft = ''
  statusColorClass = 'text-pink-600'
} else if (m.isValid() && m.isBefore(moment())) {
  statusLabel = 'Completed'
  timeLeft = ''
  statusColorClass = 'text-green-600'
} else if (m.isValid()) {
  // upcoming → "X days" / "Y hours"
  timeLeft = m.fromNow(true)                // only text (no "in")
  statusColorClass = 'text-orange-500'
}

const formattedDate = m.isValid() ? m.format(props.displayFormat) : '--/--/---- --:--'
</script>
