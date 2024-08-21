<script setup>
import { getWorkTime, formatTime } from '@/lib/utils'
import { selectedDay } from '../store/store'
//const timeValue = [' ', '00:00', '00:00', '00:00', ' ']
const workTime = getWorkTime([], selectedDay.year, selectedDay.month, selectedDay.index)
//[timeValue, timeValue, timeValue]
</script>

<template>
  <tr v-for="(row, index) in workTime" :key="index">             
    <td class="pulse-bubble pulse-bubble-1" v-for="(time, index) in row" :key="index"> 
      <span>{{ formatTime(null, time) }}</span>
    </td>
  </tr>  
</template>

<style scoped>
.pulse-bubble {
  width: 55px;
  height: 32px;
  font-weight: 500;
  font-size: 18px;
  border-radius: 15%;
  transform-origin: 50% 50%;
  color: #dcdcdc;
  padding-top: 1%;
  border-top: 10px;
}
</style>