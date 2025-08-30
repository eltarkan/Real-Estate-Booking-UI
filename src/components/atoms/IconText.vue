<template>
  <div class="flex items-center gap-4 text-sm">
    <div class="w-10 flex justify-center">
      <component :is="icon" class="text-slate-500" :size="size" />
    </div>
    <div class="flex-1">
      <span :class="textClass"><slot /></span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  icon: { type: [Object, Function, String], required: true },
  size: { type: [String, Number], default: 20 },
  textClass: { type: String, default: 'font-medium text-slate-500' },
})
</script>
