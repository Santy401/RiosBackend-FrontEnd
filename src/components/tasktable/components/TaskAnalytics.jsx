import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  PieChart, Pie, Cell,
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { BarChart2, PieChart as PieIcon, LineChart as LineIcon, AlertTriangle } from 'lucide-react';

const TaskAnalytics = ({ tasks = { in_progress: 0, completed: 0 }, users = { byRole: {}, byDepartment: {} } }) => {
  const [taskChartType, setTaskChartType] = useState('pie');
  const [userChartType, setUserChartType] = useState('bar');
  const [taskFilter, setTaskFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('role');

  const chartTypes = [
    { value: 'pie', label: 'Torta', icon: <PieIcon size={16} /> },
    { value: 'bar', label: 'Barras', icon: <BarChart2 size={16} /> },
    { value: 'line', label: 'Línea', icon: <LineIcon size={16} /> }
  ];

  const taskFilters = [
    { value: 'all', label: 'Todas' },
    { value: 'completed', label: 'Completadas' },
    { value: 'in_progress', label: 'En Progreso' },
  ];

  const userFilters = [
    { value: 'role', label: 'Por Rol' },
  ];

  const taskData = {
    in_progress: tasks.in_progress || 0,
    completed: tasks.completed || 0,
  };

  const formattedTaskData = [
    { name: 'En Progreso', value: taskData.in_progress },
    { name: 'Completadas', value: taskData.completed },
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

  const filteredTaskData = taskFilter === 'all'
    ? formattedTaskData
    : taskFilter === 'completed'
      ? formattedTaskData.filter(item => item.name === 'Completadas')
      : formattedTaskData.filter(item => item.name === 'En Progreso');

  const selectedUserData = userFilter === 'role'
    ? users.byRole || {}
    : users.byDepartment || {};

  const allUserData = Object.entries(selectedUserData).map(([name, value]) => ({ name, value }));

  const renderChartMessage = () => (
    <div style={{ textAlign: 'center', color: '#999', marginTop: '100px' }}>
      <AlertTriangle size={48} />
      <p>No hay datos suficientes para este filtro.</p>
    </div>
  );

  const renderTaskChart = () => {
    if (filteredTaskData.length === 0 || filteredTaskData.every(d => d.value === 0)) return renderChartMessage();

    switch (taskChartType) {
      case 'pie':
        return (
          <PieChart>
            <Pie data={filteredTaskData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
              {filteredTaskData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      case 'bar':
        return (
          <BarChart data={filteredTaskData}>
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
          <LineChart data={filteredTaskData}>
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

  const renderUserChart = () => {
    if (allUserData.length === 0 || allUserData.every(u => u.value === 0)) return renderChartMessage();

    switch (userChartType) {
      case 'pie':
        return (
          <PieChart>
            <Pie data={allUserData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#82ca9d" paddingAngle={5} dataKey="value">
              {allUserData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      case 'bar':
        return (
          <BarChart data={allUserData}>
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
          <LineChart data={allUserData}>
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
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3>Estado de Tareas</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <select value={taskFilter} onChange={(e) => setTaskFilter(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
              {taskFilters.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <select value={taskChartType} onChange={(e) => setTaskChartType(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
              {chartTypes.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            {renderTaskChart()}
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3>Estado de Usuarios</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <select value={userFilter} onChange={(e) => setUserFilter(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
              {userFilters.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <select value={userChartType} onChange={(e) => setUserChartType(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
              {chartTypes.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
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
