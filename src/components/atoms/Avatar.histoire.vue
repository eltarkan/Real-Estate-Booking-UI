<template>
  <Story title="Atoms/Avatar" group="atoms">
    <Variant
      title="Playground"
      :init-state="{
        initials: 'TC',
        size: 'md',
        bgClass: 'bg-gray-200',
        textClass: 'text-black',
        ring: true,
        ringColor: 'ring-white',
        extraClass: '',
        title: 'Tarkan Cengiz'
      }"
    >
      <template #controls="{ state }">
        <HstText v-model="state.initials" title="initials" />
        <HstSelect v-model="state.size" title="size" :options="['xs','sm','md','lg']" />
        <HstText v-model="state.bgClass" title="bgClass" />
        <HstText v-model="state.textClass" title="textClass" />
        <HstCheckbox v-model="state.ring" title="ring" />
        <HstText v-model="state.ringColor" title="ringColor" />
        <HstText v-model="state.extraClass" title="extraClass" />
        <HstText v-model="state.title" title="title" />
      </template>

      <template #default="{ state }">
        <div class="p-6">
          <Avatar
            :initials="state.initials"
            :size="state.size"
            :bg-class="state.bgClass"
            :text-class="state.textClass"
            :ring="state.ring"
            :ring-color="state.ringColor"
            :extra-class="state.extraClass"
            :title="state.title"
          />
        </div>
      </template>
    </Variant>

    <Variant title="Sizes">
      <div class="flex items-center gap-6 p-6">
        <Avatar initials="XS" size="xs" />
        <Avatar initials="SM" size="sm" />
        <Avatar initials="MD" size="md" />
        <Avatar initials="LG" size="lg" />
      </div>
    </Variant>

    <Variant title="Colors & Ring">
      <div class="flex items-center gap-6 p-6">
        <Avatar initials="DK" size="md" bg-class="bg-neutral-900" text-class="text-white" />
        <Avatar initials="BL" size="md" bg-class="bg-blue-600" text-class="text-white" ring-color="ring-blue-200" />
        <Avatar initials="GR" size="md" bg-class="bg-green-600" text-class="text-white" ring-color="ring-green-200" />
        <Avatar initials="NR" size="md" :ring="false" bg-class="bg-gray-300" />
      </div>
    </Variant>

    <Variant title="Custom Slot">
      <div class="flex items-center gap-6 p-6">
        <Avatar size="lg" bg-class="bg-amber-500" text-class="text-white">
          <img
            src="https://avatars.githubusercontent.com/u/1?v=4"
            alt="avatar"
            class="h-full w-full object-cover rounded-full"
          />
        </Avatar>
        <Avatar size="lg" bg-class="bg-purple-600" text-class="text-white">
          <span class="font-bold">TV</span>
        </Avatar>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import Avatar from './Avatar.vue'
</script>
