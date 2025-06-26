import PropTypes from 'prop-types';
import "../styles/TaskActionsBar.css";
import { motion } from 'framer-motion';
import DontTasks from '../../../assets/svg/DontTasks.svg';

const TaskEmptyState = ({ tasks, searchQuery }) => {
  const hasTasks = tasks.length > 0;
  const hasSearch = searchQuery && searchQuery.trim() !== '';

  const getMessage = () => {
    if (!hasTasks) {
      return (
        <>
          <img src={DontTasks} alt="No Tasks" className='DontTasks'/>
        </>
      );
    }
    if (hasSearch) {
      return (
        <>
          <img src={DontTasks} alt="No Tasks" className='DontTasks'/>
          <span>Tarea No Encontrada</span>
        </>
      );
    }
    return (
      <>
        <img src={DontTasks} alt="No Tasks" className='DontTasks'/>
        <span>No hay tareas que coincidan con los criterios de búsqueda</span>
      </>
    );
  };

  return (
    <motion.div 
      className="no-data-messagee"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {getMessage()}
    </motion.div>
  );
};

TaskEmptyState.propTypes = {
  tasks: PropTypes.array.isRequired,
  searchQuery: PropTypes.string,
};

export default TaskEmptyState;
