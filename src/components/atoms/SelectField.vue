<template>
  <select
    :value="modelValue"
    @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    class="border border-gray-200 rounded-lg px-4 py-2 text-sm lg:w-64 w-full focus:outline-none"
  >
    <slot />
  </select>
</template>

<script setup lang="ts">
defineProps<{ modelValue: string | number | undefined }>()
defineEmits<{ (e:'update:modelValue', v:string): void }>()
</script>
