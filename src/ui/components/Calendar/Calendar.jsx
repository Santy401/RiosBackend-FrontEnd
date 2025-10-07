import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useState } from 'react';
import './calendar.css';

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());

  return <Calendar onChange={setDate} value={date} />;
};

export default CalendarComponent;
