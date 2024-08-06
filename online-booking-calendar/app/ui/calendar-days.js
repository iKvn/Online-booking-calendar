//import {use} from 'react';

export default function CalendarDays({calendarDays, availableDatesPromise}) {
  //const availableDates = use(availableDatesPromise);

  return (    
    calendarDays?.map((week, indexWeek) => {
      return <tr key={indexWeek}>
        {week?.map((day, index) => {
          return <td key={index} className="day notselected">
            <span  className="notAvailable">{day.index }</span>
          </td>
        })}
      </tr>
      }
    )
  )           
}