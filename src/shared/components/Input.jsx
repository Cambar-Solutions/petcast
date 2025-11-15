/**
 * Componente Input reutilizable
 * Soporta diferentes tipos y validaciones
 */

export default function Input({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  icon,
  className = '',
  ...props
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500">{icon}</span>
          </div>
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            w-full px-4 py-2.5 rounded-lg border
            ${icon ? 'pl-10' : ''}
            ${error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            focus:outline-none focus:ring-2
            transition-colors duration-200
          `}
          {...props}
        />
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
