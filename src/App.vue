<template>
  <div class="w-screen h-screen flex flex-col">
    <Navbar />

    <div class="flex flex-col">
      <AppointmentDetailBar
        :title="`${store.total} Appointments found.`"
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

      <div class="mt-4">
        <Pagination
          v-model:page="store.page"
          :total-pages="store.totalPages"
        :sibling-count="1"
        :boundary-count="1"
        @update:page="store.setPage"
        />
      </div>
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
  await store.fetchAll()
  await store.dummyDataFeed()
})
</script>
