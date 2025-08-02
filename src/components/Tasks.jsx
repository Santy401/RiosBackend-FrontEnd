import { useState, useEffect } from 'react';
import './Tasks.css';
import { useAuth } from '../context/authContext';

const Tasks = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [dayOfMonth, setDayOfMonth] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const daysOfWeek = [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
  ];

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      setDayOfWeek(daysOfWeek[now.getDay()]);
      setDayOfMonth(now.getDate());
      setMonth(months[now.getMonth()]);
      setYear(now.getFullYear());
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <div className='header-items-tasks'>
        <div className='header-items-tasks-text'>
          <label>Hola, {user.name}</label>
        </div>
        <div className="time-info">
            <span>{currentTime.toLocaleTimeString()}</span>
          </div>
        <div className='header-items-tasks-date'>
        <span>{dayOfWeek}, {dayOfMonth} {month} {year}</span>
        </div>
      </div>
    <div className="tasks-container">
      <div className="tasks-content">
        <div></div>
      </div>
    </div>
    </div>
  );
};

export default Tasks;