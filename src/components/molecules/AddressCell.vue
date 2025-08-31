<template>
  <div class="flex lg:w-1/4 w-full items-center gap-4 lg:px-0">
    <House class="text-slate-500 shrink-0 w-10" />
    <span class="text-sm font-semibold text-slate-800 truncate">
      <slot />
    </span>
  </div>
</template>

<script setup>
import { House } from 'lucide-vue-next'
</script>
