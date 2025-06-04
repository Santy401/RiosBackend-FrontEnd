import PropTypes from 'prop-types';
import { useState } from 'react';
import { Listbox } from '@headlessui/react';
import { Search, User, Building2, Layout, Calendar } from 'lucide-react';

const searchOptions = [
  { value: 'all', icon: <Search size={16} color="#888" />, title: 'Buscar en todo' },
  { value: 'user', icon: <User size={16} color="#3b82f6" />, title: 'Usuario' },
  { value: 'company', icon: <Building2 size={16} color="#8b5cf6" />, title: 'Empresa' },
  { value: 'area', icon: <Layout size={16} color="#10b981" />, title: 'Área' },
  { value: 'date', icon: <Calendar size={16} color="#ef4444" />, title: 'Fecha' },
];

const TaskFilterControls = ({
  filterStatus,
  setFilterStatus,
  searchBy,
  setSearchBy,
  searchQuery,
  setSearchQuery,
  dateRange,
  setDateRange,
}) => {
  const matchesField = (field, query) => {
    if (!query) return true;
    const queryLower = query.toLowerCase();
    return field?.toLowerCase().includes(queryLower);
  };

  const matchesDateRange = (task) => {
    if (!dateRange.startDate && !dateRange.endDate) return true;

    const taskDate = new Date(task.createdAt);

    if (dateRange.startDate) {
      const startDate = new Date(dateRange.startDate);
      if (taskDate < startDate) return false;
    }

    if (dateRange.endDate) {
      const endDate = new Date(dateRange.endDate);
      if (taskDate > endDate) return false;
    }

    return true;
  };

  return (
    <div className="search-container">
      <div className="search-options">
        <div className="listbox-container">
          <Listbox value={searchBy} onChange={setSearchBy}>
            <Listbox.Button className="listbox-button">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {searchBy.icon}
                {searchBy.ºtitle}
              </span>
            </Listbox.Button>
            <Listbox.Options className="listbox-options" style={{ position: 'absolute', width: '100%' }} unmount={false}>
              {searchOptions.map((option) => (
                <Listbox.Option
                  key={option.value}
                  value={option}
                  className="listbox-option"
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {option.icon}
                    {option.label}
                  </span>
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
        </div>

        {searchBy.value === 'date' ? (
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
            className="search-inputt"
            style={{ width: '100%', marginRight: '1rem' }}
          />
        )}
      </div>
    </div>
  );
};

TaskFilterControls.propTypes = {
  filterStatus: PropTypes.string,
  setFilterStatus: PropTypes.func,
  searchBy: PropTypes.object,
  setSearchBy: PropTypes.func,
  searchQuery: PropTypes.string,
  setSearchQuery: PropTypes.func,
  dateRange: PropTypes.object,
  setDateRange: PropTypes.func,
};

export default TaskFilterControls;
