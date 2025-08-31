<template>
  <div class="flex lg:w-1/4 w-full flex-col gap-y-1.5">
    <IconText size="24" :icon="User" text-class="font-semibold text-slate-900">
      <span class="text-md">{{ name }} {{ surname }}</span>
    </IconText>
    <IconText size="24" :icon="Mail">
      <span class="text-[12px]">{{ email.toLowerCase() }}</span>
    </IconText>
    <IconText size="24" :icon="Phone">
      <span class="text-[12px]">{{ phone }}</span>
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
  phone: Number,
})
</script>
