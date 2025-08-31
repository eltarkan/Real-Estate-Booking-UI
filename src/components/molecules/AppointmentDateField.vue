<template>
  <DateTimeInput
    :model-value="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <template #icon>
      <CalendarPlus2 class="w-5 h-5"/>
    </template>
  </DateTimeInput>

  <ErrorHelp :message="error" />
</template>

<script setup>
import DateTimeInput from '@/components/atoms/DateTimeInput2.vue'
import ErrorHelp from '@/components/atoms/ErrorHelp.vue'
import { CalendarPlus2 } from 'lucide-vue-next'

const props = defineProps({
  modelValue: String,
  error: String
})
const emit = defineEmits(['update:modelValue'])
</script>
