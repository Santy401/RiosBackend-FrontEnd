import PropTypes from 'prop-types';

const TaskFilters = ({
  filterStatus,
  setFilterStatus,
}) => {
  return (
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
    </div>
  );
};

TaskFilters.propTypes = {
  filterStatus: PropTypes.string.isRequired,
  setFilterStatus: PropTypes.func.isRequired,
  searchBy: PropTypes.string.isRequired,
  setSearchBy: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  dateRange: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string
  }).isRequired,
  setDateRange: PropTypes.func.isRequired
};

export default TaskFilters;
