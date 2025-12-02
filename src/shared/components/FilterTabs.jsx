import { forwardRef } from 'react';

const FilterTabs = forwardRef(({
  filters = [],
  selectedFilter,
  onFilterChange,
  className = ''
}, ref) => {
  if (!filters || filters.length === 0) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={`flex gap-2 overflow-x-auto pt-3 pb-2 px-1 scrollbar-none ${className}`}
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer
            focus:outline-none
            ${selectedFilter === filter.id
              ? 'bg-blue-900 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 active:bg-gray-300'
            }`}
        >
          {filter.icon && <span className="mr-2">{filter.icon}</span>}
          {filter.label || filter.name}
        </button>
      ))}
    </div>
  );
});

FilterTabs.displayName = 'FilterTabs';

export default FilterTabs;
