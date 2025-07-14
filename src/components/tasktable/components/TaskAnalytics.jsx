import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  PieChart, Pie, Cell,
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  BarChart2,
  PieChart as PieIcon,
  LineChart as LineIcon,
  AlertTriangle
} from 'lucide-react';
import './TaskAnalytics.css';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

const historicalData = [
  { name: 'Lun', completadas: 2, en_progreso: 4 },
  { name: 'Mar', completadas: 3, en_progreso: 3 },
  { name: 'Mié', completadas: 5, en_progreso: 2 },
  { name: 'Jue', completadas: 4, en_progreso: 3 },
  { name: 'Vie', completadas: 6, en_progreso: 1 },
  { name: 'Sáb', completadas: 2, en_progreso: 2 },
  { name: 'Dom', completadas: 0, en_progreso: 1 },
];

const TaskAnalytics = ({ tasks = { in_progress: 0, completed: 0 } }) => {
  const [taskChartType, setTaskChartType] = useState('line');
  const [taskFilter, setTaskFilter] = useState('all');

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

  const taskData = {
    in_progress: tasks.in_progress || 0,
    completed: tasks.completed || 0,
  };

  const formattedTaskData = [
    { name: 'En Progreso', value: taskData.in_progress },
    { name: 'Completadas', value: taskData.completed },
  ];

  const filteredTaskData = taskFilter === 'all'
    ? formattedTaskData
    : formattedTaskData.filter(item => item.name.toLowerCase().includes(taskFilter));

  const renderChartMessage = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <AlertTriangle size={48} />
      <p className="text-gray-500">No hay datos suficientes para este filtro.</p>
    </div>
  );

  const renderTaskChart = () => {
    if (
      (taskChartType !== 'line' && (filteredTaskData.length === 0 || filteredTaskData.every(d => d.value === 0)))
    ) {
      return renderChartMessage();
    }

    switch (taskChartType) {
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={filteredTaskData}
              cx="50%" cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
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
            <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="completadas"
              stroke="#82ca9d"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="en_progreso"
              stroke="#8884d8"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="task-analytics-container">
      <div className="analytics-header">
        <h3>Estado de Tareas</h3>
        <div className="filters-container">
          <select
            className="filter-select"
            value={taskFilter}
            onChange={(e) => setTaskFilter(e.target.value)}
          >
            {taskFilters.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select
            className="filter-select"
            value={taskChartType}
            onChange={(e) => setTaskChartType(e.target.value)}
          >
            {chartTypes.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          {renderTaskChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

TaskAnalytics.propTypes = {
  tasks: PropTypes.shape({
    in_progress: PropTypes.number,
    completed: PropTypes.number
  })
};

export default TaskAnalytics;
