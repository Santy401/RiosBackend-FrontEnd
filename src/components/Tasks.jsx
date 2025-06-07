import React, { useState, useEffect } from 'react';
import { User, Calendar, Clock } from 'lucide-react';
import TaskAnalytics from './tasktable/components/TaskAnalytics';
import './Tasks.css';
import './tasktable/components/TaskAnalytics.css';

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

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Simulación de datos - en producción estos vendrían de una API
    const mockTasks = [
      { id: 1, status: 'in_progress', title: 'Tarea 1' },
      { id: 2, status: 'in_progress', title: 'Tarea 2' },
      { id: 3, status: 'completed', title: 'Tarea 3' },
      { id: 4, status: 'in_progress', title: 'Tarea 4' },
      { id: 5, status: 'completed', title: 'Tarea 5' },
    ];

    const mockUsers = [
      { id: 1, name: 'Usuario 1', createdAt: '2025-05-27T00:00:00' },
      { id: 2, name: 'Usuario 2', createdAt: '2025-05-28T00:00:00' },
      { id: 3, name: 'Usuario 3', createdAt: '2025-05-29T00:00:00' },
      { id: 4, name: 'Usuario 4', createdAt: '2025-05-30T00:00:00' },
      { id: 5, name: 'Usuario 5', createdAt: '2025-05-31T00:00:00' },
    ];

    // Asegurar que los datos sean arrays
    setTasks(Array.isArray(mockTasks) ? mockTasks : []);
    setUsers(Array.isArray(mockUsers) ? mockUsers : []);
  }, []);

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <div className="admin-info">
          <h1>Dashboard</h1>
           <div className="time-info">
           <Clock className="icon" />
           <span>{currentTime.toLocaleTimeString()}</span>
           </div>
          <div className="date-info">
            <Calendar className="icon" />
            <span>Hoy es {dayOfWeek}, {dayOfMonth} {month} {year}</span>
          </div>
        </div>
      </div>
      <div className="tasks-content">
        <TaskAnalytics tasks={tasks} users={users} />
      </div>
    </div>
  )
};

export default Tasks;