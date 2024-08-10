//import {use} from 'react';
import { getCalendarDays } from "../lib/utils";
import { getAvailableDates } from "../lib/data";

export default async function CalendarDays({parametersMonth}) {
  let availableDates;
  if(parametersMonth.availableDates.length == 0 ){
    if(parametersMonth.request <= 1) {
      parametersMonth.request =+ 1;
      availableDates = await getAvailableDates();
      parametersMonth['availableDates'] = availableDates;
    }
  }
  
  //(parametersMonth.firstDay, parametersMonth.number + 1, parametersMonth.year);
  
  const calendarDays = getCalendarDays(parametersMonth, parametersMonth.availableDates);

  return (    
    calendarDays?.map((week, indexWeek) => {
      return <tr key={indexWeek}>
        {week?.map((day, index) => {
          return <td key={index} className="day notselected">
            <span  className={day.available ? "available" : "notAvailable"}>{day.index }</span>
          </td>
        })}
      </tr>
      }
    )
  )           
}