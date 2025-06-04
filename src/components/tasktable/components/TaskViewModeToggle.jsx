import PropTypes from 'prop-types';

const TaskViewModeToggle = ({ viewMode, setViewMode }) => {
  const viewModeButtons = [
    { mode: 'cards', icon: 'fa-th-large', title: 'Ver como tarjetas' },
    { mode: 'list', icon: 'fa-list', title: 'Ver como lista' },
  ];

  return (
    <div className="view-mode-buttons">
      {viewModeButtons.map(({ mode, icon, title }) => (
        <button
          key={mode}
          onClick={() => setViewMode(mode)}
          className={`view-toggle-btn ${viewMode === mode ? 'active' : ''}`}
          title={title}
        >
          <i className={`fa-solid ${icon}`} />
        </button>
      ))}
    </div>
  );
};

TaskViewModeToggle.propTypes = {
  viewMode: PropTypes.string.isRequired,
  setViewMode: PropTypes.func.isRequired,
};

export default TaskViewModeToggle;
