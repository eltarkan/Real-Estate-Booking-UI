<template>
  <SelectField v-model="model">
    <option disabled value="">Agent</option>
    <option v-for="a in agents" :key="a.id" :value="a.id">
      {{ a.fields.agent_name }} {{ a.fields.agent_surname }}
    </option>
    <template #icon><ChevronDown class="w-5 h-5"/></template>
  </SelectField>

  <ErrorHelp :message="error" />
</template>

<script setup lang="ts">
import SelectField from '@/components/atoms/SelectField2.vue'
import ErrorHelp from '@/components/atoms/ErrorHelp.vue'
import { ChevronDown } from 'lucide-vue-next'

const model = defineModel<string>()

const { agents, error } = defineProps<{
  agents: Array<any>
  error?: string
}>()
</script>
