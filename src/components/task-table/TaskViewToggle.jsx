import PropTypes from 'prop-types';

const TaskViewToggle = ({
  isAdmin,
  activeTasksCount,
  completedTasksCount,
  viewMode,
  setViewMode,
  searchBy,
  setSearchBy,
  dateRange,
  setDateRange,
  searchQuery,
  setSearchQuery
}) => {
  return (
    <div className="view-mode-toggle">
      {isAdmin && (
        <div className="task-counters" style={{ marginBottom: '10px', paddingRight: '10px' }}>
          <span className="counter in-progress-counter" style={{ paddingRight: '10px' }}>
            {activeTasksCount}
          </span>
          <span className="counter completed-counter">{completedTasksCount}</span>
        </div>
      )}
      <div className="view-mode-buttons">
        <div className="search-container">
          <div className="search-options">
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              className="search-select"
            >
              <option value="all">Buscar en todos los campos</option>
              <option value="user">Por usuario asignado</option>
              <option value="company">Por empresa</option>
              <option value="area">Por área</option>
              <option value="date">Por fecha</option>
            </select>
            
            {searchBy === 'date' ? (
              <div className="date-range-picker">
                <input
                  type="date"
                  value={dateRange.startDate || ''}
                  onChange={(e) => setDateRange(prev => ({
                    ...prev,
                    startDate: e.target.value
                  }))}
                  className="date-input"
                />
                <span className="date-separator">-</span>
                <input
                  type="date"
                  value={dateRange.endDate || ''}
                  onChange={(e) => setDateRange(prev => ({
                    ...prev,
                    endDate: e.target.value
                  }))}
                  className="date-input"
                />
              </div>
            ) : (
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            )}
          </div>
        </div>
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
  );
};

TaskViewToggle.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  activeTasksCount: PropTypes.number.isRequired,
  completedTasksCount: PropTypes.number.isRequired,
  viewMode: PropTypes.string.isRequired,
  setViewMode: PropTypes.func.isRequired,
  searchBy: PropTypes.string.isRequired,
  setSearchBy: PropTypes.func.isRequired,
  dateRange: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string
  }).isRequired,
  setDateRange: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired
};

export default TaskViewToggle;
