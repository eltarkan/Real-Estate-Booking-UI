<template>
  <div class="flex flex-col w-1/4 items-center justify-center">
    <AvatarGroup
      :items="items"
      :max="max"
      size="md"
      overlap="-space-x-2"
      :ring="true"
      ring-color="ring-white"
      counter-bg-class="bg-gray-100"
      counter-text-class="text-black"
    />
  </div>
</template>

<script setup>
import AvatarGroup from '@/components/molecules/AvatarGroup.vue'
const props = defineProps({
  items: { type: Array, default: () => [] },
  max: { type: Number, default: 5 },
})
</script>
