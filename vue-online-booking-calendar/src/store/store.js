import { reactive } from 'vue';
import { getParametersMonth } from '@/lib/utils';
import { getAvailableTime } from '@/lib/data';

export const parametersMonth = reactive({
  firstDay: 1,
  name: '',
  number: 0,
  year: 2024,
  setParametersMonth(type) {
    getParametersMonth(this, type)
  }
})

export const selectedDay = reactive({
  index: 0,
  month: 0,
  year: 0,
  clock: 0,
  minutes: 0,
  target: undefined,
  availableTime: [],
  async setAvailableTime(index, month, year) {
    this.availableTime = await getAvailableTime(index, month, year);
  },
  cleanAvailableTime(){
    this.availableTime = [];
  },
  setDay(parameters) {
    this.cleanAvailableTime()
    this.cleanStyle()
    this.target = parameters.target
    this.month = parameters.day.month
    this.index = parameters.day.index
    this.year = parameters.year
    this.setTime(this.target, {clock: 0, minutes: 0})
  },
  setTime(target, timeClick) {
    this.target = target
    this.clock = timeClick.clock
    this.minutes = timeClick.minutes
  },
  cleanStyle(){
    if (this.target) {
      this.target.classList.remove('selected')
      this.target.classList.add('notselected')
    }
  },
  setStyle(month){
    if (this.target && this.month === month) {
      this.target.classList.remove('notselected')
      this.target.classList.add('selected')
    }
  }
})