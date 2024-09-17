<script setup>
import BookingCalendar from '../components/calendar/BookingCalendar.vue'
import { useAttrs } from 'vue'
import { parametersRequest } from '../store/store'

const attrs = useAttrs()
if (Object.values(attrs).length) parametersRequest.setParameters(attrs)
</script>

<template>
  <main>
    <BookingCalendar />
  </main>
</template>
