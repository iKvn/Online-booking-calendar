import { getCalendarDays } from "../lib/utils";
import CalendarDays from "./calendar-days";
//import { getAvailableDates } from "../lib/data";
import { Suspense } from "react";

export default function Calendar({parametersMonth}) {
  const calendarDays = getCalendarDays(parametersMonth);
  const availableDates = [];//await getAvailableDates(parametersMonth.firstDay, parametersMonth.number, parametersMonth.year);

  return (    
    <Suspense fallback={<p>Loading Comments...</p>}>
      <CalendarDays calendarDays={calendarDays} availableDatesPromise={availableDates}/>
    </Suspense>
  )           
}