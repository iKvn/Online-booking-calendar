<script setup>
import { getWorkTime, formatTime } from '@/lib/utils'
import { selectedDay } from '../store/store'
const workTime = getWorkTime([], selectedDay.year, selectedDay.month, selectedDay.index)

const classPulse = (index) => {
  if(index == 1) return "pulse-bubble-1";
  if(index == 2) return "pulse-bubble-2";
  if(index == 3) return "pulse-bubble-3";
}
</script>

<template>
  <tr v-for="(row, index) in workTime" :key="index">             
    <td class="pulse-bubble" v-for="(time, index) in row" :key="index"> 
      <span :class="classPulse(index)">{{ formatTime(null, time) }}</span>
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