"use client"

import { getParametersMonth } from './lib/utils';
import Month from './ui/month';
import DayWeek from './ui/day-week';
import { useReducer } from 'react';
import Calendar from './ui/calendar';

//const CURRENT_DATE = new Date();
const initialParametersMonth = getParametersMonth(undefined, {type: 'current', value: 0});

/* const selectedDay = {
  index: 0,
  month: 0,
  year: 0,
  clock: 0,
  minutes: 0,
  target: null,
  indexweek: 0,
  indexday: 0
} */

export default function Home() {
  const [parametersMonth, dispatch] = useReducer(getParametersMonth, initialParametersMonth);
  function setParametersMonth(e){
    const value = Number(e.currentTarget.value);
    const type = value == 1 ? 'future' : 'past' ;
    dispatch({
      type,
      value,
    });
  }

  return (
    <main className="container">
      <table>
        <thead id="selectedDay">
          <Month parametersMonth={parametersMonth} setParametersMonth={setParametersMonth}/>
          <DayWeek />
        </thead>
        <tbody>
          <Calendar parametersMonth={parametersMonth} />  
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={7} className="inform">
              <span>Дата не обрана!</span>
            </td>
          </tr>  
        </tfoot>
      </table>    
    </main>
  );
}