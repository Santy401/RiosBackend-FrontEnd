import { useState } from 'react';
import PropTypes from 'prop-types';
import './styles/TaskTable.css';
import TaskDetailModal from '../components/TaskDetailModal.jsx';
import { useAuth } from '../context/authContext.jsx';

const TaskTable = ({ tasks, onDeleteTask, onEditTask, onStatusChange }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedTask, setSelectedTask] = useState(null);
  const [expandedTask, setExpandedTask] = useState(null);

  // Contadores de tareas
  const activeTasksCount = tasks.filter((task) => task.status === 'in_progress').length;
  const completedTasksCount = tasks.filter((task) => task.status === 'completed').length;

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
      {/* Contadores de tareas */}
      <div className="task-counters" style={{ marginBottom: '10px', paddingRight: '10px' }}>
        <span className="counter in-progress-counter" style={{ paddingRight: '10px' }}>
          {activeTasksCount}
        </span>
        <span className="counter completed-counter">{completedTasksCount}</span>
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
          ) : (
            <div className="table-responsive">
              <table className="task-table">
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
                  {sortedTasks.map((task) => (
                    <tr
                      key={task.id}
                      onClick={() => handleRowClick(task.id)}
                      className={`${getRowClass(task.status)} ${
                        expandedTask === task.id ? 'expanded' : ''
                      }`}
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
                      <td>{task.area?.nombre_area}</td>
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
                    </tr>
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
      assignedUser: PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
      }),
      company: PropTypes.shape({
        name: PropTypes.string,
      }),
      area: PropTypes.shape({
        nombre_area: PropTypes.string,
        departamento: PropTypes.string,
      }),
      status: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      dueDate: PropTypes.string.isRequired,
    })
  ).isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  onEditTask: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
};

export default TaskTable;
