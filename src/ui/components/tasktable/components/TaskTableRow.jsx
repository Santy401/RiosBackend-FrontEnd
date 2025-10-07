import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Checkbox } from '@headlessui/react';

const TaskTableRow = ({
  task,
  selectedTasks,
  handleSelectTask,
  expandedTask,
  handleRowClick,
  onStatusChange,
  isAdmin,
  onDeleteTask,
  onEditTask,
  formatDate,
  getStatusClass,
  getRowClass,
  viewMode,
}) => {
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (!task || !task.id) {
      console.error('Intento de eliminar tarea inválida:', task);
      return;
    }
    onDeleteTask(task);
  };

  return (
    <motion.tr
      key={task.id}
      onClick={() => handleRowClick(task.id)}
      className={`${getRowClass(task.status)} ${expandedTask === task.id ? 'expanded' : ''}`}
    >
      {viewMode === 'cards' && (
        <td>
          <Checkbox
            checked={selectedTasks.has(task.id)}
            onChange={() => handleSelectTask(task.id)}
            className="task-checkbox"
          >
            <svg viewBox="0 0 14 14" fill="none">
              <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Checkbox>
        </td>
      )}
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
          <div className="observation-expanded"></div>
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
          <option value="in_progress">En Proceso</option>
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
  );
};

TaskTableRow.propTypes = {
  task: PropTypes.object.isRequired,
  selectedTasks: PropTypes.instanceOf(Set).isRequired,
  handleSelectTask: PropTypes.func.isRequired,
  expandedTask: PropTypes.string,
  handleRowClick: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  onEditTask: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
  getStatusClass: PropTypes.func.isRequired,
  getRowClass: PropTypes.func.isRequired,
  viewMode: PropTypes.string.isRequired,
};

export default TaskTableRow;
