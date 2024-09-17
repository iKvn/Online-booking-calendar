<script setup>
import { ref } from 'vue'
import DayWeek from '../calendar/DayWeek.vue'
import CalendarDays from '../calendar/CalendarDay.vue'
import DayLoading from '../calendar/DayLoading.vue'
import TimeDay from '../calendar/TimeDay.vue'
import TimeDayLoading from '../calendar/TimeDayLoading.vue'
import ButtonChange from '../calendar/ButtonChange.vue'

import { parametersMonth, selectedDay, parametersRequest } from '../../store/store'
import { formatDate, formatTime } from '@/lib/utils'
import { setSelectedDateTime } from '@/lib/data'

let timingFlag = ref(selectedDay.clock > 0)
let dateConfirmed = ref(false)
let confirmLoading = ref(false)

parametersMonth.setParametersMonth({type: 'current', value: 0})

function timeSelection() {
  timingFlag.value = true
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
  <div>
    <h3 class="inform" v-if="parametersRequest.withoutParameters & !dateConfirmed">
      Для запису оберіть дату та час!
    </h3>
  </div>
  <table class="container">
    <thead>
      <tr v-if='dateConfirmed'>  
        <td colspan="7" class="inform">  
          <h3>
            <p>Дякую!</p>
            <p>Запис здійснено!</p>
          </h3>
        </td>
      </tr>
      <tr v-if='dateConfirmed'>
        <td colspan="7" class="inform">
          <p>Поверніться до месенджера,</p>
          <p>вам надіслано повідомлення:</p>
        </td>
      </tr>
      <tr v-else>
        <ButtonChange :changeMonth='!timingFlag'/>
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
            <DayLoading />
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
          <button v-if='selectedDay.index != 0 & !timingFlag & !dateConfirmed' v-on:click="timeSelection" class="button down-button">Обрати час</button>
          <span v-if='selectedDay.clock != 0'>Час запису: {{ formatTime(selectedDay) }}</span>    
          <span v-else-if='timingFlag'>Час не обраний!</span>
        </td>
      </tr> 
      <tr v-if='selectedDay.clock != 0 & !dateConfirmed & !selectedDay.timeBusy'>
        <td colspan="7" class="inform">
          <button v-on:click="chooseAnotherDay()" class="button down-button">Редагувати</button>
          <button v-on:click="confirmSelection()" class="button down-button">Підтвердити</button>
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
.container {
  max-width: 400px;
  font-family: 'Khula', sans-serif;
  font-size: 18px;
  text-align: center;
  font-weight: 625;
}

thead {
  background-color: #83c9ee;
}

tfoot {
  background-color: #83c9ee;
}

.down-button {
  font-size: 16px;
  height: 30px;
  margin-bottom: 2.5px;
  margin-right: 2px;
  margin-left: 2px;
}

.timebusy {
  background-color: #00ffff;
  color: red;
  padding-bottom: 4px;
  font-weight: 600;
}

div h3 {
  text-decoration-line: underline; 
}
</style>
