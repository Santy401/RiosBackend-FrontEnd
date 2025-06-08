import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  PieChart, Pie, Cell,
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const TaskAnalytics = ({ tasks = { pending: 0, in_progress: 0, completed: 0 }, users = { byRole: {}, byDepartment: {} } }) => {
  // Estados para los tipos de gráficos
  const [taskChartType, setTaskChartType] = useState('pie');
  const [userChartType, setUserChartType] = useState('line');

  // Estados para los filtros (nuevos)
  const [taskFilter, setTaskFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('byRole');

  // Opciones de gráficos disponibles
  const chartTypes = [
    { value: 'pie', label: 'Gráfico de Torta' },
    { value: 'bar', label: 'Gráfico de Barras' },
    { value: 'line', label: 'Gráfico de Línea' }
  ];

  // Opciones de filtros para tareas
  const taskFilters = [
    { value: 'all', label: 'Todas las tareas' },
    { value: 'completed', label: 'Solo completadas' },
    { value: 'pending', label: 'Solo pendientes' }
  ];

  // Opciones de filtros para usuarios
  const userFilters = [
    { value: 'byRole', label: 'Por Rol' },
    { value: 'byDepartment', label: 'Por Departamento' }
  ];

  // Colores para los gráficos
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

  // Verificar si hay datos
  if (typeof tasks !== 'object' || typeof users !== 'object') {
    return (
      <div className="analytics-card">
        <h3>No hay datos disponibles</h3>
        <p>Por favor, asegúrate de que los datos de tareas y usuarios estén disponibles.</p>
      </div>
    );
  }

  // Procesar datos de tareas
  const taskData = {
    in_progress: tasks.in_progress || 0,
    completed: tasks.completed || 0,
    pending: tasks.pending || 0
  };

  // Procesar datos de usuarios
  const userData = {
    byRole: users.byRole || {},
    byDepartment: users.byDepartment || {}
  };

  // Preparar datos para gráficos de tareas
  const formattedTaskData = [
    { name: 'En Progreso', value: taskData.in_progress },
    { name: 'Completadas', value: taskData.completed },
    { name: 'Pendientes', value: taskData.pending }
  ];

  // Preparar datos para gráficos de usuarios según el filtro seleccionado
  const userChartData = userFilter === 'byRole'
    ? Object.entries(userData.byRole).map(([role, count]) => ({ name: role, value: count }))
    : Object.entries(userData.byDepartment).map(([dept, count]) => ({ name: dept, value: count }));

  // Función para renderizar gráfico de tareas
  const renderTaskChart = () => {
    const dataToShow = taskFilter === 'all'
      ? formattedTaskData
      : formattedTaskData.filter(item => item.name.toLowerCase().includes(taskFilter));

    switch (taskChartType) {
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={dataToShow}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {dataToShow.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      case 'bar':
        return (
          <BarChart data={dataToShow}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={dataToShow}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        );
      default:
        return null;
    }
  };

  // Función para renderizar gráfico de usuarios
  const renderUserChart = () => {
    switch (userChartType) {
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={userChartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#82ca9d"
              paddingAngle={5}
              dataKey="value"
            >
              {userChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      case 'bar':
        return (
          <BarChart data={userChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={userChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#82ca9d" />
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
  tasks: PropTypes.shape({
    pending: PropTypes.number,
    in_progress: PropTypes.number,
    completed: PropTypes.number
  }),
  users: PropTypes.shape({
    byRole: PropTypes.objectOf(PropTypes.number),
    byDepartment: PropTypes.objectOf(PropTypes.number)
  })
};

export default TaskAnalytics;