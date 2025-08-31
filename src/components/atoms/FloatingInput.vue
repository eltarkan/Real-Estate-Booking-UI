<template>
  <div class="relative">
    <input
      :id="id"
      :type="type"
      :placeholder="placeholderSpace ? ' ' : placeholder"
      class="peer w-full border border-gray-300 bg-white rounded-xl px-4 pt-6 pb-2 text-sm focus:outline-none"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <label
      v-if="label"
      :for="id"
      class="absolute left-4 text-gray-500 transition-all
             peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
             peer-focus:top-1 peer-focus:text-xs peer-focus:text-pink-600"
    >
      {{ label }}
    </label>
    <span v-if="$slots.icon" class="absolute inset-y-0 right-3 flex items-center text-gray-500">
      <slot name="icon"/>
    </span>
  </div>
</template>

<script setup>
defineProps({
  id: String,
  label: String,
  modelValue: String,
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  placeholderSpace: { type: Boolean, default: true },
})
defineEmits(['update:modelValue'])
</script>
