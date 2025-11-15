/**
 * Componente Card reutilizable
 * Contenedor con estilos predefinidos
 */

export default function Card({
  children,
  className = '',
  padding = 'md',
  ...props
}) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`
        bg-white rounded-xl shadow-lg
        ${paddings[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
