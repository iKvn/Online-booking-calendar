<script setup>
import { parametersMonth, selectedDay } from "@/store/store";
import { getCalendarDays } from '@/lib/utils';
import { getAvailableDates } from "../lib/data";
import { computed } from 'vue'

const availableDates = await getAvailableDates();
const calendarDays = computed(() => {
  return getCalendarDays(parametersMonth.number, parametersMonth.year, availableDates);
})

function clickDay(day, event){
  if (day.available) {
    selectedDay.cleanStyle()        
    selectedDay.setDay({
      target: event.currentTarget, 
      day, 
      year: parametersMonth.year
    })
    selectedDay.setStyle(parametersMonth.number)
  }
}
</script>

<template>
  <tr v-for="(week, index) in calendarDays" :key="index">             
    <td class="day" v-for="(day, index) in week" :key="index" v-on:click="clickDay(day,$event)" :class="{notselected: day.available}"> 
      <span v-if='day.available'>{{ day.index }}</span>
      <span  v-else class="notAvailable">{{ day.index }}</span>
    </td>
  </tr> 
</template>