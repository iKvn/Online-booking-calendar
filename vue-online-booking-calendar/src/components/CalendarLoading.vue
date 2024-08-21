<script setup>
import { getCalendarDays } from '@/lib/utils';
const calendarDays = getCalendarDays(undefined, undefined, []);
</script>

<template>
  <tr v-for="(week, index)  in calendarDays" :key="index">             
    <td class="pulse-bubble pulse-bubble-1" v-for="(day, index) in week" :key="index"> 
      <span>{{day.index}}</span>
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