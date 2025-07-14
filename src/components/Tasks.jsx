import React, { useState, useEffect } from 'react';
import { User, Calendar, Clock } from 'lucide-react';
import TaskAnalytics from './tasktable/components/TaskAnalytics';
import { taksAnalyticsService, usersAnalyticsService } from '../services/analyticsService';
import './Tasks.css';
import { useAuth } from '../context/authContext';
import './tasktable/components/TaskAnalytics.css';
import CalendarComponent from '../components/Calendar/Calendar';

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

  const [tasks, setTasks] = useState({
    pending: 0,
    in_progress: 0,
    completed: 0
  });
  
  const [users, setUsers] = useState({
    byRole: {},
    byDepartment: {}
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Obtener datos de tareas y usuarios
        const [taskData, userData] = await Promise.all([
          taksAnalyticsService.getAnalytics(),
          usersAnalyticsService.getAnalytics()
        ]);

        // Estructuracion De Datos Para La Grafica
        const formattedTasks = {
          pending: taskData.taskStatus?.pending || 0,
          in_progress: taskData.taskStatus?.in_progress || 0,
          completed: taskData.taskStatus?.completed || 0,
          list: taskData.tasks || []
        };

        console.log("Lista recibida:", formattedTasks.list);        

        const formattedUsers = {
          byRole: userData.userStats?.byRole || {},
          byDepartment: userData.userStats?.byDepartment || {}
        };

        setTasks(formattedTasks);
        setUsers(formattedUsers);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError('Error al cargar los datos. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className='header-items-tasks'>
        <div className='header-items-tasks-text'>
          <label>Hola, {user.name}</label>
          <span>¿Listo Para Desempeñar tus tareas?</span>
        </div>
        <div className="time-info">
            <Clock className="icon" />
            <span>{currentTime.toLocaleTimeString()}</span>
          </div>
        <div className='header-items-tasks-date'>
        <Calendar className="icon" />
        <span>Hoy es {dayOfWeek}, {dayOfMonth} {month} {year}</span>
        </div>
      </div>
    <div className="tasks-container">
      <div className="tasks-content">
        {loading ? (
          <div>Cargando datos...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
            <TaskAnalytics tasks={tasks} users={users} />
        )}
      </div>
    </div>
    </div>
  );
};

export default Tasks;