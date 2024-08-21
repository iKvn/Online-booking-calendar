export const formatDate = (selectedDay) => {
  return formatValues(selectedDay.index) + '.' + formatValues(selectedDay.month + 1) + '.' + selectedDay.year
}

export const formatTime = (selectedDay, dayTime = null) => {
  let formatTimeText = ' '
  if (dayTime && dayTime.clock != '') formatTimeText = formatValues(dayTime.clock) + ':' + formatValues(dayTime.minutes)
  else if(selectedDay && selectedDay.clock != 0) formatTimeText = formatValues(selectedDay.clock) + ':' + formatValues(selectedDay.minutes)
  return formatTimeText
}

export function getParametersMonth(parametersMonth, action) {

  const CURRENT_DATE = new Date();
  let lastDay;

  if (action.type === 'current') {   
    lastDay = getLastDayOfMonth(
      CURRENT_DATE.getFullYear(),
      CURRENT_DATE.getMonth(),
      action.value
    );
  } else if (action.type === 'future') {
    lastDay = getLastDayOfMonth(
      parametersMonth.year,
      parametersMonth.number,
      action.value
    );
  } else if (action.type === 'past'){
    if (CURRENT_DATE.getMonth() == parametersMonth.number) {
      return parametersMonth;
    } else {
      lastDay = getLastDayOfMonth(
        parametersMonth.year,
        parametersMonth.number,
        action.value
      );
    }
  }

  const current_month = lastDay.toLocaleDateString('uk-UA', { month: 'long' });
  parametersMonth.name = `${current_month
    .slice(0, 1)
    .toUpperCase()}${current_month.slice(1)}`;
  parametersMonth.firstDay = CURRENT_DATE.getMonth() >= lastDay.getMonth() ? CURRENT_DATE.getDate() : 1;
  parametersMonth.year = lastDay.getFullYear();
  parametersMonth.number = lastDay.getMonth();
}

export const getCalendarDays = (month, year, availableDates) => {
  if(!month) month = new Date().getMonth();
  if(!year) year = new Date().getFullYear();
  
  let days = [];
  let week = -1;
  days[week] = [];
  
  const lastDayCurrent = new Date(year, month + 1, 0).getDate();
  const lastDayPrevious = new Date(year, month, 0).getDate();
   
  const firstDayWeek = new Date(year, month, 1).getDay();
  const numberDaysLastMonth = 2 - (firstDayWeek != 0 ? firstDayWeek : 7);
  const maxIndex = 6 - firstDayWeek + lastDayPrevious;
  for (let i = numberDaysLastMonth; i <= (maxIndex > 35 ? 41 : 34) + numberDaysLastMonth; i++) {
    let day
    let dayWeek = new Date(year, month, i).getDay()
    if (dayWeek != 1) {
      day = getParametersDay(i, month, lastDayCurrent, lastDayPrevious, availableDates)
    } else {
      week++
      days[week] = []
      day = getParametersDay(i, month, lastDayCurrent, lastDayPrevious, availableDates)
    }
    days[week].push(day)
  }   
  return days;    
}

function formatValues(values){
  let returnValues = values
  if (Number(values) < 10) {
    returnValues = `0${values}`
   }
  return returnValues
}

function getLastDayOfMonth(year, month, addMonth) {
  let monthNumber = month + addMonth
  if (monthNumber > 11) {
    year++
    monthNumber = 0
  } else if (monthNumber < 0) {
    year--
    monthNumber = 11
  }
  return new Date(year, monthNumber + 1, 0)
}

function getParametersDay(index, month, lastDayCurrent, lastDayPrevious, availableDates) {
  let available = false
  if (index <= 0 ) {
    index = lastDayPrevious + index
    month--
  } else if (index <= lastDayCurrent) {
    let monthindex = (month + 1) * 100 + index
    //debugger
    if (availableDates.length > 0) available = availableDates.includes(monthindex)
  } else {
    index = index - lastDayCurrent
    month++
  }

  return { index, month, available }
}


export function getWorkTime(availableTime, year, month, index){
  const recordingTime = {
    duration: 60,
    startClock: 9,
    startMinutes: 0,
    endClock: 17,
    endMinutes: 0,
  }
  let currentdate = new Date()
  let available = false
  
  let startClock = recordingTime.startClock
  let startMinutes = recordingTime.startMinutes
  let endClock = recordingTime.endClock
  let workTime = []
  let row = 0
  workTime[row] = []
  workTime[row].push({clock: '', minutes: '', date: '', available: false})
  for (let clock = startClock; clock <= endClock; clock++) {
    let startDate = new Date(year, month, index, clock, startMinutes).getTime() 
    //debugger
    available = availableTime.includes(clock) && startDate >= currentdate.getTime() 
    workTime[row].push({clock, minutes: startMinutes, date: startDate, available})
    if (workTime[row].length === 4) {
      workTime[row].push({clock: '', minutes: '', date: '', available: false})
      if (clock < endClock) {
        row++
        workTime[row] = []
        workTime[row].push({clock: '', minutes: '', date: '', available: false})
      }
    }
  }
  return workTime.slice()
}

