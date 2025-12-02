import { forwardRef } from 'react';

const Description = forwardRef(({
  children,
  mobileText,
  variant = 'default',
  className = '',
  ...props
}, ref) => {
  const variants = {
    default: 'text-base sm:text-lg text-gray-600',
    small: 'text-sm sm:text-base text-gray-600',
    large: 'text-lg sm:text-xl text-gray-600',
    xl: 'text-xl sm:text-2xl text-gray-600',
    // Variantes específicas para diferentes contextos
    'page-description': 'text-base sm:text-lg text-gray-600 leading-relaxed',
    'section-description': 'text-sm sm:text-base text-gray-600 leading-relaxed',
    'card-description': 'text-sm sm:text-base text-gray-600',
    'modal-description': 'text-sm sm:text-base text-gray-600 leading-relaxed',
    'sidebar-description': 'text-xs sm:text-sm text-gray-600',
    // Variantes para mobile más pequeñas
    'mobile-default': 'text-sm sm:text-base md:text-lg text-gray-600',
    'mobile-small': 'text-xs sm:text-sm md:text-base text-gray-600',
    'mobile-large': 'text-base sm:text-lg md:text-xl text-gray-600',
    'mobile-page-description': 'text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed',
    'mobile-section-description': 'text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed'
  };

  const baseClasses = '';

  return (
    <div
      ref={ref}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="hidden sm:inline">{children}</span>
      {mobileText && <span className="sm:hidden">{mobileText}</span>}
      {!mobileText && <span className="sm:hidden">{children}</span>}
    </div>
  );
});

Description.displayName = 'Description';

export default Description;
