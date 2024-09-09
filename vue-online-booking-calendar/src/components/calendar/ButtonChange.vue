<script setup>
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/vue/24/solid'
import { parametersMonth, selectedDay } from '../../store/store'
import { formatDate } from '@/lib/utils'
import { ref } from 'vue'

const props = defineProps(['changeMonth'])

const changeParameters = ref({ text: '', colspan: 5 })
setChangeParameters()

function setChangeParameters() {
  if (props.changeMonth === 'true') {
    changeParameters.value.text = `${parametersMonth.name} ${parametersMonth.year}`
    changeParameters.value.colspan = 5
  } else {
    changeParameters.value.text = formatDate(selectedDay)
    changeParameters.value.colspan = 3
  }
}

function monthChange(valueChange) {
  const type = valueChange == 1 ? 'future' : 'past'
  parametersMonth.setParametersMonth({ type, value: valueChange })
  if (
    selectedDay.target &&
    selectedDay.year == parametersMonth.year &&
    selectedDay.month == parametersMonth.number
  ) {
    selectedDay.setStyle(parametersMonth.number)
  } else selectedDay.cleanStyle()
}

function dayChange(valueChange) {
  const currentdate = new Date()
  currentdate.setHours(0, 0, 0, 0)
  const newCurrentdate = new Date(
    selectedDay.year,
    selectedDay.month,
    selectedDay.index + valueChange
  )
  if (newCurrentdate.getTime() >= currentdate.getTime()) {
    selectedDay.setDay({
      target: undefined,
      day: {
        index: newCurrentdate.getDate(),
        month: newCurrentdate.getMonth()
      },
      year: newCurrentdate.getFullYear()
    })
  }
}

function buttonChange(valueChange) {
  if (props.changeMonth === 'true') monthChange(valueChange)
  else dayChange(valueChange)
  setChangeParameters()
}
</script>

<template>
  <td>
    <button class="button up-button" v-on:click="buttonChange(-1)">
      <ChevronDoubleLeftIcon style="width: 16" />
    </button>
  </td>
  <td :colspan="changeParameters.colspan" class="inform">{{ changeParameters.text }}</td>
  <td>
    <button class="button up-button" v-on:click="buttonChange(1)">
      <ChevronDoubleRightIcon style="width: 16" />
    </button>
  </td>
</template>

<style scoped>
.up-button {
  padding-top: 3px;
}
</style>
