import React, { useState, useEffect } from 'react';
import { User, Calendar, Clock } from 'lucide-react';
import './Tasks.css';

const Tasks = () => {
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
    <div className="tasks-container">
      <div className="tasks-header">
        <div className="admin-info">
          <User className="icon" />
          <span>¡HOLA ADMIN!</span>
          <div className="date-info">
            <Calendar className="icon" />
            <span>Hoy es {dayOfWeek}, {dayOfMonth} {month} {year}</span>
          </div>
        </div>
        <div className="time-info">
          <Clock className="icon" />
          <span>{currentTime.toLocaleTimeString()}</span>
        </div>
      </div>
      <div className="tasks-content">
        {/* Aquí irá el contenido de las tareas */}
      </div>
    </div>
  )
};

export default Tasks;