<template>
  <input
    type="datetime-local"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    class="border rounded-lg border-gray-200 px-3 py-2 text-sm pr-10 focus:outline-none"
  />
</template>

<script setup lang="ts">
defineProps<{ modelValue: string | undefined }>()
defineEmits<{ (e:'update:modelValue', v:string): void }>()
</script>
