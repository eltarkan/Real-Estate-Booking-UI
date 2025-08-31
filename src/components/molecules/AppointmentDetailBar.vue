<template>
  <div class="flex flex-row items-center justify-between px-2 py-4 border-b-2 border-gray-200">
    <span class="font-bold text-md">
      {{ title }}
    </span>
    <Button @click="openModal" :variant="buttonVariant" :size="buttonSize" custom-class="flex flex-row items-center gap-2 hover:bg-pink-700 hover:cursor-pointer">
      <PlusCircle stroke-width="1" size="20" />
      {{ buttonText }}
    </Button>
  </div>
</template>

<script setup>
import Button from '@/components/atoms/Button.vue'
import { PlusCircle } from 'lucide-vue-next'

const props = defineProps({
  title: { type: String, default: '' },
  buttonText: { type: String, default: 'Click' },
  buttonVariant: { type: String, default: 'primary' },
  buttonSize: { type: String, default: 'md' },
})

const emit  = defineEmits(["open:modal"])

const openModal = () => {
  emit('open:modal')
}

</script>
