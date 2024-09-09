<script setup>
import { getWorkTime, formatTime } from '@/lib/utils'
import { selectedDay } from '../../store/store'
import { watchEffect, computed, onMounted } from 'vue'
import TimeDayLoading from './TimeDayLoading.vue'

watchEffect(async () => {
  await selectedDay.setAvailableTime(selectedDay.index, selectedDay.month + 1, selectedDay.year);
}); 

const workTime = computed(() => {
  return getWorkTime(selectedDay.availableTime, selectedDay.year, selectedDay.month, selectedDay.index)
})

onMounted(() => {
  if(selectedDay.clock) {
    const clockNotselected = Array.from(document.querySelectorAll("td.clock.notselected"))
    selectedDay.target = clockNotselected.find((element) => {
      return element.innerText === formatTime(selectedDay)
    })
    selectedDay.setStyle(selectedDay.month)
  }
})

function clickTime(timeClick, event){
  if (timeClick.available) {   
    selectedDay.setTime(event.currentTarget, timeClick)     
    selectedDay.setStyle(selectedDay.month)
  } 
}

</script>

<template>
  <template v-if='selectedDay.availableTime.length == 0'>
    <TimeDayLoading />
  </template>
  <tr v-else v-for="(row, index) in workTime" :key="index">             
    <td class="day clock" v-for="(dayTime, index) in row" :key="index" v-on:click="clickTime(dayTime,$event)" :class="{notselected: dayTime.available}"> 
      <span v-if='dayTime.available'>{{ formatTime(null, dayTime) }}</span>
      <span  v-else class="notAvailable">{{ formatTime(null, dayTime) }}</span>
    </td>
  </tr>
</template>