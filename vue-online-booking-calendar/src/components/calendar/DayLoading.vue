<script setup>
import { getCalendarDays } from '@/lib/utils';
const calendarDays = getCalendarDays(undefined, undefined, []);

const classPulse = (index) => {
  if([0,3,6].includes(index)) return "pulse-bubble-1";
  if([1,4,7].includes(index)) return "pulse-bubble-2";
  if([2,5,8].includes(index)) return "pulse-bubble-3";
}
</script>

<template>
  <tr v-for="(week, index)  in calendarDays" :key="index">             
    <td class="pulse-bubble" v-for="(day, index) in week" :key="index"> 
      <span :class="classPulse(index)">{{day.index}}</span>
    </td>
  </tr> 
</template>

<style scoped>
.pulse-bubble {
  width: 40px;
  height: 40px;
  font-weight: 500;
  font-size: 20px;
  border-radius: 50%;
  transform-origin: 50% 50%;
  color: #dcdcdc;
}
</style>