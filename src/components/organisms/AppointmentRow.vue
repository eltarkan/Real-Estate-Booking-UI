<template>
  <div
    class="flex flex-row items-center w-full border-2 border-gray-300 rounded-lg p-2"
    :class="nTh % 2 === 0 ? 'bg-[#F0F5F5]' : ''"
  >
    <div class="flex lg:flex-row flex-col gap-y-2 w-11/12 mx-auto items-center justify-center">
      <ContactSummary
        :name="safeGet(item, 'fields.contact_name[0]', '')"
        :surname="safeGet(item, 'fields.contact_surname[0]', '')"
        :email="safeGet(item, 'fields.contact_email[0]', '')"
        :phone="safeGet(item, 'fields.contact_phone[0]', '')"
      />

      <AddressCell>
        {{ item.fields.appointment_address }}
      </AddressCell>

      <div class="flex lg:w-1/4 w-full items-center justify-end">
        <AppointmentMeta
          :is-cancelled="item.fields.is_cancelled === true"
          :iso-date="item.fields.appointment_date"
          display-format="DD/MM/YYYY HH:mm"
        />
      </div>

      <AssigneesCell :items="filterAssigneesByAppointmentId(item.id)" :max="5" />
    </div>
  </div>
</template>

<script setup>
import ContactSummary from '@/components/molecules/ContactSummary.vue'
import AddressCell from '@/components/molecules/AddressCell.vue'
import AppointmentMeta from '@/components/molecules/AppointmentMeta.vue'
import AssigneesCell from '@/components/molecules/AssigneesCell.vue'
import { safeGet } from '@/helpers/utils.js'

const filterAssigneesByAppointmentId = (id) => {
  return props.assignees.filter(it =>
    it.fields.appointments?.includes(id)
  )
}

const props = defineProps({
  item: { type: Object, required: true },
  assignees: { type: Array, default: () => [] }, // AvatarGroup
  nTh: { type: Number, default: 0 },
})
</script>
