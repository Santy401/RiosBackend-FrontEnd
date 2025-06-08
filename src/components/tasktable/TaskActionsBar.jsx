import PropTypes from 'prop-types';
import "./styles/TaskActionsBar.css";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Listbox } from '@headlessui/react';
import ConfirmModal from '../common/ConfirmModal';

const TaskActionsBar = ({
  selectedTasksCount,
  onChangeStatusSelected,
  // isAdmin // Prop can be re-added if specific logic inside TaskActionsBar needs it
}) => {
  const [statusToChange, setStatusToChange] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);



  const handleChangeStatusClick = () => {
    if (selectedTasksCount === 0 || !statusToChange) return;
    setShowConfirmModal(true);
  };

  const handleConfirmChange = async () => {
    setIsSubmitting(true);
    try {
      await onChangeStatusSelected(statusToChange);
      setStatusToChange(''); // Reset local dropdown
    } finally {
      setIsSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  if (selectedTasksCount === 0) {
    return null; // Don't render anything if no tasks are selected
  }

  return (
    <>
      <AnimatePresence>
        {showConfirmModal && (
          <ConfirmModal
            message={`¿Estás seguro de que deseas cambiar el estado de ${selectedTasksCount} tarea(s) seleccionada(s)?`}
            onConfirm={handleConfirmChange}
            isLoading={isSubmitting}
            onCancel={() => setShowConfirmModal(false)}
          />
        )}
      </AnimatePresence>
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
        <Listbox value={statusToChange} onChange={setStatusToChange}>
          <Listbox.Button className="task-status-select">
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {statusToChange === 'in_progress' ? 'En Progreso' : statusToChange === 'completed' ? 'Completada' : 'Cambiar Estado...'}
            </span>
          </Listbox.Button>
          <Listbox.Options className="listbox-options" style={{ position: 'absolute' }} unmount={false}>
            <Listbox.Option value="" className="listbox-option">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Cambiar Estado...
              </span>
            </Listbox.Option>
            <Listbox.Option value="in_progress" className="listbox-option">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                En Progreso
              </span>
            </Listbox.Option>
            <Listbox.Option value="completed" className="listbox-option">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Completada
              </span>
            </Listbox.Option>
          </Listbox.Options>
        </Listbox>
        <button
          onClick={handleChangeStatusClick}
          disabled={!statusToChange}
          className="task-actions-button apply-button"
        >
          {isSubmitting ? 'Cambiando...' : 'Aplicar'}
        </button>
      </motion.div>
    </motion.div>
    </>
  );
};

TaskActionsBar.propTypes = {
  selectedTasksCount: PropTypes.number.isRequired,
  onChangeStatusSelected: PropTypes.func.isRequired,
  // isAdmin: PropTypes.bool 
};

export default TaskActionsBar;