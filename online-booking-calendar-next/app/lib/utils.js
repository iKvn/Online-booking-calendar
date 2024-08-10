export const formatDate = (selectedDay) => {
  return formatValues(selectedDay.index) + '.' + formatValues(selectedDay.month) + '.' + selectedDay.year
}

export const formatTime = (selectedDay, dayTime = null) => {
  let formatTimeText = ''
  if (dayTime) {
    if (dayTime.clock != '')
      formatTimeText = formatValues(dayTime.clock) + ':' + formatValues(dayTime.minutes)
  } else formatTimeText = formatValues(selectedDay.clock) + ':' + formatValues(selectedDay.minutes)
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
  const name = `${current_month
    .slice(0, 1)
    .toUpperCase()}${current_month.slice(1)}`;

  const firstDay = CURRENT_DATE.getMonth() >= lastDay.getMonth() ? CURRENT_DATE.getDate() : 1;
  const year = lastDay.getFullYear();
  const number = lastDay.getMonth();
  
  //getAvailableDates(firstDay, number + 1, year).then((availableDates) => {
    return {
      firstDay,
      name,
      number,
      year,
      availableDates: []
    };
  //})
}

export const getCalendarDays = (parametersMonth) => {
  const month = parametersMonth.number;
  const year = parametersMonth.year;
  
  let days = [];
  let week = 0;
  days[week] = [];
  
  const lastDayCurrent = new Date(year, month + 1, 0).getDate();
  const lastDayPrevious = new Date(year, month, 0).getDate();
   
  const firstDayWeek = new Date(year, month, 1).getDay();
  const numberDaysLastMonth = 2 - (firstDayWeek != 0 ? firstDayWeek : 7);
  const maxIndex = 6 - firstDayWeek + lastDayPrevious;
  //debugger
  for (let i = numberDaysLastMonth; i <= (maxIndex > 35 ? 41 : 34) + numberDaysLastMonth; i++) {
    let day
    let dayWeek = new Date(year, month, i).getDay()
    if (dayWeek != 1) {
      day = getParametersDay(i, month, lastDayCurrent, lastDayPrevious, parametersMonth.availableDates)
    } else {
      week++
      days[week] = []
      day = getParametersDay(i, month, lastDayCurrent, lastDayPrevious, parametersMonth.availableDates)
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
  let currentdate = new Date()
  let currentday = currentdate.getDate()
  let currentMonth = currentdate.getMonth() + 1
  //debugger
  if (index <= 0 ) {
    index = lastDayPrevious + index
    month--
  } else if (index <= lastDayCurrent) {
    let monthindex = month * 100 + index
    if (availableDates.length > 0) available = availableDates.includes(monthindex)// && index >= currentday
    else if(currentMonth == month) available = index >= currentday && index <= lastDayCurrent 
    else if(currentMonth < month) available = index > lastDayPrevious && index <= lastDayCurrent
  } else {
    index = index - lastDayCurrent
    month++
  }

  return { index, month, available }
}

