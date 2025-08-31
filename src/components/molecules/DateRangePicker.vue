<template>
  <div class="flex gap-4 lg:flex-row flex-col">
    <DateTimeInput v-model="fromInner" />
    <DateTimeInput v-model="toInner" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import DateTimeInput from '@/components/atoms/DateTimeInput.vue'

const props = defineProps<{ from?: string; to?: string }>()
const emit  = defineEmits<{ (e:'update:from', v:string): void; (e:'update:to', v:string): void }>()

const fromInner = ref(props.from ?? '')
const toInner   = ref(props.to ?? '')

watch(() => props.from, v => fromInner.value = v ?? '')
watch(() => props.to,   v => toInner.value   = v ?? '')

watch(fromInner, v => emit('update:from', v))
watch(toInner,   v => emit('update:to', v))
</script>
