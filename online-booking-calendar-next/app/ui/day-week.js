export default function DayWeek() {
  const day = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
  return (   
    <tr>
      {day?.map((d, index) => {
        return <td key={index} className="dayWeek">{d}</td>
      })}
    </tr>
  );
}