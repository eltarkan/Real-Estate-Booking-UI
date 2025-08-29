<template>
  <div class="w-screen h-screen flex flex-col">
    <Navbar />

    <div class="flex flex-col">
      <div class="flex flex-row items-center justify-between px-2 py-4 border-b-2 border-gray-200">
        <span class="font-bold text-md">134 Appoinments found.</span>
        <button class="text-white bg-pink-600 p-3 px-4 rounded-lg">Create Appointment</button>
      </div>

      <div class="flex flex-col">


        <div class="flex flex-col gap-4 p-2">

          <div v-for="i in 10" class="flex flex-row items-center w-full bg-blue-300  rounded-lg p-2">

            <div class="flex flex-col w-1/4 items-center justify-start">
              <div v-for="i in 3" class="flex flex-row gap-4 text-sm items-center justify-center">
                <div><Search /></div>
                <div><span>Emma Smith</span></div>
              </div>
            </div>

            <div class="flex flex-row w-1/4">
              <Search /> Kemalöz Mah. Uşak
            </div>

            <div class="flex flex-col w-1/4">

              <div class=" w-2/3 p-6 bg-pink-600 rounded-2xl"></div>

            </div>


            <div class="flex flex-col w-1/4">

              <UserPop />
            </div>

          </div>

        </div>



      </div>

    </div>

  </div>
</template>

<script setup>
import { Search } from 'lucide-vue-next'

import Navbar from '@/components/Navbar.vue'
import UserPop from '@/components/UserPop.vue'

</script>

<style scoped>
</style>
