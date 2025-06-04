import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './styles/TaskTable.css';
import TaskDetailModal from '../components/TaskDetailModal.jsx';
import { useAuth } from '../context/authContext.jsx';
import { motion } from "framer-motion";
import { Listbox } from '@headlessui/react';
import { Search, User, Building2, Layout, Calendar } from 'lucide-react';

const TaskTable = ({ tasks, onDeleteTask, onEditTask, onStatusChange }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const searchOptions = [
    { value: 'all', icon: <Search size={16} color="#888" /> },
    { value: 'user', icon: <User size={16} color="#3b82f6" /> },
    { value: 'company', icon: <Building2 size={16} color="#8b5cf6" /> },
    { value: 'area', icon: <Layout size={16} color="#10b981" /> },
    { value: 'date', icon: <Calendar size={16} color="#ef4444" /> },
  ];

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedTask, setSelectedTask] = useState(null);
  const [expandedTask, setExpandedTask] = useState(null);
  const [viewMode, setViewMode] = useState('cards');
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState(searchOptions[0]);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });
  const [selectedStatus, setSelectedStatus] = useState('');
  const [filteredTasks, setFilteredTasks] = useState([]);

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
    if (selectAll) {
      setSelectedTasks(newSelected);
    } else {
      filteredTasks.forEach(task => newSelected.add(task.id));
      setSelectedTasks(newSelected);
    }
    setSelectAll(!selectAll);
  };

  const handleDeleteSelected = (e) => {
    if (selectedTasks.size === 0) return;

    if (window.confirm('¿Estás seguro de que deseas eliminar las tareas seleccionadas?')) {
      const taskIdsArray = Array.from(selectedTasks);
      taskIdsArray.forEach(async (taskId) => {
        try {
          await onDeleteTask(taskId);
        } catch (error) {
          console.error(`Error al eliminar tarea ${taskId}:`, error);
        }
      });

      setSelectedTasks(new Set());
      setSelectAll(false);
    }
  };

  const handleChangeStatusSelected = (newStatus) => {
    if (selectedTasks.size === 0) return;

    if (window.confirm('¿Estás seguro de que deseas cambiar el estado de las tareas seleccionadas?')) {
      selectedTasks.forEach(taskId => onStatusChange(taskId, newStatus));
      setSelectedTasks(new Set());
      setSelectAll(false);
      setSelectedStatus('');
    }
  };

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
      if (taskDate > endDate) return false;
    }

    return true;
  };

  const filterAndSortTasks = useCallback(() => {
    // Filtrado
    const filtered = tasks.filter(task => {
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;

      let matchesSearch = false;

      if (searchBy.value === 'all') {
        matchesSearch = matchesField(task.title, searchQuery) ||
          matchesField(task.description, searchQuery) ||
          matchesField(task.assignedUser?.name, searchQuery) ||
          matchesField(task.company?.name, searchQuery) ||
          matchesField(task.Areas?.nombre_area, searchQuery);
      } else if (searchBy.value === 'user') {
        matchesSearch = matchesField(task.assignedUser?.name, searchQuery);
      } else if (searchBy.value === 'company') {
        matchesSearch = matchesField(task.company?.name, searchQuery);
      } else if (searchBy.value === 'area') {
        matchesSearch = matchesField(task.Areas?.nombre_area, searchQuery);
      } else if (searchBy.value === 'date') {
        matchesSearch = matchesDateRange(task);
      }

      return matchesStatus && matchesSearch;
    });

    // Ordenamiento
    const sorted = [...filtered].sort((a, b) => {
      if (!sortConfig.key) return 0;

      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key.includes('.')) {
        const keys = sortConfig.key.split('.');
        aValue = keys.reduce((obj, key) => obj?.[key], a);
        bValue = keys.reduce((obj, key) => obj?.[key], b);
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredTasks(sorted);
  }, [tasks, filterStatus, searchBy, searchQuery, dateRange, sortConfig]);

  useEffect(() => {
    filterAndSortTasks();
  }, [filterAndSortTasks]);

  const activeTasksCount = filteredTasks.filter((task) => task.status === 'in_progress').length;
  const completedTasksCount = filteredTasks.filter((task) => task.status === 'completed').length;

  const formatDate = (dateString) => {
    if (!dateString) return '-';

    try {
      const date = new Date(dateString);

      if (!isNaN(date.getTime())) {
        return date.toLocaleString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
      }

      if (typeof dateString === 'string') {
        const dateParts = dateString.split('T');
        if (dateParts.length === 2) {
          const dateOnly = dateParts[0];
          const timeOnly = dateParts[1];
          const [year, month, day] = dateOnly.split('-');
          const [hour, minute] = timeOnly.split(':');
          return `${day}/${month}/${year} ${hour}:${minute}`;
        }

        const datePartsDash = dateString.split('-');
        if (datePartsDash.length === 3) {
          return `${datePartsDash[2]}/${datePartsDash[1]}/${datePartsDash[0]}`;
        }
      }

      return '-';
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return '-';
    }
  };

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

  const handleDeleteClick = (e, task) => {
    e.stopPropagation();
    if (!task || !task.id) {
      console.error('Intento de eliminar tarea inválida:', task);
      return;
    }
    onDeleteTask(task);
  };

  return (
    <div className="task-tables-container">
      <div className="filters-container" style={{ marginBottom: '15px' }}>
      </div>

      <div className="view-mode-toggle">
        {isAdmin && (
          <div className="task-counters" style={{ marginBottom: '10px', paddingRight: '10px' }}>
            <span className="counter in-progress-counter" style={{ paddingRight: '10px' }}>
              <span title={searchBy.label}>
               <span className='name-title'>Tareas</span> 
              </span>
              <div className='counter-count'>
              <span>{filteredTasks.length}</span>
              </div>
            </span>
          </div>
        )}
        <div className="view-mode-buttons">
          <div className="search-container">
            <div className="search-options">
              <div className="listbox-container"> {/* Contenedor adicional */}
              <Listbox value={searchBy} onChange={setSearchBy}>
                  <Listbox.Button className="listbox-button">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {searchBy.icon}
                      {searchBy.label}
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="listbox-options" style={{ position: 'absolute', width: '100%' }} unmount={false}>
                    {searchOptions.map((option) => (
                      <Listbox.Option
                        key={option.value}
                        value={option}
                        className="listbox-option"
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', }}>
                          {option.icon}
                          {option.label}
                        </span>
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Listbox>
              </div>


              {searchBy.value === 'date' ? (
                <div className="date-range-picker">
                  <input
                    type="date"
                    value={dateRange.startDate || ''}
                    onChange={(e) => setDateRange(prev => ({
                      ...prev,
                      startDate: e.target.value
                    }))}
                    className="date-input"
                  />
                  <span className="date-separator">-</span>
                  <input
                    type="date"
                    value={dateRange.endDate || ''}
                    onChange={(e) => setDateRange(prev => ({
                      ...prev,
                      endDate: e.target.value
                    }))}
                    className="date-input"
                  />
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-inputt"
                />
              )}
            </div>
          </div>
          <button
            onClick={() => setViewMode('cards')}
            className={`view-toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
            title="Ver como tarjetas"
          >
            <i className="fa-solid fa-th-large"></i>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            title="Ver como tabla"
          >
            <i className="fa-solid fa-table"></i>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            title="Ver como lista"
          >
            <i className="fa-solid fa-list"></i>
          </button>
        </div>
      </div>

      <div className="task-section">
        <div className="task-table-container">
          {filteredTasks.length === 0 ? (
            <div className="no-data-message">
              <i className="fas fa-tasks"></i>
              <span>No hay tareas que coincidan con los criterios de búsqueda</span>
            </div>
          ) : viewMode === 'table' ? (
            <div className="table-responsive">
              <motion.table className="task-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('title')}>Nombre De Tarea</th>
                    <th>Observacion</th>
                    <th onClick={() => handleSort('assignedUser.name')}>Usuario encargado</th>
                    <th onClick={() => handleSort('company.name')}>Empresa Selecionada</th>
                    <th onClick={() => handleSort('area.nombre_area')}>Área Selecionada</th>
                    <th onClick={() => handleSort('createdAt')}>Fecha Creación</th>
                    <th onClick={() => handleSort('dueDate')}>Fecha Límite</th>
                    <th onClick={() => handleSort('status')}>Estado</th>
                    {isAdmin && <th>Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task, index) => (
                    <motion.tr
                      key={task.id}
                      onClick={() => handleRowClick(task.id)}
                      className={`${getRowClass(task.status)} ${expandedTask === task.id ? 'expanded' : ''}`}
                    >
                      <td>{task.title}</td>
                      <td className="task-observation">
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
                      </td>
                      <td>{task.assignedUser?.name}</td>
                      <td>{task.company?.name}</td>
                      <td>{task.Areas?.nombre_area}</td>
                      <td>{formatDate(task.createdAt)}</td>
                      <td>{formatDate(task.dueDate)}</td>
                      <td>
                        <select
                          className={getStatusClass(task.status)}
                          value={task.status}
                          onChange={(e) => {
                            e.stopPropagation();
                            onStatusChange(task.id, e.target.value);
                          }}
                        >
                          <option value="in_progress">En Progreso</option>
                          <option value="completed">Completada</option>
                        </select>
                      </td>
                      {isAdmin && (
                        <td className="actions">
                          <div className="action-buttons">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTask(task);
                              }}
                              className="detail-button"
                              title="Ver detalles"
                            >
                              <i className="fa-solid fa-eye"></i>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditTask(task);
                              }}
                              className="edit-button"
                              title="Editar tarea"
                            >
                              <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button
                              onClick={(e) => handleDeleteClick(e, task)}
                              className="delete-button"
                              title="Eliminar tarea"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </tbody>
              </motion.table>
            </div>
          ) : viewMode === 'list' ? (
            <div className="task-list-container">
              {filteredTasks.map((task, index) => (
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
                      <option value="in_progress">En Progreso</option>
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
                      <span>{task.assignedUser?.name}</span>
                    </div>
                    <div className="list-item-row">
                      <span className="label">Empresa:</span>
                      <span>{task.company?.name}</span>
                    </div>
                    <div className="list-item-row">
                      <span className="label">Área:</span>
                      <span>{task.Areas?.nombre_area}</span>
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
                        <i className="fa-solid fa-eye"></i>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTask(task);
                        }}
                        className="edit-button"
                        title="Editar tarea"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        onClick={(e) => handleDeleteClick(e, task)}
                        className="delete-button"
                        title="Eliminar tarea"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="task-list-container">
              {isAdmin && selectedTasks.size > 0 && (
                <div className="delete-selected-container">
                  <div className="selected-actions">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="status-selector"
                    >
                      <option value="">Seleccionar estado</option>
                      <option value="in_progress">En Progreso</option>
                      <option value="completed">Completada</option>
                    </select>
                    <button
                      onClick={() => handleChangeStatusSelected(selectedStatus)}
                      className="change-status-btn"
                      disabled={!selectedStatus}
                    >
                      Cambiar Estado
                    </button>
                  </div>
                </div>
              )}
              <table className="task-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="select-all-checkbox"
                      />
                    </th>
                    <th>Título</th>
                    <th>Estado</th>
                    <th>Observación</th>
                    <th>Usuario</th>
                    <th>Empresa</th>
                    <th>Área</th>
                    <th>Fecha Creación</th>
                    <th>Fecha Límite</th>
                    {isAdmin && <th>Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task, index) => (
                    <motion.tr
                      key={task.id}
                      className={`task-card ${getRowClass(task.status)} ${expandedTask === task.id ? 'expanded' : ''}`}
                      onClick={() => handleRowClick(task.id)}
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedTasks.has(task.id)}
                          onChange={() => handleSelectTask(task.id)}
                          className="task-checkbox"
                        />
                      </td>
                      <td>
                        <label>{task.title}</label>
                      </td>
                      <td>
                        <select
                          className={getStatusClass(task.status)}
                          value={task.status}
                          onChange={(e) => {
                            e.stopPropagation();
                            onStatusChange(task.id, e.target.value);
                          }}
                        >
                          <option value="in_progress">En Progreso</option>
                          <option value="completed">Completada</option>
                        </select>
                      </td>
                      <td>
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
                      </td>
                      <td>{task.assignedUser?.name}</td>
                      <td>{task.company?.name}</td>
                      <td>{task.Areas?.nombre_area}</td>
                      <td>{formatDate(task.createdAt)}</td>
                      <td>
                        {task.dueDate ? formatDate(task.dueDate) : '-'}
                      </td>
                      {isAdmin && (
                        <td>
                          <div className="task-list-actions">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTask(task);
                              }}
                              className="detail-button"
                              title="Ver detalles"
                            >
                              <i className="fa-solid fa-eye"></i>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditTask(task);
                              }}
                              className="edit-button"
                              title="Editar tarea"
                            >
                              <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button
                              onClick={(e) => handleDeleteClick(e, task)}
                              className="delete-button"
                              title="Eliminar tarea"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedTask && (
        <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
};

TaskTable.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      observation: PropTypes.string,
      assignedUser: PropTypes.shape({
        name: PropTypes.string
      }),
      company: PropTypes.shape({
        name: PropTypes.string
      }),
      Areas: PropTypes.shape({
        nombre_area: PropTypes.string
      }),
      createdAt: PropTypes.string,
      dueDate: PropTypes.string
    })
  ).isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  onEditTask: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired
};

export default TaskTable; 2