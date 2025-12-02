import { forwardRef } from 'react';

const Title = forwardRef(({
  children,
  variant = 'h1',
  className = '',
  ...props
}, ref) => {
  const variants = {
    h1: 'text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight',
    h2: 'text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight',
    h3: 'text-lg sm:text-xl md:text-2xl font-semibold',
    h4: 'text-base sm:text-lg md:text-xl font-medium',
    h5: 'text-sm sm:text-base md:text-lg font-medium',
    h6: 'text-xs sm:text-sm md:text-base font-medium',
    // Variantes específicas para diferentes contextos
    'page-title': 'text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-petcast-heading',
    'section-title': 'text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-petcast-heading',
    'card-title': 'text-lg sm:text-xl md:text-2xl font-semibold text-petcast-heading',
    'modal-title': 'text-lg sm:text-xl font-semibold text-petcast-heading',
    'sidebar-title': 'text-base sm:text-lg font-medium text-petcast-heading',
    // Variantes específicas para mobile más pequeñas
    'mobile-h1': 'text-xl sm:text-2xl md:text-3xl font-bold tracking-tight',
    'mobile-h2': 'text-lg sm:text-xl md:text-2xl font-semibold tracking-tight',
    'mobile-h3': 'text-base sm:text-lg md:text-xl font-semibold',
    'mobile-page-title': 'text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-petcast-heading',
    'mobile-section-title': 'text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-petcast-heading',
    'mobile-card-title': 'text-base sm:text-lg md:text-xl font-semibold text-petcast-heading'
  };

  const baseClasses = '';

  return (
    <div
      ref={ref}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Title.displayName = 'Title';

export default Title;
