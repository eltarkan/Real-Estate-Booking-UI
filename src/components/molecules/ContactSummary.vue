<template>
  <div class="flex w-1/4 flex-col gap-y-1.5">
    <IconText :icon="User" text-class="font-semibold text-slate-900">
      {{ name }} {{ surname }}
    </IconText>
    <IconText :icon="Mail">
      {{ email }}
    </IconText>
    <IconText :icon="Phone">
      {{ phone }}
    </IconText>
  </div>
</template>

<script setup>
import IconText from '@/components/atoms/IconText.vue'
import { User, Mail, Phone } from 'lucide-vue-next'

const props = defineProps({
  name: String,
  surname: String,
  email: String,
  phone: String,
})
</script>
