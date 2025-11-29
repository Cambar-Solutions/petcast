import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, QrCode, Calendar, FileText, Download, X, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button, Modal } from '@/shared/components';
import { usePet, useDuenos, useMedicalRecordsByPet } from '@/shared/hooks';

export default function MascotaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showQRModal, setShowQRModal] = useState(false);

  // Cargar datos reales
  const { data: mascota, isLoading, error } = usePet(id);
  const { data: duenos = [] } = useDuenos();
  const { data: fichasMedicas = [] } = useMedicalRecordsByPet(id);

  // Obtener propietario
  const propietario = duenos.find(d => d.id === mascota?.duenoId);

  // Obtener última ficha médica
  const ultimaFicha = fichasMedicas.length > 0
    ? fichasMedicas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0]
    : null;

  // URL para el QR (ruta pública)
  const qrUrl = `${window.location.origin}/mascota/${id}`;

  // Función para descargar QR como imagen
  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `QR-${mascota?.nombre || 'mascota'}-${id}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  // Estado de carga
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Estado de error
  if (error || !mascota) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error al cargar la mascota</p>
        <Button variant="outline" onClick={() => navigate(-1)} className="mt-4">
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl text-petcast-text hover:bg-petcast-bg-soft transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-petcast-heading">Detalle de Mascota</h1>
          <p className="text-petcast-text-light">Información completa del paciente</p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Columna izquierda - Info de mascota */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            {/* Imagen y nombre */}
            <div className="flex flex-col items-center mb-5 pb-5 border-b border-petcast-bg-soft">
              <div className="w-28 h-28 bg-petcast-bg-soft rounded-2xl flex items-center justify-center mb-3 overflow-hidden">
                <span className="text-5xl">
                  {mascota.especie === 'Perro' ? '🐕' : mascota.especie === 'Gato' ? '🐈' : '🐾'}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-petcast-heading">{mascota.nombre}</h2>
              {mascota.codigoQR && (
                <p className="text-xs text-petcast-text-light mt-1">{mascota.codigoQR}</p>
              )}
            </div>

            {/* Especie */}
            <div className="mb-4 pb-4 border-b border-petcast-bg-soft">
              <p className="text-xs text-petcast-text-light uppercase tracking-wide mb-1">Especie</p>
              <p className="font-medium text-petcast-heading">{mascota.especie}</p>
            </div>

            {/* Raza */}
            {mascota.raza && (
              <div className="mb-4 pb-4 border-b border-petcast-bg-soft">
                <p className="text-xs text-petcast-text-light uppercase tracking-wide mb-1">Raza</p>
                <p className="font-medium text-petcast-heading">{mascota.raza}</p>
              </div>
            )}

            {/* Edad y Peso */}
            <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-petcast-bg-soft">
              <div>
                <p className="text-xs text-petcast-text-light uppercase tracking-wide mb-1">Edad</p>
                <p className="font-medium text-petcast-heading">
                  {mascota.edad ? `${mascota.edad} años` : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-petcast-text-light uppercase tracking-wide mb-1">Peso</p>
                <p className="font-medium text-petcast-heading">
                  {mascota.peso ? `${mascota.peso} kg` : 'N/A'}
                </p>
              </div>
            </div>

            {/* Sexo */}
            <div className="mb-4 pb-4 border-b border-petcast-bg-soft">
              <p className="text-xs text-petcast-text-light uppercase tracking-wide mb-1">Sexo</p>
              <p className="font-medium text-petcast-heading">
                {mascota.sexo === 'MACHO' ? 'Macho' : mascota.sexo === 'HEMBRA' ? 'Hembra' : mascota.sexo}
              </p>
            </div>

            {/* Color */}
            {mascota.color && (
              <div className="mb-5 pb-5 border-b border-petcast-bg-soft">
                <p className="text-xs text-petcast-text-light uppercase tracking-wide mb-2">Color</p>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: mascota.color }}
                  />
                </div>
              </div>
            )}

            {/* Botón QR */}
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 rounded-xl"
              onClick={() => setShowQRModal(true)}
            >
              <QrCode className="w-4 h-4" />
              Ver código QR
            </Button>
          </div>
        </div>

        {/* Columna derecha - Notas y Propietario */}
        <div className="flex-1 flex flex-col gap-6">

          {/* Sección de última ficha médica */}
          <div className="flex-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-petcast-heading mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Última revisión médica
            </h3>

            {ultimaFicha ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-petcast-text-light">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {new Date(ultimaFicha.fecha).toLocaleDateString('es-MX', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-petcast-heading">
                    {ultimaFicha.tipo || 'Consulta'}
                  </span>
                </div>

                {ultimaFicha.diagnostico && (
                  <div className="mb-3">
                    <p className="text-xs text-petcast-text-light uppercase tracking-wide mb-1">Diagnóstico</p>
                    <p className="text-sm text-petcast-text">{ultimaFicha.diagnostico}</p>
                  </div>
                )}

                {ultimaFicha.tratamiento && (
                  <div className="mb-3">
                    <p className="text-xs text-petcast-text-light uppercase tracking-wide mb-1">Tratamiento</p>
                    <p className="text-sm text-petcast-text">{ultimaFicha.tratamiento}</p>
                  </div>
                )}

                {ultimaFicha.observaciones && (
                  <div>
                    <p className="text-xs text-petcast-text-light uppercase tracking-wide mb-1">Observaciones</p>
                    <p className="text-sm text-petcast-text leading-relaxed">{ultimaFicha.observaciones}</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-petcast-text-light">No hay registros médicos disponibles</p>
            )}
          </div>

          {/* Sección de Propietario */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-petcast-heading mb-4">Propietario</h3>

            {propietario ? (
              <div className="space-y-3">
                <div className="flex">
                  <span className="w-24 text-sm text-petcast-text-light flex-shrink-0">Nombre:</span>
                  <span className="text-sm text-petcast-heading">
                    {propietario.nombre} {propietario.apellido}
                  </span>
                </div>
                {propietario.telefono && (
                  <div className="flex">
                    <span className="w-24 text-sm text-petcast-text-light flex-shrink-0">Teléfono:</span>
                    <span className="text-sm text-petcast-heading">{propietario.telefono}</span>
                  </div>
                )}
                <div className="flex">
                  <span className="w-24 text-sm text-petcast-text-light flex-shrink-0">Correo:</span>
                  <span className="text-sm text-petcast-heading">{propietario.correoElectronico}</span>
                </div>
                {propietario.direccion && (
                  <div className="flex">
                    <span className="w-24 text-sm text-petcast-text-light flex-shrink-0">Dirección:</span>
                    <span className="text-sm text-petcast-heading">{propietario.direccion}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-petcast-text-light">Sin propietario asignado</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal QR */}
      <Modal open={showQRModal} onClose={() => setShowQRModal(false)} size="sm">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-4">
            <h3 className="text-lg font-semibold text-petcast-heading">Código QR</h3>
            <button
              onClick={() => setShowQRModal(false)}
              className="p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 mb-4">
            <QRCodeSVG
              id="qr-code-svg"
              value={qrUrl}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>

          <p className="text-sm text-petcast-text-light text-center mb-4">
            Escanea este código para ver la información de <strong>{mascota.nombre}</strong>
          </p>

          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2"
              onClick={downloadQR}
            >
              <Download className="w-4 h-4" />
              Descargar
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
                navigator.clipboard.writeText(qrUrl);
                setShowQRModal(false);
              }}
            >
              Copiar enlace
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
