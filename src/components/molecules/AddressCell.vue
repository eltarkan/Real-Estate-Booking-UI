<template>
  <div class="flex w-1/4 items-center gap-2">
    <House class="text-slate-500 shrink-0" />
    <span class="text-sm font-semibold text-slate-800 truncate">
      <slot />
    </span>
  </div>
</template>

<script setup>
import { House } from 'lucide-vue-next'
</script>
