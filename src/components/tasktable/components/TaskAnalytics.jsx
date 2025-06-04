import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, 
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import PropTypes from 'prop-types';

const TaskAnalytics = ({ tasks = [], users = [] }) => {
  // Estados para los filtros
  const [taskFilter, setTaskFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  
  // Estados para los tipos de gráficos
  const [taskChartType, setTaskChartType] = useState('pie');
  const [userChartType, setUserChartType] = useState('line');

  // Opciones de gráficos disponibles
  const chartTypes = [
    { value: 'pie', label: 'Gráfico de Torta' },
    { value: 'bar', label: 'Gráfico de Barras' },
    { value: 'line', label: 'Gráfico de Línea' }
  ];

  // Filtros para tareas
  const taskFilters = [
    { value: 'all', label: 'Todas las tareas' },
    { value: 'in_progress', label: 'En Progreso' },
    { value: 'completed', label: 'Completadas' }
  ];

  // Filtros para usuarios
  const userFilters = [
    { value: 'all', label: 'Todos los días' },
    { value: '7d', label: 'Últimos 7 días' },
    { value: '30d', label: 'Últimos 30 días' }
  ];

  // Colores para los gráficos
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

  // Filtrar tareas según el filtro seleccionado
  const filteredTasks = taskFilter === 'all' ? tasks : tasks.filter(task => task.status === taskFilter);

  // Verificar si hay datos
  if (!tasks || !Array.isArray(tasks) || !users || !Array.isArray(users)) {
    return (
      <div className="analytics-card">
        <h3>No hay datos disponibles</h3>
        <p>Por favor, asegúrate de que los datos de tareas y usuarios estén disponibles.</p>
      </div>
    );
  }

  // Datos para el gráfico de tareas
  const taskStatusData = [
    { name: 'En Progreso', value: filteredTasks.filter(task => task?.status === 'in_progress').length || 0 },
    { name: 'Completadas', value: filteredTasks.filter(task => task?.status === 'completed').length || 0 },
    { name: 'Total', value: filteredTasks.length }
  ];

  // Datos para el gráfico de usuarios
  const generateUserData = () => {
    const data = [];
    const now = new Date();
    const daysToShow = userFilter === 'all' ? 30 : userFilter === '7d' ? 7 : 30;

    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateStr = date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
      
      const usersCreated = users.filter(user => {
        try {
          const userDate = new Date(user.createdAt);
          return userDate.getDate() === date.getDate() &&
                 userDate.getMonth() === date.getMonth() &&
                 userDate.getFullYear() === date.getFullYear();
        } catch (error) {
          console.error('Error parsing user date:', error);
          return false;
        }
      }).length;

      data.push({ name: dateStr, users: usersCreated });
    }

    return data;
  };

  const userCreationData = generateUserData();

  // Tooltip personalizado para tareas
  const CustomTaskTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = filteredTasks.length;
      const percentage = (payload[0].value / total * 100).toFixed(1);
      
      return (
        <div className="custom-tooltip" style={{
          backgroundColor: '#fff',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>{payload[0].name}</p>
          <p style={{ margin: '3px 0' }}><strong>Tareas:</strong> {payload[0].value}</p>
          <p style={{ margin: '3px 0' }}><strong>Porcentaje:</strong> {percentage}%</p>
        </div>
      );
    }
    return null;
  };

  // Tooltip personalizado para usuarios
  const CustomUserTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{
          backgroundColor: '#fff',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>{label}</p>
          <p style={{ margin: '3px 0' }}><strong>Usuarios creados:</strong> {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  // Renderizar gráfico de tareas según el tipo seleccionado
  const renderTaskChart = () => {
    switch(taskChartType) {
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={taskStatusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {taskStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTaskTooltip />} />
            <Legend />
          </PieChart>
        );
      case 'bar':
        return (
          <BarChart data={taskStatusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTaskTooltip />} />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={taskStatusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTaskTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        );
      default:
        return null;
    }
  };

  // Renderizar gráfico de usuarios según el tipo seleccionado
  const renderUserChart = () => {
    switch(userChartType) {
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={userCreationData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#82ca9d"
              dataKey="users"
            >
              {userCreationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomUserTooltip />} />
            <Legend />
          </PieChart>
        );
      case 'bar':
        return (
          <BarChart data={userCreationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomUserTooltip />} />
            <Legend />
            <Bar dataKey="users" fill="#82ca9d" />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={userCreationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomUserTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="users" stroke="#82ca9d" />
          </LineChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="task-analytics-container" style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
      padding: '20px'
    }}>
      {/* Gráfico de Tareas */}
      <div className="analytics-card" style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div className="analytics-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: 0 }}>Estado de Tareas</h3>
          <div className="filters-container" style={{ display: 'flex', gap: '10px' }}>
            <select
              value={taskFilter}
              onChange={(e) => setTaskFilter(e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            >
              {taskFilters.map(filter => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
            <select
              value={taskChartType}
              onChange={(e) => setTaskChartType(e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            >
              {chartTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            {renderTaskChart()}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Usuarios */}
      <div className="analytics-card" style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div className="analytics-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: 0 }}>Usuarios Creados</h3>
          <div className="filters-container" style={{ display: 'flex', gap: '10px' }}>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            >
              {userFilters.map(filter => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
            <select
              value={userChartType}
              onChange={(e) => setUserChartType(e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            >
              {chartTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            {renderUserChart()}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

TaskAnalytics.propTypes = {
  tasks: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
};

export default TaskAnalytics;