import PropTypes from 'prop-types';
import './TaskActionsBar.css';
import { useState } from 'react';
import { motion } from 'framer-motion';

const TaskActionsBar = ({
  selectedTasksCount,
  onChangeStatusSelected,
  // isAdmin // Prop can be re-added if specific logic inside TaskActionsBar needs it
}) => {
  const [statusToChange, setStatusToChange] = useState('');



  const handleChangeStatusClick = () => {
    if (selectedTasksCount === 0 || !statusToChange) return;
    if (window.confirm('¿Estás seguro de que deseas cambiar el estado de las tareas seleccionadas?')) {
      onChangeStatusSelected(statusToChange);
      setStatusToChange(''); // Reset local dropdown
    }
  };

  if (selectedTasksCount === 0) {
    return null; // Don't render anything if no tasks are selected
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="task-actions-bar"
    >
      <span className="task-count-label">
        {selectedTasksCount} tarea(s) seleccionada(s)
      </span>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="task-actions-group"
        style={{ marginLeft: 'auto' }}
      >
        <select
          value={statusToChange}
          onChange={(e) => setStatusToChange(e.target.value)}
          className="task-status-select"
        >
          <option value="">Cambiar Estado...</option>
          <option value="in_progress">En Progreso</option>
          <option value="completed">Completada</option>
        </select>
        <button
          onClick={handleChangeStatusClick}
          disabled={!statusToChange}
          className="task-actions-button apply-button"
        >
          Aplicar
        </button>
      </motion.div>
    </motion.div>
  );
};

TaskActionsBar.propTypes = {
  selectedTasksCount: PropTypes.number.isRequired,
  onChangeStatusSelected: PropTypes.func.isRequired,
  // isAdmin: PropTypes.bool 
};

export default TaskActionsBar;