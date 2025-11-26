import { cn } from '@/lib/utils';
import InfoTooltip from './info-tooltip';

/**
 * AWS-inspired FormField component
 * Provides consistent field styling with labels, help text, and error states
 */
const FormField = ({
  label,
  description,
  helpText,
  error,
  required = false,
  children,
  className,
  labelClassName,
  orientation = 'vertical' // 'vertical' or 'horizontal'
}) => {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div className={cn("space-y-2", isHorizontal && "flex items-start gap-4", className)}>
      {/* Label and Description */}
      {(label || description) && (
        <div className={cn("space-y-1", isHorizontal && "flex-1")}>
          {label && (
            <label className={cn(
              "flex items-center gap-2 text-sm font-medium text-gray-800",
              labelClassName
            )}>
              {label}
              {required && <span className="text-red-500">*</span>}
              {helpText && <InfoTooltip content={helpText} />}
            </label>
          )}
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      )}

      {/* Field Content */}
      <div className={cn(isHorizontal && "flex-1")}>
        {children}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

/**
 * FormField.Input - Styled input field
 */
FormField.Input = ({ className, error, ...props }) => {
  return (
    <input
      className={cn(
        "w-full px-4 py-2.5 text-sm",
        "border border-gray-300 rounded-lg",
        "focus:ring-2 focus:ring-orange-500 focus:border-transparent",
        "transition-all duration-200",
        "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
        error && "border-red-500 focus:ring-red-500",
        className
      )}
      {...props}
    />
  );
};

/**
 * FormField.Textarea - Styled textarea field
 */
FormField.Textarea = ({ className, error, ...props }) => {
  return (
    <textarea
      className={cn(
        "w-full px-4 py-2.5 text-sm",
        "border border-gray-300 rounded-lg",
        "focus:ring-2 focus:ring-orange-500 focus:border-transparent",
        "transition-all duration-200",
        "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
        "resize-none",
        error && "border-red-500 focus:ring-red-500",
        className
      )}
      {...props}
    />
  );
};

/**
 * FormField.Select - Styled select field
 */
FormField.Select = ({ className, error, children, ...props }) => {
  return (
    <select
      className={cn(
        "w-full px-4 py-2.5 text-sm",
        "border border-gray-300 rounded-lg",
        "focus:ring-2 focus:ring-orange-500 focus:border-transparent",
        "transition-all duration-200",
        "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
        "bg-white",
        error && "border-red-500 focus:ring-red-500",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
};

export default FormField;
