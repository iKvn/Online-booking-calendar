import { parametersRequest } from "@/store/store";

export async function getOAuthToken() {
  const requestData = {
  }
  const res = await requestAPI('getOAuthToken', requestData);
  
  if(res.outputValue) {
    parametersRequest.authToken = res.outputValue;
  };
}

export async function getAvailableDates() {
  const requestData = {
    'available_period': true, 
  }
  const res = await requestAPI('getAvailableDates', requestData);
  
  if(res.outputValue && Array.isArray(res.outputValue)) return res.outputValue;
  else return [];
}

export async function getAvailableTime(day, month, year) {
  const requestData = {
    day, 
    month, 
    year
  }
  const res = await requestAPI('getAvailableTime', requestData)
  
  if(res.outputValue && Array.isArray(res.outputValue)) return res.outputValue;
  else return [];
}

export async function setSelectedDateTime(day, month, year, clock, date) {
  const requestData = {
    day, 
    month, 
    year,
    clock,
    date
  }
  const res = await requestAPI('setSelectedDateTime', requestData)
  if(res.outputValue && Array.isArray(res.outputValue.availableTime) && Object.hasOwn(res.outputValue, 'timeBusy')) return res.outputValue;
  else return {
    availableTime: [],
    timeBusy: true
  };
}

export async function getReportBooking(report_day) {
  const requestData = {
    report_day
  }
  const res = await requestAPI('getReportBooking', requestData)
  if(res.outputValue && Array.isArray(res.outputValue)) return res.outputValue;
  else return ['Виникла помилка, спробуйте пізніше!'];
}

export async function requestAPI(requestType, requestData) {
  let url = `https://script.google.com/macros/s/${parametersRequest.tableid}/exec?requestType=${requestType}`;

  if(requestType === "getAvailableDates" && requestData.available_period) {
    url = `${url}&available_period=${requestData.available_period}`;
  }
  if(requestType === "getAvailableTime" || requestType === "setSelectedDateTime") {
    url = `${url}&day=${requestData.day}&month=${requestData.month}&year=${requestData.year}`
  }
  if(requestType === "setSelectedDateTime") {
    url = `${url}&clock=${requestData.clock}&date=${requestData.date}&userid=${parametersRequest.userid}`
  }
  if(requestType === "getReportBooking" && requestData.report_day) {
    url = `${url}&reportDay=${requestData.report_day}`
  }
  
  const params = {
    redirect: "follow",
    method: "GET",
    muteHttpExceptions: true,
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
  };
  /* if(parametersRequest.authToken) params.headers = {
    Authorization: `Bearer ${parametersRequest.authToken}`
  }  */

 // try {
    const response = await fetch(url, params)
    /* .then((response) => {return response.json()})
    .then((data) => {
      return data;
    }) */
    if(response.ok) return await response.json()
    else return {"outputValue":[]}
  //} catch (e) {
  //  throw e
  //}
}