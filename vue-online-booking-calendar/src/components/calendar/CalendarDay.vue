<script setup>
import { parametersMonth, selectedDay } from '@/store/store' 
import { getCalendarDays } from '@/lib/utils' 
import { getAvailableDates } from '../../lib/data' 
import { computed, onMounted } from 'vue' 

const availableDates = await getAvailableDates(); 
const calendarDays = computed(() => { return getCalendarDays(parametersMonth.number, parametersMonth.year, availableDates) }) 

onMounted(() => {
  if (selectedDay.index) { 
    const dayNotselected = Array.from(document.querySelectorAll('td.day.notselected')) 
    selectedDay.target = dayNotselected.find((element) => { return Number(element.innerText) == selectedDay.index })
    selectedDay.setStyle(parametersMonth.number) 
  } 
}) 

function clickDay(day, event) { 
  if (day.available) { 
    selectedDay.cleanStyle() 
    selectedDay.setDay({ target: event.currentTarget, day, year: parametersMonth.year }) 
    selectedDay.setStyle(parametersMonth.number) 
  } 
}

/* import { parametersMonth } from '@/store/store'
import { getCalendarDays } from '@/lib/utils'
import { computed, onMounted, defineProps } from 'vue'

const props = defineProps({
  availableDates: {
    type: Array,
    required: true
  },
  selectedDay: {
    type: Object,
    required: true
  }
})
const calendarDays = computed(() => {
  return getCalendarDays(parametersMonth.number, parametersMonth.year, props.availableDates)
})

onMounted(() => {
  if (props.selectedDay.index) {
    const dayNotselected = Array.from(document.querySelectorAll(`td.day.notselected`))
    const targetDay = dayNotselected.find((element) => {
      return Number(element.innerText) == props.selectedDay.index
    })
    if (targetDay) {
      props.selectedDay.target = targetDay
      props.selectedDay.setStyle(parametersMonth.number)
    } else {
      props.selectedDay.target = null
      props.selectedDay.index = null
      props.selectedDay.day = {}
    }
  }
})

function clickDay(day, event) {
  if (day.available) {
    props.selectedDay.cleanStyle()
    props.selectedDay.setDay({
      target: event.currentTarget,
      day,
      year: parametersMonth.year
    })
    props.selectedDay.setStyle(parametersMonth.number)
  }
} */
</script>

<template>
  <tr v-for="(week, index) in calendarDays" :key="index">
    <td
      class="day"
      v-for="(day, index) in week"
      :key="index"
      v-on:click="clickDay(day, $event)"
      :class="{ notselected: day.available }"
    >
      <span v-if="day.available">{{ day.index }}</span>
      <span v-else class="notAvailable">{{ day.index }}</span>
    </td>
  </tr>
</template>




