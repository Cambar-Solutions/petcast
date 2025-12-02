import { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const SearchBar = ({
  placeholder = "Buscar...",
  value,
  onChange,
  className = "",
  debounceMs = 300,
  showIcon = true,
  showClearButton = true
}) => {
  const [localValue, setLocalValue] = useState(value || '');

  // Debounced onChange callback
  const debouncedOnChange = useCallback(
    debounceMs > 0 ? debounce(onChange, debounceMs) : onChange,
    [onChange, debounceMs]
  );

  // Update local value when external value changes
  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  const handleInputChange = (newValue) => {
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="flex-1 relative">
      {showIcon && (
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      )}
      <input
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => handleInputChange(e.target.value)}
        className={`w-full bg-white ${showIcon ? 'pl-10' : 'pl-4'} ${showClearButton && localValue ? 'pr-10' : 'pr-4'} py-3 rounded-xl text-base border-gray-200 border shadow-sm transition-all duration-200 focus:outline-none focus:shadow-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 ${className}`}
      />
      {showClearButton && localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          type="button"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
