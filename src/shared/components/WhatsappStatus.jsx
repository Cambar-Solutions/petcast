import { useState } from 'react';
import { MessageCircle, Wifi, WifiOff, QrCode, LogOut } from 'lucide-react';
import { useWhatsappStatus, useWhatsappQR, useForceWhatsappLogout } from '@/shared/hooks';
import Card from './Card';
import Button from './Button';
import ConfirmDialog from './ConfirmDialog';

/**
 * Componente para mostrar el estado de conexión de WhatsApp
 * y el código QR para conectar
 */
export default function WhatsappStatus() {
  const { data: status } = useWhatsappStatus();
  const { data: qrData } = useWhatsappQR({ enabled: status?.status === 'qr_required' });
  const forceLogout = useForceWhatsappLogout();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const getStatusColor = () => {
    if (!status) return 'text-gray-400';
    switch (status.status) {
      case 'connected':
        return 'text-green-500';
      case 'connecting':
        return 'text-yellow-500';
      case 'qr_required':
        return 'text-blue-500';
      default:
        return 'text-red-500';
    }
  };

  const getStatusText = () => {
    if (!status) return 'Cargando...';
    switch (status.status) {
      case 'connected':
        return 'Conectado';
      case 'connecting':
        return 'Conectando...';
      case 'qr_required':
        return 'Escanea el QR';
      default:
        return 'Desconectado';
    }
  };

  const getStatusIcon = () => {
    if (!status) return <WifiOff className="w-5 h-5" />;
    switch (status.status) {
      case 'connected':
        return <Wifi className="w-5 h-5" />;
      case 'qr_required':
        return <QrCode className="w-5 h-5" />;
      default:
        return <WifiOff className="w-5 h-5" />;
    }
  };

  const handleForceLogout = async () => {
    await forceLogout.mutateAsync();
    setShowLogoutConfirm(false);
  };

  return (
    <Card className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold text-petcast-heading">WhatsApp</h3>
        </div>
        <div className={`flex items-center gap-2 ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="font-medium">{getStatusText()}</span>
        </div>
      </div>

      {status?.status === 'connected' && (
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Wifi className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-sm text-petcast-heading font-medium mb-2">
            WhatsApp conectado correctamente
          </p>
          <p className="text-sm text-petcast-text-light mb-4 max-w-xs">
            Los recordatorios de citas se enviaran automaticamente a los propietarios de las mascotas.
          </p>
          <div className="bg-blue-50 rounded-xl p-4 w-full mb-4">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">
              Funciones disponibles
            </p>
            <ul className="text-sm text-petcast-text-light space-y-1 text-left">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Recordatorios de citas programadas
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Notificaciones de confirmacion
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Avisos de seguimiento medico
              </li>
            </ul>
          </div>
        </div>
      )}

      {status?.status === 'qr_required' && (
        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-600 mb-3 text-center">
            Escanea el codigo QR con WhatsApp para conectar.
          </p>
          {qrData?.qrCode ? (
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData.qrCode)}`}
                alt="Codigo QR de WhatsApp"
                className="w-48 h-48"
              />
            </div>
          ) : (
            <p className="text-sm text-gray-500">Generando codigo QR...</p>
          )}
        </div>
      )}

      {status?.status === 'connected' && (
        <div className="flex justify-center pt-4 border-t border-gray-100">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesion de WhatsApp
          </button>
        </div>
      )}

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleForceLogout}
        title="Cerrar sesion de WhatsApp"
        message="Al cerrar sesion tendras que escanear un nuevo codigo QR para volver a conectar. Los recordatorios no se enviaran hasta que vuelvas a conectar."
        confirmText="Cerrar sesion"
        cancelText="Cancelar"
        variant="warning"
        icon={<LogOut className="w-6 h-6" />}
      />
    </Card>
  );
}
