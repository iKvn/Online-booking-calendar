<template>
  <table>
    <thead>
      <DayWeek/>
    </thead>
    <tbody>
      <CalendarDay :available-dates="availableDates" :selected-day="selectedDay"/>
    </tbody>
  </table>
</template>

<script setup>
import CalendarDay from '../calendar/CalendarDay.vue';
import { defineProps } from 'vue';
import DayWeek from '../calendar/DayWeek.vue';
defineProps({
    availableDates: {
        type: Array,
        required: true
    },
    selectedDay:{
        type: Object,
        required: true
    }
})
</script>
<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ccc;
  max-width: 600px;
}

th,
td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}

th {
  background-color: #f0f0f0;
}

.day {
    cursor: pointer;
}

.notavailable {
    color: gray;
    cursor: default;
}

.notselected {
    background-color: #1a73e8;
    color: white;
}
</style>
