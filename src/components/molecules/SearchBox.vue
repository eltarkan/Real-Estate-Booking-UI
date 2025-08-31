<template>
  <div class="flex">
    <TextInput
      custom-class="w-full border-2 border-r-0 rounded-lg rounded-r-none border-gray-200 px-3 py-2 text-sm focus:outline-none"
      v-model="qInner"
      :placeholder="placeholder"
    >
      <template #icon>
        <Search class="w-5 h-5" />
      </template>
    </TextInput>
    <button
      class="rounded-lg rounded-l-none border-gray-200 border-2 w-16 flex items-center justify-center focus:border-[#EC1C80]"
      @click="$emit('submit', qInner)"
    >
      <Search class="w-5 h-5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Search } from 'lucide-vue-next'
import TextInput from '@/components/atoms/TextInput.vue'

const props = defineProps<{ modelValue?: string; placeholder?: string }>()
const emit  = defineEmits<{ (e:'update:modelValue', v:string): void; (e:'submit', v:string): void }>()
const qInner = ref(props.modelValue ?? '')

watch(() => props.modelValue, v => qInner.value = v ?? '')
watch(qInner, v => emit('update:modelValue', v))
</script>
