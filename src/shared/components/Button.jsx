/**
 * Componente Button reutilizable
 * Ejemplo de componente compartido en shared/components/
 */

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  ...props
}) {
  const baseStyles = 'font-semibold rounded-lg transition-colors duration-200';

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? disabledStyles : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
