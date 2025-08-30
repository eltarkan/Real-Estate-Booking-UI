<template>
  <div class="flex flex-row items-center justify-between px-2 py-4 border-b-2 border-gray-200">
    <span class="font-bold text-md">
      {{ title }}
    </span>
    <Button :variant="buttonVariant" :size="buttonSize">
      {{ buttonText }}
    </Button>
  </div>
</template>

<script setup>
import Button from '@/components/atoms/Button.vue'

const props = defineProps({
  title: { type: String, default: '' },
  buttonText: { type: String, default: 'Click' },
  buttonVariant: { type: String, default: 'primary' },
  buttonSize: { type: String, default: 'md' },
})
</script>
