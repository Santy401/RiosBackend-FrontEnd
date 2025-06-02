import { useState } from 'react';
import PropTypes from 'prop-types';
import './styles/TaskTable.css';
import TaskDetailModal from '../components/TaskDetailModal.jsx';
import { useAuth } from '../context/authContext.jsx';
import { motion } from "framer-motion";

const TaskTable = ({ tasks, onDeleteTask, onEditTask, onStatusChange }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedTask, setSelectedTask] = useState(null);
  const [expandedTask, setExpandedTask] = useState(null);
  const [viewMode, setViewMode] = useState('cards');
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectTask = (taskId) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
    setSelectAll(false); // Reset select all when individual selection changes
  };

  const handleSelectAll = () => {
    const newSelected = new Set();
    if (selectAll) {
      // Deselect all
      setSelectedTasks(new Set());
    } else {
      // Select all
      tasks.forEach(task => newSelected.add(task.id));
      setSelectedTasks(newSelected);
    }
    setSelectAll(!selectAll);
  };

  const handleDeleteSelected = () => {
    if (selectedTasks.size === 0) return;

    if (window.confirm('¿Estás seguro de que deseas eliminar las tareas seleccionadas?')) {
      selectedTasks.forEach(taskId => onDeleteTask(taskId));
      setSelectedTasks(new Set());
      setSelectAll(false);
    }
  }; // 'cards', 'table', or 'list'

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesSearch = !searchQuery ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const activeTasksCount = Array.isArray(filteredTasks)
    ? filteredTasks.filter((task) => task.status === 'in_progress').length
    : 0;

  const completedTasksCount = Array.isArray(filteredTasks)
    ? filteredTasks.filter((task) => task.status === 'completed').length
    : 0;

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return dateString;
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

  const sortedTasks = [...tasks].sort((a, b) => {
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
      {/* Filtros y buscador */}
      <div className="filters-container" style={{ marginBottom: '15px' }}>
        <div className="status-filter">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="status-select"
          >
            <option value="all">TODAS LAS TAREAS</option>
            <option value="in_progress">EN PROCESO</option>
            <option value="completed">TERMINADAS</option>
          </select>
        </div>
        <div className="search-container" style={{ marginLeft: '10px' }}>
          <input
            type="text"
            placeholder="Buscar tareas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* View mode toggle */}
      <div className="view-mode-toggle">
        {/* Contadores de tareas */}
        {isAdmin && (
          <div className="task-counters" style={{ marginBottom: '10px', paddingRight: '10px' }}>
            <span className="counter in-progress-counter" style={{ paddingRight: '10px' }}>
              {activeTasksCount}
            </span>
            <span className="counter completed-counter">{completedTasksCount}</span>
          </div>
        )}
        <div className="view-mode-buttons">
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
          {tasks.length === 0 ? (
            <div
              className="no-data-message"
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '20px',
                alignItems: 'center',
              }}
            >
              <i
                className="fas fa-tasks"
                style={{
                  marginRight: '10px',
                  fontSize: '20px',
                  color: '#6c757d',
                }}
              ></i>
              <span>No hay tareas registradas</span>
            </div>
          ) : viewMode === 'table' ? (
            <div className="table-responsive">
              <motion.table
                className="task-table"
                initial={{ opacity: 0, X: 30, scale: .6 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
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
                  {sortedTasks.map((task, index) => (
                    <motion.tr
                      key={task.id}
                      initial={{ opacity: 0, x: -20, scale: .7 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
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
              {sortedTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20, scale: .7 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
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
              <div className="task-list-header">
                <div className="task-list-cell">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="select-all-checkbox"
                  />
                </div>
                <div className="task-list-cell">Título</div>
                <div className="task-list-cell">Estado</div>
                <div className="task-list-cell">Observación</div>
                <div className="task-list-cell">Usuario</div>
                <div className="task-list-cell">Empresa</div>
                <div className="task-list-cell">Área</div>
                <div className="task-list-cell">Fecha Creación</div>
                <div className="task-list-cell">Fecha Límite</div>
                {isAdmin && <div className="task-list-cell">Acciones</div>}
              </div>
              {sortedTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20, scale: .7 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`task-card ${getRowClass(task.status)} ${expandedTask === task.id ? 'expanded' : ''}`}
                  onClick={() => handleRowClick(task.id)}
                >
                  <div className="task-list-row">
                    <div className="task-list-cell">
                      <input
                        type="checkbox"
                        checked={selectedTasks.has(task.id)}
                        onChange={() => handleSelectTask(task.id)}
                        className="task-checkbox"
                      />
                    </div>
                    <div className="task-list-cell">
                      <label>{task.title}</label>
                    </div>
                    <div className="task-list-cell">
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
                    <div className="task-list-cell">
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
                    <div className="task-list-cell">{task.assignedUser?.name}</div>
                    <div className="task-list-cell">{task.company?.name}</div>
                    <div className="task-list-cell">{task.Areas?.nombre_area}</div>
                    <div className="task-list-cell">{formatDate(task.createdAt)}</div>
                    <div className="task-list-cell">{formatDate(task.dueDate)}</div>
                    {isAdmin && (
                      <div className="task-list-cell">
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
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isAdmin && selectedTasks.size > 0 && (
                <div className="delete-selected-container">
                  <button
                    onClick={handleDeleteSelected}
                    className="delete-selected-btn"
                  >
                    Eliminar {selectedTasks.size} seleccionadas
                  </button>
                </div>
              )}
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

export default TaskTable;