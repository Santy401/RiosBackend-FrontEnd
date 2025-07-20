import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import "./styles/TaskTable.css";
import TaskDetailModal from '../TaskDetailModal.jsx';
import { useAuth } from '../../context/authContext.jsx';
import { Listbox } from '@headlessui/react';
import { motion } from "framer-motion";
import TaskActionsBar from './TaskActionsBar.jsx';
import TaskFilterControls from './components/TaskFilterControls.jsx';
import TaskViewModeToggle from './components/TaskViewModeToggle.jsx';
import TaskTableHeader from './components/TaskTableHeader.jsx';
import TaskTableRow from './components/TaskTableRow.jsx';
import TaskEmptyState from './components/TaskEmptyState.jsx';
import { Search, User, Building2, Layout, Calendar, Eye, Pencil, Trash2 } from 'lucide-react';
import { formatDate, sortTasksByDueDate } from '../../utils/dateUtils';

const TaskTable = ({ tasks = [], onDeleteTask, onEditTask, onStatusChange }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // State
  const [sortConfig, setSortConfig] = useState({ key: 'dueDate', direction: 'asc' });
  const [selectedTask, setSelectedTask] = useState(null);
  const [expandedTask, setExpandedTask] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });

  // Search options
  const searchOptions = [
    { value: 'all', icon: <Search size={16} color="#888" />, label: 'Buscar en todo' },
    { value: 'user', icon: <User size={16} color="#3b82f6" />, label: 'Usuario' },
    { value: 'company', icon: <Building2 size={16} color="#8b5cf6" />, label: 'Empresa' },
    { value: 'area', icon: <Layout size={16} color="#10b981" />, label: 'Área' },
    { value: 'date', icon: <Calendar size={16} color="#ef4444" />, label: 'Fecha' },
  ];
  const [searchBy, setSearchBy] = useState(searchOptions[0]);

  // Helper functions
  const matchesField = (field, query) => {
    if (!query) return true;
    const queryLower = query.toLowerCase();
    return field?.toLowerCase().includes(queryLower);
  };

  const matchesDateRange = (task) => {
    if (!dateRange.startDate && !dateRange.endDate) return true;
    const taskDate = new Date(task.createdAt);
    
    if (dateRange.startDate) {
      const startDate = new Date(dateRange.startDate);
      if (taskDate < startDate) return false;
    }

    if (dateRange.endDate) {
      const endDate = new Date(dateRange.endDate);
      endDate.setHours(23, 59, 59, 999); // End of day
      if (taskDate > endDate) return false;
    }

    return true;
  };

  // Event handlers
  const handleSelectTask = (taskId) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
    setSelectAll(false);
  };

  const handleSelectAll = () => {
    const newSelected = new Set();
    if (!selectAll) {
      filteredTasks.forEach(task => newSelected.add(task.id));
    }
    setSelectedTasks(newSelected);
    setSelectAll(!selectAll);
  };

  const handleDeleteSelected = () => {
    const taskIdsArray = Array.from(selectedTasks);
    taskIdsArray.forEach(async (taskId) => {
      try {
        await onDeleteTask(taskId);
      } catch (error) {
        console.error(`Error al eliminar tarea ${taskId}:`, error);
      }
    });
    setSelectedTasks(new Set());
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleRowClick = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  // Process and filter tasks
  const sortedTasks = useMemo(() => {
    if (!Array.isArray(tasks)) return [];
    
    let sorted = [...tasks];
    
    // Apply date sorting
    if (sortConfig.key === 'dueDate' || sortConfig.key === 'createdAt') {
      sorted = sortTasksByDueDate(sorted, sortConfig.direction);
    } else if (sortConfig.key) {
      sorted.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nested properties
        if (sortConfig.key.includes('.')) {
          const keys = sortConfig.key.split('.');
          aValue = keys.reduce((obj, key) => obj?.[key], a);
          bValue = keys.reduce((obj, key) => obj?.[key], b);
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return sorted;
  }, [tasks, sortConfig]);

  const filteredTasks = useMemo(() => {
    if (!Array.isArray(sortedTasks)) return [];
    
    return sortedTasks.filter(task => {
      // Apply status filter
      if (filterStatus !== 'all' && task.status !== filterStatus) {
        return false;
      }
      
      // Apply search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        switch(searchBy.value) {
          case 'user':
            if (!task.assignedUser?.name?.toLowerCase().includes(query)) return false;
            break;
          case 'company':
            if (!task.company?.name?.toLowerCase().includes(query)) return false;
            break;
          case 'area':
            if (!task.Areas?.nombre_area?.toLowerCase().includes(query)) return false;
            break;
          case 'date':
            const taskDate = formatDate(task.dueDate).toLowerCase();
            if (!taskDate.includes(query)) return false;
            break;
          default:
            if (!task.title?.toLowerCase().includes(query) && 
                !task.observation?.toLowerCase().includes(query)) {
              return false;
            }
        }
      }
      
      // Apply date range filter
      if (!matchesDateRange(task)) {
        return false;
      }
      
      return true;
    });
  }, [sortedTasks, filterStatus, searchBy, searchQuery, dateRange]);

  // Status and style helpers
  const getStatusClass = (status) => {
    const statusClasses = {
      in_progress: 'status-in-progress',
      completed: 'status-completed',
    };
    return `status-badge ${statusClasses[status] || ''}`;
  };

  const getRowClass = (status) => {
    return status === 'completed' ? 'completed-task' : '';
  };

  // Task counts
  const activeTasksCount = filteredTasks.filter((task) => task.status === 'in_progress').length;
  const completedTasksCount = filteredTasks.filter((task) => task.status === 'completed').length;

  return (
    <div className="task-tables-container">
      <div className="filters-container" style={{ marginBottom: '15px' }} />

      <div className="view-mode-toggle">
        {isAdmin && (
          <div className="task-counters" style={{ marginBottom: '10px', paddingRight: '10px' }}>
            <span className="counter in-progress-counter" style={{ paddingRight: '10px' }}>
              <span className='name-title'>Total</span>
              <div className='counter-count'>
                <span className='counter-number'>{filteredTasks.length}</span>
              </div>
            </span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TaskFilterControls
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            searchBy={searchBy}
            setSearchBy={setSearchBy}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            dateRange={dateRange}
            setDateRange={setDateRange}
            searchOptions={searchOptions}
          />
          <TaskViewModeToggle
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </div>
      </div>

      <div className="task-section">
        {selectedTasks.size > 0 && (
          <TaskActionsBar
            selectedTasksCount={selectedTasks.size}
            onDeleteSelected={handleDeleteSelected}
            onStatusChange={onStatusChange}
          />
        )}
        
        <div className="task-table-container">
          {filteredTasks.length === 0 ? (
            <TaskEmptyState tasks={tasks} searchQuery={searchQuery} />
          ) : viewMode === 'table' ? (
            <div className="table-responsive">
              <motion.table className="task-table">
                <thead>
                  <TaskTableHeader
                    sortConfig={sortConfig}
                    handleSort={handleSort}
                    isAdmin={isAdmin}
                    selectedTasks={selectedTasks}
                    selectedTasksCount={selectedTasks.size}
                    handleSelectAll={handleSelectAll}
                    handleDeleteSelected={handleDeleteSelected}
                    viewMode={viewMode}
                  />
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <TaskTableRow
                      key={task.id}
                      task={task}
                      selectedTasks={selectedTasks}
                      handleSelectTask={handleSelectTask}
                      expandedTask={expandedTask}
                      handleRowClick={handleRowClick}
                      onStatusChange={onStatusChange}
                      isAdmin={isAdmin}
                      onDeleteTask={onDeleteTask}
                      onEditTask={onEditTask}
                      formatDate={formatDate}
                      getStatusClass={getStatusClass}
                      getRowClass={getRowClass}
                      viewMode={viewMode}
                    />
                  ))}
                </tbody>
              </motion.table>
            </div>
          ) : viewMode === 'list' ? (
            <div className="task-list-container">
              {filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  className={`task-list-item ${getRowClass(task.status)} ${expandedTask === task.id ? 'expanded' : ''}`}
                  onClick={() => handleRowClick(task.id)}
                >
                  <div className="list-item-header">
                    <h3>{task.title}</h3>
                    <select
                      className={getStatusClass(task.status)}
                      value={task.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        onStatusChange(task.id, e.target.value);
                      }}
                    >
                      <option value="in_progress">En Proceso</option>
                      <option value="completed">Completada</option>
                    </select>
                  </div>
                  <div className="list-item-content">
                    <div className="list-item-row">
                      <span className="label">Observación:</span>
                      <div className="task-observation">
                        <div
                          className="observation-content"
                          title={task.observation}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTask(task);
                          }}
                        >
                          {task.observation || '-'}
                        </div>
                        {expandedTask === task.id && task.observation && (
                          <div className="observation-expanded">{task.observation}</div>
                        )}
                      </div>
                    </div>
                    <div className="list-item-row">
                      <span className="label">Usuario:</span>
                      <span>{task.assignedUser?.name || '-'}</span>
                    </div>
                    <div className="list-item-row">
                      <span className="label">Empresa:</span>
                      <span>{task.company?.name || '-'}</span>
                    </div>
                    <div className="list-item-row">
                      <span className="label">Área:</span>
                      <span>{task.Areas?.nombre_area || '-'}</span>
                    </div>
                    <div className="list-item-row">
                      <span className="label">Fecha Creación:</span>
                      <span>{formatDate(task.createdAt)}</span>
                    </div>
                    <div className="list-item-row">
                      <span className="label">Fecha Límite:</span>
                      <span>{formatDate(task.dueDate)}</span>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="list-item-actions">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTask(task);
                        }}
                        className="detail-button"
                        title="Ver detalles"
                      >
                        <Eye className="icon" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTask(task);
                        }}
                        className="edit-button"
                        title="Editar tarea"
                      >
                        <Pencil className="icon" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTask(task);
                        }}
                        className="delete-button"
                        title="Eliminar tarea"
                      >
                        <Trash2 className="icon" />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="task-cards-container">
              {filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  className={`task-card ${getRowClass(task.status)}`}
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="card-header">
                    <h3>{task.title}</h3>
                    <select
                      className={getStatusClass(task.status)}
                      value={task.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        onStatusChange(task.id, e.target.value);
                      }}
                    >
                      <option value="in_progress">En Proceso</option>
                      <option value="completed">Completada</option>
                    </select>
                  </div>
                  <div className="card-content">
                    <p className="card-description">{task.observation || 'Sin descripción'}</p>
                    <div className="card-meta">
                      <div className="meta-item">
                        <User size={14} />
                        <span>{task.assignedUser?.name || 'Sin asignar'}</span>
                      </div>
                      <div className="meta-item">
                        <Building2 size={14} />
                        <span>{task.company?.name || 'Sin empresa'}</span>
                      </div>
                      <div className="meta-item">
                        <Calendar size={14} />
                        <span>Vence: {formatDate(task.dueDate)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedTask && (
        <TaskDetailModal 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)} 
        />
      )}
    </div>
  );
};

TaskTable.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      observation: PropTypes.string,
      status: PropTypes.oneOf(['in_progress', 'completed']).isRequired,
      dueDate: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      assignedUser: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string
      }),
      company: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string
      }),
      Areas: PropTypes.shape({
        id: PropTypes.number,
        nombre_area: PropTypes.string
      })
    })
  ),
  onDeleteTask: PropTypes.func.isRequired,
  onEditTask: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired
};

export default TaskTable;
