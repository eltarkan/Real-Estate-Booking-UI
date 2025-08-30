<template>
  <div class="flex flex-row w-full px-2 py-4 border-b-2 border-gray-400">

    <AvatarGroup
      :items="store.dummyData"
      size="md"
      :max="5"
      overlap="-space-x-2"
      :ring="true"
      ring-color="ring-white"
      avatar-class=""
      counter-bg-class="bg-gray-100"
      counter-text-class="text-black"
    />

    <div class="flex flex-row gap-4 w-full px-10">
      <select class="border-gray-200 border-1 rounded-lg px-4 py-2 text-sm w-64 focus:outline-0">
        <option>All Statuses</option>
        <option>Cancelled</option>
        <option>Upcoming</option>
        <option>Completed</option>
      </select>

      <input
        type="datetime-local"
        class="border rounded-lg border-gray-200 px-3 py-2 text-sm pr-10 focus:outline-0"
      />

      <input
        type="datetime-local"
        class="border rounded-lg border-gray-200 px-3 py-2 text-sm pr-10 focus:outline-0"
      />

    </div>

    <div class="flex flex-row w-1/6">
      <input
        type="text"
        class="border-2 rounded-lg rounded-r-none border-r-0 border-gray-200 px-3 py-2 text-sm pr-10 focus:outline-0 placeholder:text-center w-96"
        placeholder="Search..."
      />
      <button class="rounded-lg rounded-l-none border-gray-200 border-2 w-16 flex items-center justify-center focus:border-pink-600">
        <Search class="w-5 h-5"/>

      </button>
    </div>

  </div>
</template>
<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import AvatarGroup from '@/components/molecules/AvatarGroup.vue'

import { useAppointments } from '@/stores/appointments'
const store = useAppointments()

store.dummyDataFeed()

</script>
