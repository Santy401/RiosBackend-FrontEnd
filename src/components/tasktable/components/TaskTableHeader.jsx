import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const TaskTableHeader = ({
  sortConfig,
  handleSort,
  isAdmin,
  selectedTasks,
  selectedTasksCount,
  handleSelectAll,
  handleDeleteSelected,
  handleChangeStatusSelected,
  viewMode,
}) => {
  const headers = [
    { key: 'title', title: 'Nombre De Tarea' },
    { key: 'assignedUser.name', title: 'Usuario encargado' },
    { key: 'company.name', title: 'Empresa Selecionada' },
    { key: 'area.nombre_area', title: 'Área Selecionada' },
    { key: 'createdAt', title: 'Fecha Creación' },
    { key: 'dueDate', title: 'Fecha Límite' },
    { key: 'status', title: 'Estado' },
  ];

  return (
    <motion.tr>
      {viewMode === 'cards' && (
        <th>
          <input
            type="checkbox"
            checked={selectedTasks.size > 0}
            onChange={() => handleSelectAll()}
            className="select-all-checkbox"
          />
        </th>
      )}
      {headers.map((header) => (
        <th
          key={header.key}
          onClick={() => handleSort(header.key)}
          className="cursor-pointer hover:text-blue-500"
        >
          {header.title}
        </th>
      ))}
      {isAdmin && <th>Acciones</th>}
    </motion.tr>
  );
};

TaskTableHeader.propTypes = {
  sortConfig: PropTypes.object.isRequired,
  handleSort: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  selectedTasks: PropTypes.instanceOf(Set).isRequired,
  selectedTasksCount: PropTypes.number.isRequired,
  handleSelectAll: PropTypes.func.isRequired,
  handleDeleteSelected: PropTypes.func.isRequired,
  handleChangeStatusSelected: PropTypes.func.isRequired,
  viewMode: PropTypes.string.isRequired,
};

export default TaskTableHeader;
