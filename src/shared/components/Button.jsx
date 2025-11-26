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
    primary: 'bg-petcast-heading hover:bg-petcast-text text-white',
    secondary: 'bg-petcast-bg-soft hover:bg-petcast-bg text-petcast-heading',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    outline: 'border-2 border-petcast-heading text-petcast-heading hover:bg-petcast-bg-soft',
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
