export async function getAvailableDates(firstDay = '', month = '', year = '') {
  /* const requestData = {
    'day': firstDay, 
    month, 
    year
  } */
  const requestData = {
    'available_period': true, 
  }
  const res = await requestAPI('getAvailableDates', requestData);
  
  if(res.outputValue && Array.isArray(res.outputValue)) return res.outputValue;
  else return [];
}

export async function requestAPI(requestType, requestData, method = "GET") {
  let url = 'https://script.google.com/macros/s/AKfycbzRGGeIsy6j9QKgGzqGvLXw7c6XOJ8mztcXDcz4uBm3S_b9hAg2znP7TYPUBnU6LKaegQ/exec?requestType=' + requestType;

  if(requestData && method == "GET") {
    //url = url + '&day=' + requestData.day + '&month=' + requestData.month + '&year=' + requestData.year;
    url = url + '&available_period=' + requestData.available_period;
  }
  if(requestType === "setSelectedDateTime") {
    url = url + '&clock=' + requestData.clock + '&date=' + requestData.date
  }
  
  try {
    const response = await fetch(url)
    if(response.ok) return await response.json()
      else return {"outputValue":[]}
  } catch (e) {
    throw e
  }
}