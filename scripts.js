let CURRENT_DATE = new Date()
let parametersMonth = getParametersMonth(CURRENT_DATE)
let bootFlag = true
const day = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд']
const selectedDay = {
  index: 0,
  month: parametersMonth.number,
  year: 0,
  clock: 0,
  minutes: 0,
  target: null,
}

let availableDates = [9, 10, 11]
let calendarDays = []
let timingFlag = false
let dateConfirmed = false
const recordingTime = {
  duration: 60,
  startClock: 9,
  startMinutes: 0,
  endClock: 17,
  endMinutes: 0,
}
let availableTime = [9, 10, 11]
let workTime = []
let timeBusy = false

function getParametersMonth(valueDate, addMonth = 0) {
  let lastDay = getLastDayOfMonth(
    valueDate.getFullYear(),
    valueDate.getMonth(),
    addMonth
  )
  let current_month = lastDay.toLocaleDateString('uk-UA', { month: 'long' })
  let nameMonth = `${current_month
    .slice(0, 1)
    .toUpperCase()}${current_month.slice(1)}`
  let firstDay =
    CURRENT_DATE.getMonth() == lastDay.getMonth() ? CURRENT_DATE.getDate() : 1
  return {
    firstDay,
    name: nameMonth,
    number: lastDay.getMonth() + 1,
    year: lastDay.getFullYear(),
  }
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

function calendar() {
  //console.log(this.currentdate.getDate())
  let month = parametersMonth.number
  let year = parametersMonth.year
  let days = []
  let week = 0
  days[week] = []

  let lastDayCurrent = new Date(year, month, 0).getDate()
  let lastDayPrevious = new Date(year, month - 1, 0).getDate()

  let firstDayWeek = new Date(year, month - 1, 1).getDay()
  let numberDaysLastMonth = 2 - (firstDayWeek != 0 ? firstDayWeek : 7)
  for (let i = numberDaysLastMonth; i <= 41 + numberDaysLastMonth; i++) {
    let day
    let dayWeek = new Date(year, month - 1, i).getDay()
    if (dayWeek != 1) {
      day = getParametersDay(i, month, lastDayCurrent, lastDayPrevious)
    } else {
      week++
      days[week] = []
      day = getParametersDay(i, month, lastDayCurrent, lastDayPrevious)
    }
    days[week].push(day)
  }
  calendarDays = days
}

function getParametersDay(index, month, lastDayCurrent, lastDayPrevious) {
  let available = false
  let currentdate = new Date()
  if (index <= 0) {
    index = lastDayPrevious + index
    month--
  } else if (index <= lastDayCurrent) {
    let monthindex = month * 100 + index
    if (
      (availableDates.includes(monthindex) &&
        index >= currentdate.getDate() &&
        month == currentdate.getMonth() + 1) ||
      month > currentdate.getMonth() + 1
    ) {
      available = true
    }
  } else {
    index = index - lastDayCurrent
    month++
  }
  let monthindex = month * 100 + index
  available = true//availableDates.includes(monthindex)

  return { index, month, available }
}

function getAvailableDates(firstDay, month, year, actionName){
  const requestData {
    'day': firstDay, 
    month, 
    year
  }
  const returnArray = Array.isArray(requestAPI('getAvailableDates', requestData)) || []   
  setAvailableDates(returnArray, actionName)
}

function setAvailableDates(returnArray, actionName) {
  //console.log(returnArray)
  if (Array.isArray(returnArray)) {
    availableDates = returnArray.slice()
    switch (actionName) {
      case 'defaultSettings':
        calendar()
        bootFlag = false
        break
      case 'monthChange':
        cleanСurrentTargetStyle()
        calendar()
        currentTargetStyle()
        break
    }
  } else availableDates = []
}

function decreaseTime() {
  if (!bootFlag) {
    //clearInterval(nIntervId)
    spinner.classList.add('hide')
    container.classList.remove('hide')
  }
}

function generateCalendar(update = false) {
  const informMonth = document.querySelector('#informMonth');
  informMonth.innerHTML = `${parametersMonth.name} ${parametersMonth.year}`

  const calendar = document.querySelector('#calendar')

  if(update) calendar.replaceChildren()
  else {
    day.forEach((d) => {
      const td = document.createElement('td');
      td.innerHTML = d;
      td.classList.add('dayWeek')
      document.querySelector('#dayWeek').append(td);
    })
  }
  
  calendarDays.forEach((week, indexWeek) => {
    const tr = document.createElement('tr');  
    week.forEach((day, indexDay) => {
      const td = document.createElement('td');
      td.innerHTML = day.index;
      td.setAttribute('indexWeek', indexWeek);
      td.setAttribute('indexDay', indexDay);
      td.classList.add('day')  
      td.classList.add('notselected') 
      if(!day.available) td.classList.add('notAvailable')
      td.addEventListener('click', clickDay)
      tr.appendChild(td)
    })
    calendar.append(tr);
  })    
}

function clickDay(event){

  const indexWeek = Number(event.target.attributes.indexWeek.value)
  const indexDay = Number(event.target.attributes.indexDay.value)
  const dayClick = calendarDays[indexWeek][indexDay]
  const informSelectDay = document.querySelector('#selectDay');
  const buttonSelectTime = document.querySelector('.down-button');

  if (dayClick.available) {
    cleanСurrentTargetStyle()        
    if (event.target.tagName === "SPAN") {
      selectedDay.target = event.target.offsetParent
    } else {
      selectedDay.target = event.target
    }
    selectedDay.month = dayClick.month
    selectedDay.index = dayClick.index
    selectedDay.year = parametersMonth.year
    currentTargetStyle()
    
    informSelectDay.innerHTML = `Дата запису: ${formatDate()}`
    buttonSelectTime.classList.remove('hide')
  } else {
    informSelectDay.innerHTML = 'Дата не обрана!'
    buttonSelectTime.classList.add('hide')
  }
}

function formatDate(){
  return formatValues(selectedDay.index) + '.' + formatValues(selectedDay.month) + '.' + selectedDay.year
}

function formatValues(values){
  let returnValues = values
  if (values < 10) {
    returnValues = '0' + values
   }
  return returnValues
}

function monthChange(event){
  const valueChange = Number(event.target.value)
  //console.log(valueChange)
  const startdate = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const enddate = new Date(startdate.getFullYear(), startdate.getMonth()+2, 1)
  CURRENT_DATE = new Date(parametersMonth.year, parametersMonth.number - 1, 1)
  if (valueChange == -1 && startdate.getTime() < CURRENT_DATE.getTime() || valueChange == 1 && enddate.getTime() > CURRENT_DATE.getTime()) {
    parametersMonth = getParametersMonth(CURRENT_DATE, valueChange)
    getAvailableDates(parametersMonth.firstDay, parametersMonth.number, parametersMonth.year, 'monthChange')
    generateCalendar(true)
  }
}

function cleanСurrentTargetStyle(){
  if (selectedDay.target) {
    selectedDay.target.classList.remove('selected')
    selectedDay.target.classList.add('notselected')
  }
}

function currentTargetStyle(){
  if (selectedDay.target && selectedDay.month === parametersMonth.number) {
    selectedDay.target.classList.remove('notselected')
    selectedDay.target.classList.add('selected')
  }
}

function defaultSettings(actionName = 'defaultSettings') {
  getAvailableDates(parametersMonth.firstDay, parametersMonth.number, parametersMonth.year, actionName)
  generateCalendar()
  //console.log(bootFlag)
  setInterval(decreaseTime(), 100)
}

const buttons = document.querySelectorAll("button");
buttons.forEach((button) => {
  button.addEventListener("click", monthChange)
})
const spinner = document.querySelector('.pulse-container')
const container = document.querySelector('.container')
setInterval(decreaseTime(), 100)

defaultSettings()

async function requestAPI(requestType, requestData, method = "GET", apikey = undefined) {
  const url = 'https://script.google.com/macros/s/AKfycbzRGGeIsy6j9QKgGzqGvLXw7c6XOJ8mztcXDcz4uBm3S_b9hAg2znP7TYPUBnU6LKaegQ/exec?requestType=' + requestType;
  const headers = {}
  headers['Content-Type'] = 'application/json'
  let body
  if (requestData) {
    body = JSON.stringify(data)
  } else if (apikey) {
    headers['API-Key'] = apikey
  }
  try {
    const response = await fetch(url, {
      method,
      headers,
      body,
    })

    return await response.json()
  } catch (e) {
    throw e
  }
}
