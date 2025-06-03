import PropTypes from 'prop-types';

const TaskActions = ({
  isAdmin,
  selectedTasks,
  selectedStatus,
  setSelectedStatus
}) => {


  return (
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
      </div>
    </div>
  );
};

TaskActions.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  selectedTasks: PropTypes.instanceOf(Set).isRequired,
  selectedStatus: PropTypes.string.isRequired,
  setSelectedStatus: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired
};

export default TaskActions;
