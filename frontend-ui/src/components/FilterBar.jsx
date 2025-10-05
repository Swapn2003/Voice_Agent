import React, { useState } from 'react';

// Use UI image: filter-bar.png for filter bar layout
// Based on the filter bar with dropdown options and view toggle
const FilterBar = ({ filters, setFilters, onExport, onAssign, onBatchActions }) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const caseTypes = ['MCC', 'BRAM', 'GRIP', 'MATCH'];
  const statuses = ['NEW', 'OPEN', 'PENDING', 'ASSESSMENT', 'HOLD', 'CLOSED'];

  return (
    <div className="filter-bar">
      <div className="filter-left">
        <div className="filter-dropdown">
          <button 
            className="filter-button"
            onClick={() => setShowFilters(!showFilters)}
          >
            Filter <span className="dropdown-arrow">▼</span>
          </button>
          {showFilters && (
            <div className="filter-panel">
              <div className="filter-row">
                <label>Status:</label>
                <select 
                  value={filters.status || ''} 
                  onChange={(e) => handleFilterChange('status', e.target.value || null)}
                >
                  <option value="">All Statuses</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className="filter-row">
                <label>Type:</label>
                <select 
                  value={filters.type || ''} 
                  onChange={(e) => handleFilterChange('type', e.target.value || null)}
                >
                  <option value="">All Types</option>
                  {caseTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="filter-row">
                <label>Owner:</label>
                <input 
                  type="text"
                  placeholder="Filter by owner..."
                  value={filters.owner || ''}
                  onChange={(e) => handleFilterChange('owner', e.target.value || null)}
                />
              </div>
              <div className="filter-row">
                <label>Bank:</label>
                <input 
                  type="text"
                  placeholder="Filter by bank..."
                  value={filters.bank || ''}
                  onChange={(e) => handleFilterChange('bank', e.target.value || null)}
                />
              </div>
              <div className="filter-row">
                <label>Date From:</label>
                <input 
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value || null)}
                />
              </div>
              <div className="filter-row">
                <label>Date To:</label>
                <input 
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value || null)}
                />
              </div>
              <div className="filter-actions">
                <button onClick={clearFilters} className="clear-filters-btn">
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="action-dropdowns">
          <button className="action-button">Columns <span className="dropdown-arrow">▼</span></button>
          <button className="action-button" onClick={onExport}>Export <span className="dropdown-arrow">▼</span></button>
          <button className="action-button" onClick={onAssign}>Assign <span className="dropdown-arrow">▼</span></button>
          <button className="action-button" onClick={onBatchActions}>Batch Actions <span className="dropdown-arrow">▼</span></button>
          <button className="action-button">Custom Views <span className="dropdown-arrow">▼</span></button>
        </div>

        <div className="select-all">
          <input type="checkbox" id="select-all" />
          <label htmlFor="select-all">Select All</label>
        </div>
      </div>

      <div className="filter-right">
        <div className="view-toggle">
          <span className="view-label">Current View:</span>
          <div className="toggle-switch">
            <button className={`toggle-btn ${filters.view === 'customer' ? 'active' : ''}`}>
              Customer
            </button>
            <button className={`toggle-btn ${filters.view === 'merchant' ? 'active' : ''}`}>
              Merchant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;



