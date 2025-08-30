<template>
  <div class="w-screen h-screen flex flex-col">
    <Navbar />

    <div class="flex flex-col">
      <AppointmentDetailBar
        title="134 Appointments found."
        button-text="Create Appointment"
        button-variant="primary"
        button-size="md"
      />

      <AppointmentList
        :loading="store.loading"
        :error="store.error"
        :items="store.items"
        :assignees="store.dummyData"
      />

      <Pagination
        v-model:page="store.page"
        :total-pages="store.items.length"
        @update:page="store.fetchPage"
      />

    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import AppointmentDetailBar from '@/components/molecules/AppointmentDetailBar.vue'
import AppointmentList from '@/components/organisms/AppointmentList.vue'
import Pagination from '@/components/molecules/Pagination.vue'
import { useAppointments } from '@/stores/appointments'

const store = useAppointments()

onMounted(async () => {
  await store.fetchPage(1)
  store.dummyDataFeed()
})
</script>
