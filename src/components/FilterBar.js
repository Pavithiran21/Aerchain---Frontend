import React from 'react';
import { Search, Filter } from 'lucide-react';
import './FilterBar.css';

const FilterBar = ({ filters, onFiltersChange }) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleDateFilterChange = (value) => {
    onFiltersChange({
      ...filters,
      dueDate: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({ status: '', priority: '', search: '', dueDate: '' });
  };

  const hasActiveFilters = filters.status || filters.priority || filters.search || filters.dueDate;

  return (
    <div className="filter-bar">
      <div className="filter-controls">
        <div className="search-group">
          <div className="search-input-wrapper">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-group">
          <Filter size={16} />
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="filter-select"
          >
            <option value="">All Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>

          <input
            type="text"
            placeholder="Due Date"
            value={filters.dueDate || ''}
            onChange={(e) => handleDateFilterChange(e.target.value)}
            onFocus={(e) => { e.target.type = 'date'; }}
            onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
            className="filter-select date-filter"
          />

          {hasActiveFilters && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;