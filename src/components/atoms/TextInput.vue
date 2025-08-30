<template>
  <div class="relative">
    <span v-if="$slots.icon" class="absolute inset-y-0 left-2 flex items-center text-gray-400">
      <slot name="icon" />
    </span>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :placeholder="placeholder"
      :class="[
        customClass ?? 'border rounded-lg border-gray-200 px-3 py-2 text-sm focus:outline-none',
        $slots.icon ? 'pl-9' : ''
      ]"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: string | undefined; placeholder?: string, customClass?: string }>()
defineEmits<{ (e:'update:modelValue', v:string): void }>()
</script>
