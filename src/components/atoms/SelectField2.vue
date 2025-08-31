<template>
  <div class="relative">
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      class="w-full appearance-none rounded-xl border border-gray-300 px-4 py-3 pr-10 text-sm focus:outline-none bg-white"
    >
      <slot/>
    </select>
    <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
      <slot name="icon"/>
    </span>
  </div>
</template>

<script setup>
defineProps({ modelValue: [String, Number] })
defineEmits(['update:modelValue'])
</script>
