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
  indexweek: 0,
  indexday: 0
}

let availableDates = [20, 21, 26, 28, 30]
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
let availableTime = [9, 10, 11, 12, 13, 14, 15]
let workTime = []
let timeBusy = false

const informSelectDay = document.querySelector('#selectDay');
const theadSelectedDay = document.getElementById('selectedDay')
const theadCalendar = document.getElementById('calendar')
const theadSelectedTime = document.getElementById('selectedTime')
const theadTime = document.getElementById('time')

const tfootSelectTime = document.getElementById('selectTime')
const tfootSelectTimeText = document.getElementById('selectTimeText')
const tfootSelectDayTime = document.getElementById('selectedDayClock')

const buttonSelectTime = document.querySelector('#selectTimeButton');
const buttons = document.querySelectorAll("button");
buttons.forEach((button) => {
  if(button.id === "monthChange1" || button.id === "monthChange2") button.addEventListener("click", monthChange)
  else if(button.id === "dayChange1" || button.id === "dayChange2") button.addEventListener("click", dayChange)
  else if(button.id === "selectTimeButton") button.addEventListener("click", timeSelection)
  else if(button.id === "chooseAnotherDay") button.addEventListener("click", chooseAnotherDay)
  else if(button.id === "confirmSelection") button.addEventListener("click", confirmSelection)
})

const spinner = document.querySelector('.pulse-container')
const container = document.querySelector('.container')

let nIntervId

defaultSettings()

function chooseAnotherDay(){
  //debugger
  defaultSettings('update')
}

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
  //debugger
  let firstDayWeek = new Date(year, month - 1, 1).getDay()
  let numberDaysLastMonth = 2 - (firstDayWeek != 0 ? firstDayWeek : 7)
  const maxIndex = 6 - firstDayWeek + lastDayPrevious
  for (let i = numberDaysLastMonth; i <= (maxIndex > 35 ? 41 : 34) + numberDaysLastMonth; i++) {
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
  //debugger
  bootFlag = calendarDays.length == 0
}

function timeOutput(){
	let currentdate = new Date()
  let available = false
  //let duration = recordingTime.duration * 60 * 1000
  let startClock = recordingTime.startClock
  let startMinutes = recordingTime.startMinutes
  let endClock = recordingTime.endClock
  workTime = []
  let row = 0
  workTime[row] = []
  workTime[row].push({clock: '', minutes: '', date: '', available: false})
  for (let clock = startClock; clock <= endClock; clock++) {
    let startDate = new Date(selectedDay.year, selectedDay.month -1, selectedDay.index, clock, startMinutes).getTime() 

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
  workTime = workTime.slice()
  //console.log(workTime)
}

function getParametersDay(index, month, lastDayCurrent, lastDayPrevious) {
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

function getAvailableDates(firstDay, month, year, actionName){
  const requestData = {
    'day': firstDay, 
    month, 
    year
  }
  let returnArray
  requestAPI('getAvailableDates', requestData).then((res) => {
    //debugger
    if(res.outputValue && Array.isArray(res.outputValue)) returnArray = res.outputValue
    else returnArray = availableDates
    setAvailableDates(returnArray, actionName)
    generateCalendar(actionName)
  })   
}

function setAvailableDates(returnArray, actionName) {
  if (Array.isArray(returnArray)) {
    availableDates = returnArray.slice()
    switch (actionName) {
      case 'defaultSettings':
        calendar()
        break
      case 'monthChange':
        cleanСurrentTargetStyle()
        calendar()
        currentTargetStyle()
        break
      case 'update':
        cleanСurrentTargetStyle()
        calendar()
        currentTargetStyle()
        break
    }
  } else availableDates = availableDates
}

function timeSelection(){
  //debugger
  getAvailableTime('defaultSettings')
}

function getAvailableTime(actionName) {
  const requestData = {
    day: selectedDay.index, 
    month: selectedDay.month, 
    year: selectedDay.year
  }
  let returnArray = availableTime
  requestAPI('getAvailableTime', requestData).then((res) => {
    if(res.outputValue && Array.isArray(res.outputValue)) returnArray = res.outputValue;
    else returnArray = availableTime;
    setAvailableTime(returnArray, actionName);
    generateTimeCalendar(actionName);
  }) 
}

function setAvailableTime(returnArray, actionName) {
  if (Array.isArray(returnArray)) {
    availableTime = returnArray.slice()
    switch (actionName) {
      case 'defaultSettings':
        timeOutput() 
        timingFlag = true
        break
      case 'dayChange':
        cleanСurrentTargetStyle()
        timeOutput()
        break
    } 
  } else availableTime = availableTime
}

function generateCalendar(actionName) {
  const informMonth = document.querySelector('#informMonth');
  informMonth.innerHTML = `${parametersMonth.name} ${parametersMonth.year}`

  const calendar = document.querySelector('#calendar')

  if(actionName != 'defaultSettings') calendar.replaceChildren()
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
      if(selectedDay.target && selectedDay.year == parametersMonth.year && selectedDay.month == parametersMonth.number && selectedDay.indexweek == indexWeek && selectedDay.indexday == indexDay) {
        td.classList.add('selected')
        selectedDay.target = td
      } else td.classList.add('notselected')
      if(!day.available) td.classList.add('notAvailable')
      else td.addEventListener('click', clickDay)
      tr.appendChild(td)
    })
    calendar.append(tr);
  })   
  decreaseTime() 
}

function generateTimeCalendar(actionName) {
  const informDay = document.querySelector('#informDay');
  informDay.innerHTML = `${formatDate()}`

  const time = document.querySelector('#time')

  //if(actionName != 'defaultSettings') 
  time.replaceChildren()

  workTime.forEach((row, indexRow) => {
    const tr = document.createElement('tr');  
    row.forEach((dayTime, indexTime) => {
      const td = document.createElement('td');
      td.innerHTML = formatTime(dayTime);
      td.setAttribute('indexRow', indexRow);
      td.setAttribute('indexTime', indexTime);
      td.classList.add('clock')
      td.classList.add('notselected')
      /*if(selectedDay.target && selectedDay.year == parametersMonth.year && selectedDay.month == parametersMonth.number && selectedDay.indexweek == indexWeek && selectedDay.indexday == indexDay) {
        td.classList.add('selected')
        selectedDay.target = td
      } else td.classList.add('notselected')*/
      if(!dayTime.available) td.classList.add('notAvailable')
      else td.addEventListener('click', clickTime)
      tr.appendChild(td)
    })
    time.append(tr);
  })   
  theadSelectedTime.classList.remove('hide')
  tfootSelectTimeText.classList.remove('hide')
  tfootSelectTimeText.innerHTML = 'Час не обраний!';
  theadTime.classList.remove('hide')
  theadSelectedDay.classList.add('hide')
  theadCalendar.classList.add('hide')
  buttonSelectTime.classList.add('hide')
}

function clickDay(event){
  const indexWeek = Number(event.target.attributes.indexWeek.value)
  const indexDay = Number(event.target.attributes.indexDay.value)
  const dayClick = calendarDays[indexWeek][indexDay]
  
  if (dayClick.available) {
    cleanСurrentTargetStyle()         
    selectedDay.target = event.target
    selectedDay.month = dayClick.month
    selectedDay.index = dayClick.index
    selectedDay.year = parametersMonth.year
    selectedDay.indexweek = indexWeek
    selectedDay.indexday = indexDay
    currentTargetStyle()
    
    informSelectDay.innerHTML = `Дата запису: ${formatDate()}`
    tfootSelectTime.classList.remove('hide')
    buttonSelectTime.classList.remove('hide')
    tfootSelectTimeText.classList.add('hide')
  } /*else {
    informSelectDay.innerHTML = 'Дата не обрана!'
    buttonSelectTime.classList.add('hide')
  }*/
}

function clickTime(event){
  const indexRow = Number(event.target.attributes.indexRow.value)
  const indexTime = Number(event.target.attributes.indexTime.value)
  const time = workTime[indexRow][indexTime]
  if (time.available) {
    cleanСurrentTargetStyle()        
    selectedDay.target = event.target
    selectedDay.clock = time.clock
    selectedDay.minutes = time.minutes
    currentTargetStyle()

    tfootSelectTimeText.innerHTML = `Час запису: ${formatTime()}`
    tfootSelectDayTime.classList.remove('hide')
  } /*else {
    tfootSelectTime.innerHTML = 'Час не обраний!';
    tfootSelectDayTime.classList.add('hide')
  }*/
}

function formatDate(){
  return formatValues(selectedDay.index) + '.' + formatValues(selectedDay.month) + '.' + selectedDay.year
}

function formatTime(dayTime = null){
  let formatTimeText = ''
  if (dayTime) {
    if (dayTime.clock != '')
      formatTimeText = formatValues(dayTime.clock) + ':' + formatValues(dayTime.minutes)
  } else formatTimeText = formatValues(selectedDay.clock) + ':' + formatValues(selectedDay.minutes)
  return formatTimeText
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
    //generateCalendar(true)
  }
}

function dayChange(event){
  const valueChange = Number(event.target.value)
  let currentdate = new Date()
  currentdate.setHours(0, 0, 0, 0)
  let newCurrentdate = new Date(parametersMonth.year, parametersMonth.number-1, selectedDay.index + valueChange)
  if (newCurrentdate.getTime() >= currentdate.getTime() ) {
    CURRENT_DATE = newCurrentdate
    parametersMonth = getParametersMonth(CURRENT_DATE)
    selectedDay.index = CURRENT_DATE.getDate()
    selectedDay.month = CURRENT_DATE.getMonth() + 1
    selectedDay.year = parametersMonth.year
    getAvailableTime('dayChange')
  }
}

function cleanСurrentTargetStyle(){
  if (selectedDay.target) {
    selectedDay.target.classList.remove('selected')
    selectedDay.target.classList.add('notselected')
  }
}

function currentTargetStyle(){
  //debugger
  if (selectedDay.target && selectedDay.month === parametersMonth.number) {
    selectedDay.target.classList.remove('notselected')
    selectedDay.target.classList.add('selected')
  }
}

function defaultSettings(actionName = 'defaultSettings') {
  bootFlag = true
  dateConfirmed = false
  timingFlag = false
  const currentdate = new Date()     
  selectedDay.target = null
  selectedDay.index = 0
  selectedDay.year = 0
  selectedDay.clock = 0
  parametersMonth = getParametersMonth(currentdate)
  selectedDay.month = parametersMonth.number

  informSelectDay.innerHTML = 'Дата не обрана!'  
  theadSelectedTime.classList.add('hide')
  theadTime.classList.add('hide')
  theadSelectedDay.classList.remove('hide')
  theadCalendar.classList.remove('hide')
  tfootSelectTime.classList.add('hide')
  tfootSelectDayTime.classList.add('hide')

  nIntervId = setInterval(decreaseTime(), 100)
  getAvailableDates(parametersMonth.firstDay, parametersMonth.number, parametersMonth.year, actionName)
}

function decreaseTime() {
  //console.log(bootFlag)
  if (bootFlag) {
    container.classList.add('hide')
    spinner.classList.remove('hide')
  } else {
    clearInterval(nIntervId)
    spinner.classList.add('hide')
    container.classList.remove('hide')
  }
}

async function requestAPI(requestType, requestData, method = "GET", apikey = undefined) {
  let url = 'https://script.google.com/macros/s/AKfycbzRGGeIsy6j9QKgGzqGvLXw7c6XOJ8mztcXDcz4uBm3S_b9hAg2znP7TYPUBnU6LKaegQ/exec?requestType=' + requestType;
  const headers = {}
  headers['Content-Type'] = 'text/plain'
  //headers['Access-Control-Allow-Origin'] = '*'
  headers['mode'] = 'no-cors'
  const options = {
    method, 
    'mode': 'no-cors',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'
  }

  if (requestData && method != "GET") {
    options['body'] = JSON.stringify(requestData)
  } else if(requestData && method == "GET") {
    url = url + '&day=' + requestData.day + '&month=' + requestData.month + '&year=' + requestData.year
  }
  if (apikey) {
    headers['API-Key'] = apikey
  }
  //options['headers'] = headers
  
  try {
    const response = await fetch(url)
    //debugger
    //console.log(JSON.stringify(response))
    if(response.ok) return await response.json()
      else return {"outputValue":[715,716,717,718,719,720,722,723,724,725,726,727,729,730,731]}
  } catch (e) {
    //debugger
    throw e
  }
}

