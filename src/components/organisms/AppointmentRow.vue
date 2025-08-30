<template>
  <div class="flex flex-row items-center w-full bg-[#F0F5F5] rounded-lg p-2">
    <div class="flex flex-row w-11/12 mx-auto items-center justify-center">
      <ContactSummary
        :name="get(item, 'fields.contact_name[0]', '')"
        :surname="get(item, 'fields.contact_surname[0]', '')"
        :email="get(item, 'fields.contact_email[0]', '')"
        :phone="get(item, 'fields.contact_phone[0]', '')"
      />

      <AddressCell>
        {{ item.fields.appointment_address }}
      </AddressCell>

      <div class="flex w-1/4 items-center justify-end">
        <AppointmentMeta
          :is-cancelled="item.fields.is_cancelled === true"
          :iso-date="item.fields.appointment_date"
          display-format="DD/MM/YYYY HH:mm"
        />

      </div>

      <AssigneesCell :items="assignees" :max="5" />
    </div>
  </div>
</template>

<script setup>
import ContactSummary from '@/components/molecules/ContactSummary.vue'
import AddressCell from '@/components/molecules/AddressCell.vue'
import AppointmentMeta from '@/components/molecules/AppointmentMeta.vue'
import AssigneesCell from '@/components/molecules/AssigneesCell.vue'

const get = (obj, path, fallback = '') => {
  try {
    // path 'fields.contact_name[0]':
    return path
      .replace(/\[(\d+)\]/g, '.$1')
      .split('.')
      .reduce((o, k) => (o && k in o ? o[k] : undefined), obj) ?? fallback
  } catch { return fallback }
}

const props = defineProps({
  item: { type: Object, required: true },
  assignees: { type: Array, default: () => [] }, // AvatarGroup
})
</script>
