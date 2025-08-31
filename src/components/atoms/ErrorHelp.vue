<template>
  <div v-if="message" class="px-2">
    <span class="text-sm text-red-600 font-semibold">{{ message }}</span>
  </div>
</template>
<script setup>
defineProps({ message: String })
</script>
