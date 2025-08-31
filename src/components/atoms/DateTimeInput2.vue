<template>
  <div class="relative">
    <input
      type="datetime-local"
      class="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 text-sm focus:outline-none bg-white"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <span v-if="$slots.icon" class="absolute inset-y-0 right-3 flex items-center text-gray-500">
      <slot name="icon"/>
    </span>
  </div>
</template>

<script setup>
defineProps({ modelValue: String })
defineEmits(['update:modelValue'])
</script>
