import { useEffect, useRef, useState } from 'react';

export default function Toolbar({ filters, onFiltersChange, onNewTask }) {
  const [searchValue, setSearchValue] = useState(filters.search);
  const debounceRef = useRef(null);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onFiltersChange({ ...filters, search: searchValue });
    }, 300);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  return (
    <div className="toolbar">
      <input
        type="text"
        className="search-input"
        placeholder="Search tasks…"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <select
        className="select"
        value={filters.priority}
        onChange={(e) => onFiltersChange({ ...filters, priority: e.target.value })}
      >
        <option value="">All priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <select
        className="select"
        value={filters.sort}
        onChange={(e) => onFiltersChange({ ...filters, sort: e.target.value })}
      >
        <option value="created">Newest first</option>
        <option value="due_date">Due date</option>
        <option value="priority">Priority</option>
      </select>
      <button type="button" className="btn btn-primary" onClick={onNewTask}>
        + New task
      </button>
    </div>
  );
}
