import PropTypes from 'prop-types';
import { motion } from "framer-motion";

const TaskTable = ({
  tasks,
  viewMode,
  selectedTasks,
  setSelectedTasks,
  selectAll,
  setSelectAll,
  expandedTask,
  setExpandedTask,
  onStatusChange,
  onDeleteTask,
  onEditTask,
  isAdmin,
  selectedStatus,
  setSelectedStatus
}) => {
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
      tasks.forEach(task => newSelected.add(task.id));
      setSelectedTasks(newSelected);
    }
    setSelectAll(!selectAll);
  };

  const getRowClass = (status) => {
    return status === 'completed' ? 'completed-task' : '';
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      in_progress: 'status-in-progress',
      completed: 'status-completed',
    };
    return `status-badge ${statusClasses[status] || ''}`;
  };

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

  return (
    <div className="task-section">
      <div className="task-table-container">
        {tasks.length === 0 ? (
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
                {tasks.map((task, index) => (
                  <motion.tr
                    key={task.id}
                    onClick={() => setExpandedTask(task.id)}
                    className={`${getRowClass(task.status)} ${expandedTask === task.id ? 'expanded' : ''}`}
                  >
                    <td>{task.title}</td>
                    <td className="task-observation">
                      <div
                        className="observation-content"
                        title={task.observation}
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedTask(task.id);
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
                              setExpandedTask(task.id);
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
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
                                console.log('Intentando eliminar tarea con ID:', task.id);
                                try {
                                  onDeleteTask(task.id);
                                  console.log('onDeleteTask llamado exitosamente');
                                } catch (error) {
                                  console.error('Error al eliminar tarea:', error);
                                }
                              }
                            }}
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
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                className={`task-list-item ${getRowClass(task.status)} ${expandedTask === task.id ? 'expanded' : ''}`}
                onClick={() => setExpandedTask(task.id)}
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
                          setExpandedTask(task.id);
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
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
                          onDeleteTask(task.id).then(() => {
                            toast.success('Tarea eliminada exitosamente');
                          }).catch((error) => {
                            console.error('Error al eliminar tarea:', error);
                            toast.error('Error al eliminar la tarea. Por favor, inténtalo de nuevo.');
                          });
                        }
                      }}
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
                    onClick={() => {
                      if (selectedStatus) {
                        if (window.confirm('¿Estás seguro de que deseas cambiar el estado de las tareas seleccionadas?')) {
                          const taskIds = Array.from(selectedTasks);
                          Promise.all(taskIds.map(taskId => onStatusChange(taskId, selectedStatus)))
                            .then(() => {
                              setSelectedTasks(new Set());
                              setSelectedStatus('');
                            })
                            .catch(error => {
                              console.error('Error al actualizar estado de tareas:', error);
                            });
                        }
                      }
                    }}
                    className="change-status-btn"
                    disabled={!selectedStatus}
                  >
                    Cambiar Estado
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('¿Estás seguro de que deseas eliminar las tareas seleccionadas?')) {
                        const taskIds = Array.from(selectedTasks);
                        Promise.all(taskIds.map(taskId => onDeleteTask(taskId)))
                          .then(() => {
                            setSelectedTasks(new Set());
                            setSelectedStatus('');
                          })
                          .catch(error => {
                            console.error('Error al eliminar tareas:', error);
                          });
                      }
                    }}
                    className="delete-selected-btn"
                  >
                    Eliminar {selectedTasks.size} seleccionadas
                  </button>
                </div>
              </div>
            )}
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
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                className={`task-card ${getRowClass(task.status)} ${expandedTask === task.id ? 'expanded' : ''}`}
                onClick={() => setExpandedTask(task.id)}
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
                          setExpandedTask(task.id);
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
                            setExpandedTask(task.id);
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
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
                              onDeleteTask(task.id);
                              console.error('Error al eliminar tarea:', error);
                            }
                          }}
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
          </div>
        )}
      </div>
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
  viewMode: PropTypes.string.isRequired,
  selectedTasks: PropTypes.instanceOf(Set).isRequired,
  setSelectedTasks: PropTypes.func.isRequired,
  selectAll: PropTypes.bool.isRequired,
  setSelectAll: PropTypes.func.isRequired,
  expandedTask: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.null
  ]),
  setExpandedTask: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  onEditTask: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  selectedStatus: PropTypes.string,
  setSelectedStatus: PropTypes.func
};

export default TaskTable;
