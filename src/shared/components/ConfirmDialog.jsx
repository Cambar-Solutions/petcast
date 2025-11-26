import { useState } from 'react';
import Button from './Button';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmar accion',
  message = 'Estas seguro de que quieres realizar esta accion?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger', // 'danger', 'warning', 'info'
  icon = <AlertTriangle className="w-6 h-6" />
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Error en confirmacion:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          iconColor: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          buttonVariant: 'danger'
        };
      case 'warning':
        return {
          iconColor: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          buttonVariant: 'warning'
        };
      case 'info':
        return {
          iconColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          buttonVariant: 'primary'
        };
      default:
        return {
          iconColor: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          buttonVariant: 'secondary'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Modal open={isOpen} onClose={onClose} size="sm">
      <div className="text-center">
        {/* Icono */}
        <div className={`mx-auto flex items-center justify-center w-12 h-12 rounded-full ${styles.bgColor} ${styles.borderColor} border mb-4`}>
          <div className={styles.iconColor}>
            {icon}
          </div>
        </div>

        {/* Titulo */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>

        {/* Mensaje */}
        <p className="text-sm text-gray-600 mb-6">
          {message}
        </p>

        {/* Botones */}
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isSubmitting}
          >
            {cancelText}
          </Button>
          <Button
            variant={styles.buttonVariant}
            onClick={handleConfirm}
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Procesando...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
