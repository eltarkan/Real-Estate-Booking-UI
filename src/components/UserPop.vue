<template>
  <div class="flex -space-x-1">
    <div
      v-for="(user, index) in users"
      :key="index"
      class="flex items-center justify-center rounded-full h-10 w-10 ring-3 ring-white"
      :class="user.bg"
    >
      <span class="text-black text-sm">{{ user.initials }}</span>
    </div>
  </div>
</template>

<script setup>
const users = [
  { initials: "LK", bg: "bg-lime-400 text-black" },
  { initials: "AES", bg: "bg-blue-500" },
  { initials: "GI", bg: "bg-orange-500" },
  { initials: "MB", bg: "bg-purple-500" },
  { initials: "YT", bg: "bg-green-400" },
  { initials: "+4", bg: "bg-gray-100 text-black" },
];
</script>
