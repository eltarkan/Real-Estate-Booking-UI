<template>
  <SelectField v-model="inner">
    <option value="all">All Statuses</option>
    <option value="cancelled">Cancelled</option>
    <option value="upcoming">Upcoming</option>
    <option value="completed">Completed</option>
  </SelectField>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import SelectField from '@/components/atoms/SelectField.vue'

const props = defineProps<{ modelValue?: string }>()
const emit  = defineEmits<{ (e:'update:modelValue', v:string): void }>()

const inner = ref(props.modelValue ?? 'all')
watch(() => props.modelValue, v => inner.value = v ?? 'all')
watch(inner, v => emit('update:modelValue', v))
</script>
