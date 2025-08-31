<template>
  <DateTimeInput
    :model-value="modelValue"
    @update:modelValue="onPick"
  >
    <template #icon>
      <CalendarPlus2 class="w-5 h-5"/>
    </template>
  </DateTimeInput>

  <ErrorHelp :message="localError || error" />
</template>

<script setup>
import { ref } from 'vue'
import DateTimeInput from '@/components/atoms/DateTimeInput2.vue'
import ErrorHelp from '@/components/atoms/ErrorHelp.vue'
import { CalendarPlus2 } from 'lucide-vue-next'

const props = defineProps({
  modelValue: String,
  error: String
})
const emit = defineEmits(['update:modelValue'])

const localError = ref('')

function onPick(val) {
  if (!val) {
    localError.value = ''
    emit('update:modelValue', val)
    return
  }

  const picked = new Date(val)
  const now = new Date()

  if (isNaN(picked.getTime())) {
    localError.value = 'Invalid date'
    return
  }

  if (picked < now) {
    localError.value = 'Please choose a future date/time'
    return
  }

  localError.value = ''
  emit('update:modelValue', val)
}
</script>
