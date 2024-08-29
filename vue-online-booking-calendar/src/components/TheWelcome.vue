<script setup>
import { ref } from 'vue'
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/vue/24/solid'
import DayWeek from './DayWeek.vue'
import CalendarDays from './CalendarDay.vue'
import CalendarLoading from './CalendarLoading.vue'
import TimeDay from './TimeDay.vue'
import TimeDayLoading from './TimeDayLoading.vue'
import { parametersMonth, selectedDay } from '../store/store'
import { formatDate, formatTime } from '@/lib/utils'
import { setSelectedDateTime } from '@/lib/data';

let timingFlag = ref(false)
let dateConfirmed = ref(false)
let confirmLoading = ref(false)

parametersMonth.setParametersMonth({type: 'current', value: 0})

function monthChange(valueChange) {
  const type = valueChange == 1 ? 'future' : 'past' ;
  parametersMonth.setParametersMonth({type, value: valueChange})
  if(selectedDay.target && selectedDay.year == parametersMonth.year && selectedDay.month == parametersMonth.number) {
    selectedDay.setStyle(parametersMonth.number)
  } else selectedDay.cleanStyle()
}

function timeSelection() {
  timingFlag.value = true
}

function dayChange(valueChange) {
  const currentdate = new Date()
  currentdate.setHours(0, 0, 0, 0)
  const newCurrentdate = new Date(selectedDay.year, selectedDay.month, selectedDay.index + valueChange)
  if (newCurrentdate.getTime() >= currentdate.getTime() ) {
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

function chooseAnotherDay() {
  timingFlag.value = false
  dateConfirmed.value = false
  parametersMonth.setParametersMonth({type: 'current', value: 0})
  selectedDay.setDay({
    target: undefined, 
    day: {
      index: 0,
      month: 0 
    }, 
    year: 0
  })
}

async function confirmSelection() {
  confirmLoading.value = true;
  const response = await setSelectedDateTime(selectedDay.index, selectedDay.month + 1, selectedDay.year, selectedDay.clock, formatDate(selectedDay));
  if(response.timeBusy) {  
    selectedDay.availableTime = response.availableTime;
    selectedDay.setTime(undefined, {clock: 0, minutes: 0}, response.timeBusy)
    dateConfirmed.value = false;
    timingFlag.value = true;
  } else {
    dateConfirmed.value = true;
    timingFlag.value = false;
  }
  confirmLoading.value = false;

}
</script>

<template>
  <table class="container">
    <thead>
      <tr v-if='timingFlag'>
        <td>
          <button v-on:click="dayChange(-1)">
            <ChevronDoubleLeftIcon style="width: 10"/>
          </button>
        </td>
        <td colspan="3" class="inform"> {{ formatDate(selectedDay) }} </td>
        <td>
          <button v-on:click="dayChange(1)">
            <ChevronDoubleRightIcon style="width: 10"/>
          </button>
        </td>
      </tr>
      <tr v-else-if='dateConfirmed'>  
        <td colspan="7" class="inform">  
        <h3>
          Дякую!
        </h3>
        <h3>
          Запис здійснено!
        </h3>
          <h4>Поверніться будь ласка до месенджера</h4>
          <h4>вам надіслано повідомлення:</h4>
        </td>
      </tr>
      <tr v-else>
        <td>
          <button v-on:click="monthChange(-1)">
            <ChevronDoubleLeftIcon style="width: 10"/>
          </button>
        </td>
        <td colspan="5" class="inform"> {{ parametersMonth.name }} {{ parametersMonth.year }} </td>
        <td>
          <button v-on:click="monthChange(1)">
            <ChevronDoubleRightIcon style="width: 10"/>
          </button>
        </td>
      </tr>
      <DayWeek v-if='!timingFlag & !dateConfirmed'/>
    </thead>
    <tbody>
      <template v-if="confirmLoading">
        <TimeDayLoading />
      </template>
      <template v-else-if='timingFlag'>
        <TimeDay />
      </template>
      <template v-else-if='!dateConfirmed'>
        <Suspense>
          <CalendarDays />
          <template #fallback>
            <CalendarLoading />
          </template>
        </Suspense>
      </template>         
    </tbody>
    <tfoot>
      <tr>
        <td colspan="7" class="inform">
          <span v-if="selectedDay.index == 0">Дата не обрана!</span>
          <span v-else>Дата запису: {{ formatDate(selectedDay) }}</span>
        </td>
      </tr>
      <tr v-if="selectedDay.index != 0">
        <td colspan="7" class="inform">
          <button v-if='selectedDay.index != 0 & !timingFlag & !dateConfirmed' v-on:click="timeSelection" class="down-button">Обрати час</button>
          <span v-if='selectedDay.clock != 0'>Час запису: {{ formatTime(selectedDay) }}</span>    
          <span v-else-if='timingFlag'>Час не обраний!</span>
        </td>
      </tr> 
      <tr v-if='selectedDay.clock != 0 & !dateConfirmed & !selectedDay.timeBusy'>
        <td colspan="7" class="inform">
          <button v-on:click="chooseAnotherDay()" class="down-button">Редагувати</button>
          <button v-on:click="confirmSelection()" class="down-button">Підтвердити</button>
        </td>
      </tr>
      <tr v-if="selectedDay.timeBusy">
        <td colspan="7" class="inform timebusy">
          <p>Перепрошую,</p>
          <p>обрана вами година зайнята!</p>
          <p>Оберіть інший час або день!</p>
        </td>
      </tr> 
    </tfoot> 
  </table>
</template>

<style scoped>
tbody td{
  height: min(4vh, 7vw);
  width: min(4vh, 7vw);
  background: rgba(211, 211, 211, 0.404);
  box-shadow: 
    inset 2px 2px 2px gray,
    inset -2px -2px 2px white
}

.container {
  max-width: 400px;
  font-family: 'Khula', sans-serif;
  font-size: 16px;
  text-align: center;
  font-weight: 625;
}

thead {
  background-color: #83c9ee;
}

tfoot {
  background-color: #83c9ee;
}

.inform {
  height: 35px;
  padding-top: 4px;
  padding-left: 5px;
  padding-right: 5px;
}

.down-button {
  height: 25px;
  border-radius: 5px;
  background-color: #00ffff;
  border-width: 1px;
  border-color:#035b8a;
  margin-bottom: 2.5px;
  margin-right: 1px;
  margin-left: 1px;
}

.down-button:hover {
  background: #02d8d8;
}

.timebusy {
  background-color: #00ffff;
  color: red;
  padding-bottom: 4px;
  font-weight: 600;
}
</style>
