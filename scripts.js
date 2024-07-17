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
  //console.log(returnArray)
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
    }
  } else availableDates = availableDates
}

function generateCalendar(actionName) {
  const informMonth = document.querySelector('#informMonth');
  informMonth.innerHTML = `${parametersMonth.name} ${parametersMonth.year}`

  const calendar = document.querySelector('#calendar')

  if(actionName === 'monthChange') calendar.replaceChildren()
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
      td.addEventListener('click', clickDay)
      tr.appendChild(td)
    })
    calendar.append(tr);
  })   
  decreaseTime() 
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
    selectedDay.indexweek = indexWeek
    selectedDay.indexday = indexDay
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
    //generateCalendar(true)
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
  getAvailableDates(parametersMonth.firstDay, parametersMonth.number, parametersMonth.year, actionName)
  //debugger
  //generateCalendar()
  //console.log(bootFlag)
  //bootFlag = false
  //setInterval(decreaseTime(), 100)
}


function decreaseTime() {
  //console.log(bootFlag)
  if (!bootFlag) {
    clearInterval(nIntervId)
    spinner.classList.add('hide')
    container.classList.remove('hide')
  }
}

const buttons = document.querySelectorAll("button");
buttons.forEach((button) => {
  button.addEventListener("click", monthChange)
})
const spinner = document.querySelector('.pulse-container')
const container = document.querySelector('.container')
let nIntervId = setInterval(decreaseTime(), 100)

defaultSettings()

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

