"use client"

import { useReducer } from 'react';
import { getParametersMonth } from './lib/utils';

import Month from './ui/month';
import DayWeek from './ui/day-week';
import Calendar from './ui/calendar';

const initialParametersMonth = getParametersMonth(undefined, {type: 'current', value: 0});

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