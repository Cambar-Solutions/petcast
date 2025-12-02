import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, QrCode, Calendar, FileText, Download, Loader2, Pencil, User, Plus, History, ChevronRight, Copy, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button, Modal } from '@/shared/components';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/shared/components/ui/drawer';
import { MascotaForm, FichaMedicaForm } from '../components';
import { usePet, useDuenos, useMedicalRecordsByPet, useUpdatePet, useCreateMedicalRecord, useUpdateMedicalRecord } from '@/shared/hooks';

export default function MascotaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showQRModal, setShowQRModal] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isFichaFormOpen, setIsFichaFormOpen] = useState(false);
  const [selectedFicha, setSelectedFicha] = useState(null);
  const [showHistorial, setShowHistorial] = useState(false);
  const [copiado, setCopiado] = useState(false);

  // Cargar datos reales
  const { data: mascota, isLoading, error } = usePet(id);
  const { data: duenos = [] } = useDuenos();
  const { data: fichasMedicas = [] } = useMedicalRecordsByPet(id);
  const updatePet = useUpdatePet();
  const createMedicalRecord = useCreateMedicalRecord();
  const updateMedicalRecord = useUpdateMedicalRecord();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Obtener propietario
  const propietario = duenos.find(d => d.id === mascota?.duenoId);

  // Ordenar fichas por fecha (más reciente primero)
  const fichasOrdenadas = [...fichasMedicas].sort((a, b) => new Date(b.fechaConsulta) - new Date(a.fechaConsulta));
  const ultimaFicha = fichasOrdenadas.length > 0 ? fichasOrdenadas[0] : null;

  // URL para el QR (ruta pública)
  const qrUrl = `${window.location.origin}/mascota/${id}`;

  // Función para manejar la edición
  const handleSubmitEdit = async (formData) => {
    try {
      const petData = {
        nombre: formData.nombre,
        especie: formData.especie,
        raza: formData.raza || null,
        edad: parseInt(formData.edad) || 0,
        peso: formData.peso ? parseFloat(formData.peso) : null,
        sexo: formData.sexo === 'Macho' ? 'MACHO' : 'HEMBRA',
        color: formData.color || null,
      };

      // Solo incluir duenoId si está seleccionado
      if (formData.duenoId) {
        petData.duenoId = parseInt(formData.duenoId);
      }

      await updatePet.mutateAsync({ id: mascota.id, ...petData });
      setIsEditFormOpen(false);
    } catch (err) {
      console.error('Error al actualizar mascota:', err);
    }
  };

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

  // Función para copiar código
  const handleCopyCodigo = () => {
    if (mascota?.codigoQR) {
      navigator.clipboard.writeText(mascota.codigoQR);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  // Funciones para fichas médicas
  const handleOpenNewFicha = () => {
    setSelectedFicha(null);
    setIsFichaFormOpen(true);
  };

  const handleEditFicha = (ficha) => {
    setSelectedFicha(ficha);
    setIsFichaFormOpen(true);
  };

  const handleCloseFichaForm = () => {
    setIsFichaFormOpen(false);
    setSelectedFicha(null);
  };

  const handleSubmitFicha = async (formData) => {
    try {
      const fichaData = {
        diagnostico: formData.diagnostico,
        tratamiento: formData.tratamiento || null,
        observaciones: formData.observaciones || null,
        mascotaId: parseInt(id),
      };

      if (selectedFicha) {
        await updateMedicalRecord.mutateAsync({ id: selectedFicha.id, ...fichaData });
      } else {
        await createMedicalRecord.mutateAsync(fichaData);
      }
      handleCloseFichaForm();
    } catch (err) {
      console.error('Error al guardar ficha médica:', err);
    }
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
    <div className="space-y-6 pb-24 md:pb-0">
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

      {/* Layout Mobile con Accordions */}
      {isMobile ? (
        <div className="space-y-4">
          {/* Card compacta de mascota */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-petcast-bg-soft rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">
                  {mascota.especie === 'Perro' ? '🐕' : mascota.especie === 'Gato' ? '🐈' : '🐾'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-petcast-heading truncate">{mascota.nombre}</h2>
                  {mascota.color && (
                    <div
                      className="w-4 h-4 rounded-full shadow-sm flex-shrink-0"
                      style={{ backgroundColor: mascota.color }}
                    />
                  )}
                </div>
                <p className="text-sm text-petcast-text-light">
                  {mascota.especie} {mascota.raza ? `• ${mascota.raza}` : ''}
                </p>
                <div className="flex gap-3 mt-1 text-xs text-petcast-text-light">
                  <span>{mascota.edad ? `${mascota.edad} años` : ''}</span>
                  <span>{mascota.peso ? `${mascota.peso} kg` : ''}</span>
                  <span>{mascota.sexo === 'MACHO' ? 'Macho' : mascota.sexo === 'HEMBRA' ? 'Hembra' : ''}</span>
                </div>
              </div>
              <button
                onClick={() => setIsEditFormOpen(true)}
                className="p-1.5 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-lg flex-shrink-0 self-start"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Botón QR */}
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl"
              onClick={() => setShowQRModal(true)}
            >
              <QrCode className="w-4 h-4" />
              Ver código QR
            </Button>
          </div>

          {/* Accordions */}
          <Accordion type="single" collapsible className="space-y-3">
            {/* Accordion Revisión Médica */}
            <AccordionItem value="revision" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-semibold text-petcast-heading">Ultima revision medica</span>
                  {ultimaFicha && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700 ml-2">
                      {ultimaFicha.tipo || 'Consulta'}
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4">
                {ultimaFicha ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-petcast-text-light bg-blue-50 rounded-lg px-3 py-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span>
                          {new Date(ultimaFicha.fechaConsulta).toLocaleDateString('es-MX', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <button
                        onClick={() => handleEditFicha(ultimaFicha)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-lg"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {ultimaFicha.diagnostico && (
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Diagnostico</p>
                        <p className="text-sm text-petcast-heading">{ultimaFicha.diagnostico}</p>
                      </div>
                    )}

                    {ultimaFicha.tratamiento && (
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Tratamiento</p>
                        <p className="text-sm text-petcast-heading">{ultimaFicha.tratamiento}</p>
                      </div>
                    )}

                    {ultimaFicha.observaciones && (
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Observaciones</p>
                        <p className="text-sm text-petcast-heading">{ultimaFicha.observaciones}</p>
                      </div>
                    )}

                    {/* Botones de acción */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={handleOpenNewFicha}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Nueva ficha
                      </button>
                      {fichasOrdenadas.length > 1 && (
                        <button
                          onClick={() => setShowHistorial(true)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                        >
                          <History className="w-4 h-4" />
                          Historial ({fichasOrdenadas.length})
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 mb-3">Sin registros medicos</p>
                    <button
                      onClick={handleOpenNewFicha}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Crear primera ficha
                    </button>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Accordion Propietario */}
            <AccordionItem value="propietario" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-teal-600" />
                  </div>
                  <span className="text-sm font-semibold text-petcast-heading">Propietario</span>
                  {propietario && (
                    <span className="text-sm text-petcast-text-light ml-2">
                      {propietario.nombre}
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4">
                {propietario ? (
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-1">Nombre</p>
                      <p className="text-sm text-petcast-heading">{propietario.nombre} {propietario.apellido}</p>
                    </div>

                    {propietario.telefono && (
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-1">Telefono</p>
                        <p className="text-sm text-petcast-heading">{propietario.telefono}</p>
                      </div>
                    )}

                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-1">Correo</p>
                      <p className="text-sm text-petcast-heading">{propietario.correoElectronico}</p>
                    </div>

                    {propietario.direccion && (
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-1">Direccion</p>
                        <p className="text-sm text-petcast-heading">{propietario.direccion}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <User className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Sin propietario asignado</p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ) : (
        /* Layout Desktop */
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
                <div className="relative w-full flex justify-center items-center">
                  <h2 className="text-lg font-semibold text-petcast-heading">{mascota.nombre}</h2>
                  {/* Botón editar alineado con el nombre */}
                  <div className="absolute right-0">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setIsEditFormOpen(true)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer bg-gray-100"
                          aria-label="Editar mascota"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Editar</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                {mascota.codigoQR && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <p className="text-xs text-petcast-text-light truncate max-w-[120px]" title={mascota.codigoQR}>
                      {mascota.codigoQR}
                    </p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={handleCopyCodigo}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        >
                          {copiado ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{copiado ? 'Copiado!' : 'Copiar codigo'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
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
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-petcast-heading flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  Ultima revision medica
                </h3>
                <div className="flex items-center gap-2">
                  {fichasOrdenadas.length > 1 && (
                    <button
                      onClick={() => setShowHistorial(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <History className="w-3.5 h-3.5" />
                      Historial ({fichasOrdenadas.length})
                    </button>
                  )}
                  <button
                    onClick={handleOpenNewFicha}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Nueva ficha
                  </button>
                </div>
              </div>

              {ultimaFicha ? (
                <div className="space-y-4">
                  {/* Fecha y editar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-petcast-text-light bg-blue-50 rounded-lg px-3 py-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span>
                        {new Date(ultimaFicha.fechaConsulta).toLocaleDateString('es-MX', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleEditFicha(ultimaFicha)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Editar ficha</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Grid de información */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ultimaFicha.diagnostico && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">Diagnostico</p>
                        <p className="text-sm text-petcast-heading">{ultimaFicha.diagnostico}</p>
                      </div>
                    )}

                    {ultimaFicha.tratamiento && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">Tratamiento</p>
                        <p className="text-sm text-petcast-heading">{ultimaFicha.tratamiento}</p>
                      </div>
                    )}
                  </div>

                  {ultimaFicha.observaciones && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">Observaciones</p>
                      <p className="text-sm text-petcast-heading leading-relaxed">{ultimaFicha.observaciones}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">Sin registros medicos</p>
                  <p className="text-xs text-gray-400 mt-1 mb-4">Aun no hay revisiones registradas</p>
                  <button
                    onClick={handleOpenNewFicha}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Crear primera ficha
                  </button>
                </div>
              )}
            </div>

            {/* Sección de Propietario */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-teal-600" />
                </div>
                <h3 className="text-sm font-semibold text-petcast-heading">Propietario</h3>
              </div>

              {propietario ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-2">Nombre</p>
                    <p className="text-sm text-petcast-heading">{propietario.nombre} {propietario.apellido}</p>
                  </div>

                  {propietario.telefono && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-2">Telefono</p>
                      <p className="text-sm text-petcast-heading">{propietario.telefono}</p>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-2">Correo</p>
                    <p className="text-sm text-petcast-heading">{propietario.correoElectronico}</p>
                  </div>

                  {propietario.direccion && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-2">Direccion</p>
                      <p className="text-sm text-petcast-heading">{propietario.direccion}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-sm text-petcast-text-light">Sin propietario asignado</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal/Drawer QR */}
      {isMobile ? (
        <Drawer open={showQRModal} onOpenChange={setShowQRModal}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-blue-600" />
                Código QR
              </DrawerTitle>
            </DrawerHeader>
            <div className="flex flex-col items-center px-4 pb-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200 mb-4">
                <QRCodeSVG
                  id="qr-code-svg"
                  value={qrUrl}
                  size={180}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="text-sm text-petcast-text-light text-center mb-4">
                Escanea este código para ver la información de <strong>{mascota.nombre}</strong>
              </p>
            </div>
            <DrawerFooter>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={downloadQR}
              >
                <Download className="w-4 h-4" />
                Descargar
              </Button>
              <Button
                variant="primary"
                className="w-full"
                onClick={() => {
                  navigator.clipboard.writeText(qrUrl);
                  setShowQRModal(false);
                }}
              >
                Copiar enlace
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Modal open={showQRModal} onClose={() => setShowQRModal(false)} size="sm">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3 w-full mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <QrCode className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-petcast-heading">Código QR</h3>
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
      )}

      {/* Form Modal/Drawer para editar mascota */}
      <MascotaForm
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        onSubmit={handleSubmitEdit}
        mascota={mascota}
        isMobile={isMobile}
        duenos={duenos.map(d => ({
          id: d.id,
          name: `${d.nombre} ${d.apellido}`.trim(),
          email: d.correoElectronico,
        }))}
        isLoading={updatePet.isPending}
      />

      {/* Form Modal/Drawer para ficha médica */}
      <FichaMedicaForm
        isOpen={isFichaFormOpen}
        onClose={handleCloseFichaForm}
        onSubmit={handleSubmitFicha}
        ficha={selectedFicha}
        isMobile={isMobile}
        isLoading={createMedicalRecord.isPending || updateMedicalRecord.isPending}
        mascotaNombre={mascota?.nombre}
      />

      {/* Modal/Drawer de historial de fichas */}
      {isMobile ? (
        <Drawer open={showHistorial} onOpenChange={setShowHistorial}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-blue-600" />
                Historial Medico
              </DrawerTitle>
              <p className="text-sm text-petcast-text-light">{fichasOrdenadas.length} registros</p>
            </DrawerHeader>
            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3 max-h-[60vh]">
              {fichasOrdenadas.map((ficha) => (
                <div
                  key={ficha.id}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs text-petcast-text-light">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      {new Date(ficha.fechaConsulta).toLocaleDateString('es-MX', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                    <button
                      onClick={() => {
                        setShowHistorial(false);
                        handleEditFicha(ficha);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-sm font-medium text-petcast-heading mb-1">{ficha.diagnostico}</p>
                  {ficha.tratamiento && (
                    <p className="text-xs text-petcast-text-light line-clamp-2">{ficha.tratamiento}</p>
                  )}
                </div>
              ))}
            </div>
            <DrawerFooter>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setShowHistorial(false)}
              >
                Cerrar
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Modal open={showHistorial} onClose={() => setShowHistorial(false)} size="md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <History className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-petcast-heading">Historial Medico</h3>
              <p className="text-sm text-petcast-text-light">{fichasOrdenadas.length} registros de {mascota?.nombre}</p>
            </div>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {fichasOrdenadas.map((ficha) => (
              <div
                key={ficha.id}
                className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm text-petcast-text-light bg-blue-50 rounded-lg px-2 py-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    {new Date(ficha.fechaConsulta).toLocaleDateString('es-MX', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          setShowHistorial(false);
                          handleEditFicha(ficha);
                        }}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Editar ficha</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-sm font-medium text-petcast-heading mb-1">{ficha.diagnostico}</p>
                {ficha.tratamiento && (
                  <p className="text-sm text-petcast-text-light mb-1">
                    <span className="font-medium text-blue-600">Tratamiento:</span> {ficha.tratamiento}
                  </p>
                )}
                {ficha.observaciones && (
                  <p className="text-xs text-petcast-text-light line-clamp-2">{ficha.observaciones}</p>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setShowHistorial(false)}>
              Cerrar
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
