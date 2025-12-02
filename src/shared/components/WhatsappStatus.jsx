import { useState } from 'react';
import { MessageCircle, Wifi, WifiOff, QrCode, RefreshCw, LogOut } from 'lucide-react';
import { useWhatsappStatus, useWhatsappQR, useForceWhatsappLogout } from '@/shared/hooks';
import Card from './Card';
import Button from './Button';

/**
 * Componente para mostrar el estado de conexión de WhatsApp
 * y el código QR para conectar
 */
export default function WhatsappStatus() {
  const [showQR, setShowQR] = useState(false);
  const { data: status, isLoading, refetch } = useWhatsappStatus();
  const { data: qrData } = useWhatsappQR({ enabled: showQR });
  const forceLogout = useForceWhatsappLogout();

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

  const handleForceLogout = () => {
    if (window.confirm('¿Estás seguro de cerrar la sesión de WhatsApp? Tendrás que escanear un nuevo código QR.')) {
      forceLogout.mutate();
    }
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
        <p className="text-sm text-gray-600 mb-4">
          WhatsApp está conectado y listo para enviar mensajes.
        </p>
      )}

      {status?.status === 'qr_required' && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Escanea el código QR con WhatsApp para conectar.
          </p>
          {!showQR ? (
            <Button onClick={() => setShowQR(true)} variant="outline" size="sm">
              <QrCode className="w-4 h-4 mr-2" />
              Mostrar QR
            </Button>
          ) : qrData?.qrCode ? (
            <div className="bg-white p-4 rounded-lg border inline-block">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData.qrCode)}`}
                alt="Código QR de WhatsApp"
                className="w-48 h-48"
              />
            </div>
          ) : (
            <p className="text-sm text-gray-500">Generando código QR...</p>
          )}
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={() => refetch()}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>

        {status?.status === 'connected' && (
          <Button
            onClick={handleForceLogout}
            variant="danger"
            size="sm"
            disabled={forceLogout.isPending}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar sesión
          </Button>
        )}
      </div>
    </Card>
  );
}
