<template>
  <FloatingInput
    :id="id"
    label="Address"
    :model-value="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <template #icon><Home class="w-5 h-5"/></template>
  </FloatingInput>

  <ErrorHelp :message="error" />
</template>

<script setup>
import FloatingInput from '@/components/atoms/FloatingInput.vue'
import ErrorHelp from '@/components/atoms/ErrorHelp.vue'
import { Home } from 'lucide-vue-next'

const props = defineProps({
  modelValue: String,
  id: { type: String, default: 'address' },
  error: String
})
const emit = defineEmits(['update:modelValue'])
</script>
