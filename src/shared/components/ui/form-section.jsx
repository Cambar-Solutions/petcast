import { cn } from '@/lib/utils';

/**
 * AWS-inspired FormSection component
 * Creates clean, sectioned card-based layouts
 */
const FormSection = ({
  title,
  description,
  children,
  className,
  headerAction,
  icon: Icon
}) => {
  return (
    <div className={cn("bg-white rounded-lg border border-gray-200 shadow-sm", className)}>
      {/* Header */}
      {(title || description || headerAction) && (
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {title && (
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="w-5 h-5 text-gray-700" />}
                  <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                </div>
              )}
              {description && (
                <p className="mt-1 text-sm text-gray-600">{description}</p>
              )}
            </div>
            {headerAction && (
              <div className="ml-4 flex-shrink-0">
                {headerAction}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-6 py-6">
        {children}
      </div>
    </div>
  );
};

/**
 * FormSection.Row - Horizontal field layout
 */
FormSection.Row = ({ children, className }) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", className)}>
      {children}
    </div>
  );
};

/**
 * FormSection.Group - Vertical field group with spacing
 */
FormSection.Group = ({ children, className, separator = false }) => {
  return (
    <div className={cn("space-y-6", separator && "pb-6 border-b border-gray-200", className)}>
      {children}
    </div>
  );
};

/**
 * FormSection.SubSection - Nested sub-section within a form section
 */
FormSection.SubSection = ({ title, description, children, className }) => {
  return (
    <div className={cn("space-y-4", className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
          )}
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      )}
      <div>
        {children}
      </div>
    </div>
  );
};

export default FormSection;
