import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { getParametersMonth } from '../lib/utils';

export function MonthChangeDown({setParametersMonth}) {
  return (
    <td>
      <button type="button" value= "-1" onClick={setParametersMonth}><ArrowLeftIcon style={{width: 11}} /></button>
    </td>
  );
}

export function MonthChangeUp({setParametersMonth}) {
  return (
    <td>
      <button type="button" value= "1" onClick={setParametersMonth}><ArrowRightIcon style={{width: 11}} /></button>
    </td>
  );
}

/* function monthChange(valueChange, parametersMonth) {
  const startdate = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const enddate = new Date(startdate.getFullYear(), startdate.getMonth()+2, 1)
  const currentdate = new Date(parametersMonth.year, parametersMonth.number - 1, 1)
  if (valueChange == -1 && startdate.getTime() < currentdate.getTime() || valueChange == 1 && enddate.getTime() > currentdate.getTime()) {
    parametersMonth = getParametersMonth(currentdate, valueChange);
    //console.log(parametersMonth)
    //getAvailableDates(parametersMonth.firstDay, parametersMonth.number, parametersMonth.year, 'monthChange')
  }
} */