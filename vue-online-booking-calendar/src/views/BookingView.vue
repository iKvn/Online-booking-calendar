<script setup>
import BookingCalendar from '../components/calendar/BookingCalendar.vue'
import { useAttrs } from 'vue'
import { parametersRequest } from '../store/store'

const attrs = useAttrs()
if (Object.values(attrs).length) parametersRequest.setParameters(attrs)
</script>

<template>
  <div>
    <h3 class="inform" v-if="!Object.values($route.query).length">
      Для запису оберіть дату та час!
    </h3>
  </div>
  <main>
    <BookingCalendar />
  </main>
</template>

<style scoped>
h3 {
  text-decoration-line: underline; 
}
</style>
