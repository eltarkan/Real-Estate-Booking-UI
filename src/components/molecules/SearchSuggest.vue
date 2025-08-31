<template>
  <div class="relative">
    <div class="flex">
      <input
        :value="modelValue"
        @input="onInput"
        @blur="validateTerm"
        type="text"
        placeholder="Search"
        class="flex-1 rounded-l-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none bg-white"
        @focus="open = true"
        @keydown.down.prevent="move(1)"
        @keydown.up.prevent="move(-1)"
        @keydown.enter.prevent="onEnter"
        @keydown.esc.prevent="open=false"
      />
      <button class="rounded-r-xl bg-black text-white px-4 flex items-center justify-center hover:cursor-pointer" @click="onClick">
        <Search class="w-5 h-5"/>
      </button>
    </div>

    <ErrorHelp :message="errorMessage"/>

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="open && suggestions.length"
        class="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
      >
        <ul class="max-h-72 overflow-auto">
          <li
            v-for="(item, i) in suggestions"
            :key="item.id"
            class="px-4 py-2 text-sm cursor-pointer flex items-center gap-3"
            :class="i===active ? 'bg-gray-100' : ''"
            @mousedown.prevent="choose(item)"
            @mouseenter="active=i"
          >
            <div class="min-w-0">
              <div class="font-medium text-gray-900 truncate">
                {{ safeGet(item, 'fields.contact_name[0]', '') }}
                {{ safeGet(item, 'fields.contact_surname[0]', '') }}
              </div>
              <div class="text-gray-500 truncate">
                {{ safeGet(item, 'fields.contact_email[0]', '') }} |
                {{ safeGet(item, 'fields.contact_phone[0]', '') }}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Search } from 'lucide-vue-next'
import ErrorHelp from '@/components/atoms/ErrorHelp.vue'
import { safeGet } from '@/helpers/utils'

const props = defineProps({
  modelValue: String,
  source: { type: Array, default: () => [] }, // AppointmentRecord[]
})
const emit = defineEmits(['update:modelValue','select'])

const open = ref(false)
const active = ref(0)
const errorMessage = ref('')

const term = ref(props.modelValue || '')
watch(() => props.modelValue, v => term.value = v || '')

function onInput(e) {
  term.value = e.target.value || ''
  emit('update:modelValue', term.value)
  open.value = !!term.value
  if (errorMessage.value) errorMessage.value = ''
}

const normalize = (s) =>
  (s || '')
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')

const suggestions = computed(() => {
  const t = normalize(term.value)
  if (!t) return []
  const filtered = props.source.filter((rec) => {
    const hay = normalize([
      safeGet(rec,'fields.contact_name[0]',''),
      safeGet(rec,'fields.contact_surname[0]',''),
      safeGet(rec,'fields.contact_email[0]',''),
      safeGet(rec,'fields.contact_phone[0]',''),
      safeGet(rec,'fields.appointment_address',''),
    ].join(' '))
    return hay.includes(t)
  }).slice(0, 20)
  return filtered
})

function findExactMatch(t) {
  const n = normalize(t)
  if (!n) return null
  return props.source.find((rec) => {
    const name = normalize(safeGet(rec,'fields.contact_name[0]',''))
    const surname = normalize(safeGet(rec,'fields.contact_surname[0]',''))
    const full = (name + ' ' + surname).trim()
    const email = normalize(safeGet(rec,'fields.contact_email[0]',''))
    const phone = normalize(safeGet(rec,'fields.contact_phone[0]',''))
    return n === full || (email && n === email) || (phone && n === phone)
  }) || null
}

function validateTerm() {
  if (!term.value) { errorMessage.value = ''; return }
  const exact = findExactMatch(term.value)
  errorMessage.value = exact ? '' : 'Invalid user'
}

function choose(item) {
  const name = `${safeGet(item,'fields.contact_name[0]','')} ${safeGet(item,'fields.contact_surname[0]','')}`.trim()
  emit('update:modelValue', name)
  emit('select', item)
  errorMessage.value = ''
  open.value = false
}

function move(d){ if(!open.value) open.value = true; const len = suggestions.value.length; if(!len) return; active.value = (active.value + d + len) % len }

function onEnter(){
  if (open.value && suggestions.value.length) {
    choose(suggestions.value[active.value])
    return
  }
  const exact = findExactMatch(term.value)
  if (exact) {
    choose(exact)
  } else {
    errorMessage.value = 'Invalid user'
  }
}

function onClick(){
  if (suggestions.value.length) choose(suggestions.value[0])
  else {
    validateTerm()
    open.value = true
  }
}
</script>
