import {MonthChangeUp, MonthChangeDown} from './buttons'

export default function Month({parametersMonth, setParametersMonth}) {
  return (
    <tr>
      <MonthChangeDown setParametersMonth={setParametersMonth} />
      <td colSpan={5} className="inform">{parametersMonth.name} {parametersMonth.year}</td>
      <MonthChangeUp setParametersMonth={setParametersMonth} />
    </tr>
  );
}