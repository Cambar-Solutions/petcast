import { forwardRef } from 'react';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary: 'bg-transparent border-2 border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white focus:ring-blue-500',
    secondary: 'bg-petcast-bg-soft hover:bg-petcast-bg text-petcast-heading focus:ring-petcast-primary',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    outline: 'border-2 border-petcast-heading text-petcast-heading hover:bg-petcast-bg-soft focus:ring-petcast-primary',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    warning: 'bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500',
    // Variante circular que se convierte en normal en desktop
    circular: 'bg-blue-900 text-white hover:bg-blue-800 focus:ring-blue-500 shadow-sm hover:shadow-md rounded-full w-12 h-12 p-0 sm:rounded-lg sm:w-auto sm:h-auto sm:px-4 sm:py-2.5',
  };

  const sizes = {
    xs: 'px-2 py-1.5 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-lg',
    // Responsive sizes - más pequeños en mobile
    'sm-mobile': 'px-2 py-1.5 text-xs sm:px-3 sm:py-2 sm:text-sm',
    'md-mobile': 'px-3 py-2 text-sm sm:px-4 sm:py-2.5 sm:text-base',
    'lg-mobile': 'px-4 py-2.5 text-sm sm:px-6 sm:py-3 sm:text-lg',
    'xl-mobile': 'px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg'
  };

  return (
    <button
      ref={ref}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
