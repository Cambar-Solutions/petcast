import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const sizeVariants = {
  sm: 'max-w-sm w-full',
  md: 'max-w-md w-full',
  lg: 'max-w-lg w-full',
  xl: 'max-w-xl w-full',
  '2xl': 'max-w-2xl w-full',
  full: 'max-w-4xl w-full',
};

const Modal = ({ open, onClose, children, size = 'md', className = '' }) => {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`
          relative z-10 ${sizeVariants[size]} mx-auto
          bg-white rounded-3xl shadow-xl p-6
          transform transition-all max-h-[90vh] overflow-y-auto
          ${className}
        `}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
