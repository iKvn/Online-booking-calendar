import CalendarDays from "./calendar-days";
import { Suspense } from 'react';

export default function Calendar({parametersMonth}) {
  
  return (    
    <Suspense fallback={
      <tr className='pulse-container'>
        <td>
          <div className="day"></div>
        </td> 
        <td>
          <div className="day"></div>
        </td>
        <td>
          <div className="pulse-bubble pulse-bubble-3"></div>
        </td>
        <td>
          <div className="pulse-bubble pulse-bubble-1"></div>
        </td>
        <td>
          <div className="pulse-bubble pulse-bubble-2"></div>
        </td>
        <td>
          <div className="day"></div>
        </td>
        <td>
          <div className="day"></div>
        </td> 
      </tr>
    }>
      <CalendarDays parametersMonth={parametersMonth}/>
    </Suspense>
  )           
}