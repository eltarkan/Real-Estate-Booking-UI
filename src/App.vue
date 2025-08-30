<template>
  <div class="w-screen h-screen flex flex-col">
    <Navbar />

    <div class="flex flex-col">
      <AppointmentDetailBar
        title="134 Appointments found."
        button-text="Create Appointment"
        button-variant="primary"
        button-size="md"
      />

      <div class="flex flex-col">


        <div class="flex flex-col gap-4 p-2">

          <div v-for="i in 10" class="flex flex-row items-center w-full bg-[#F0F5F5]  rounded-lg p-2">

            <div class="flex flex-row w-11/12 mx-auto items-center justify-center">
              <div class="flex flex-col w-1/4 gap-y-1">
                <div class="flex flex-row gap-4 text-sm items-center justify-center">
                  <div class="w-10"><User size="20" class="text-slate-500 text-sm font-light" /></div>
                  <div class="w-5/6"><span class="text-md font-semibold">Emma Smith</span></div>
                </div>
                <div class="flex flex-row gap-4 text-sm items-center justify-center">
                  <div class="w-10"><Mail size="20" class="text-slate-500 text-sm font-light" /></div>
                  <div class="w-5/6"><span class="text-gray-500 font-semibold">emma@example.com</span></div>
                </div>
                <div class="flex flex-row gap-4 text-sm items-center justify-center">
                  <div class="w-10"><Phone size="20" class="text-slate-500 text-sm font-light" /></div>
                  <div class="w-5/6"><span class="text-gray-500 font-semibold">555 554 1242</span></div>
                </div>
              </div>

              <div class="flex flex-row w-1/4 items-center justify-start gap-2">
                <House class="text-gray-500" /> <span class="text-sm font-bold">Kemalöz Mah. Uşak</span>
              </div>

              <div class="flex flex-col w-1/4">
                <div class=" w-full p-6 bg-pink-600 rounded-2xl"></div>
              </div>


              <div class="flex flex-col w-1/4 items-center justify-center">

                <AvatarGroup
                  :items="users"
                  size="md"
                  :max="5"
                  overlap="-space-x-2"
                  :ring="true"
                  ring-color="ring-white"
                  avatar-class=""
                  counter-bg-class="bg-gray-100"
                  counter-text-class="text-black"
                />
              </div>
            </div>

          </div>

        </div>



      </div>

    </div>

  </div>
</template>

<script setup>
import { User, Mail, Phone, House } from 'lucide-vue-next'

import Navbar from '@/components/Navbar.vue'
import AvatarGroup from '@/components/molecules/AvatarGroup.vue'
import { UserPopData } from '@/helpers/dummy.js'
import AppointmentDetailBar from '@/components/molecules/AppointmentDetailBar.vue'

const users = UserPopData

</script>

<style scoped>
</style>
