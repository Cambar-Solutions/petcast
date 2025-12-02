import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, FileText, Loader2, User } from 'lucide-react';
import { Button } from '@/shared/components';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { usePet, useMedicalRecordsByPet } from '@/shared/hooks';
import { useAuth } from '@/shared/context/AuthContext';

export default function DetalleMascota() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  // Cargar datos reales
  const { data: mascota, isLoading, error } = usePet(id);
  const { data: fichasMedicas = [] } = useMedicalRecordsByPet(id);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Ordenar fichas por fecha (más reciente primero)
  const fichasOrdenadas = [...fichasMedicas].sort((a, b) => new Date(b.fechaConsulta) - new Date(a.fechaConsulta));
  const ultimaFicha = fichasOrdenadas.length > 0 ? fichasOrdenadas[0] : null;

  // Estado de carga
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-petcast-orange" />
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
          <p className="text-petcast-text-light">Información de tu mascota</p>
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
            </div>
          </div>

          {/* Accordions */}
          <Accordion type="single" collapsible defaultValue="revision" className="space-y-3">
            {/* Accordion Revisión Médica */}
            <AccordionItem value="revision" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-semibold text-petcast-heading">Ultima revision medica</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4">
                {ultimaFicha ? (
                  <div className="space-y-3">
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
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Sin registros medicos</p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Accordion Historial Completo */}
            {fichasOrdenadas.length > 1 && (
              <AccordionItem value="historial" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-petcast-bg-soft rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-petcast-orange" />
                    </div>
                    <span className="text-sm font-semibold text-petcast-heading">Historial Medico</span>
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-petcast-bg-soft text-petcast-heading ml-2">
                      {fichasOrdenadas.length} registros
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4">
                  <div className="relative">
                    <div className="space-y-3 max-h-[250px] overflow-y-auto pb-4">
                      {fichasOrdenadas.map((ficha) => (
                        <div key={ficha.id} className="bg-white rounded-xl p-3 border border-gray-200">
                          <div className="flex items-center gap-2 text-xs text-petcast-text-light mb-2">
                            <Calendar className="w-3.5 h-3.5 text-petcast-orange" />
                            {new Date(ficha.fechaConsulta).toLocaleDateString('es-MX', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                          <p className="text-sm font-medium text-petcast-heading mb-1">{ficha.diagnostico}</p>
                          {ficha.tratamiento && (
                            <p className="text-xs text-petcast-text-light line-clamp-2">{ficha.tratamiento}</p>
                          )}
                        </div>
                      ))}
                    </div>
                    {fichasOrdenadas.length > 2 && (
                      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      ) : (
        /* Layout Desktop - columnas de igual altura */
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-stretch">

          {/* Columna izquierda - Info de mascota */}
          <div className="h-full">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-full">
              {/* Imagen y nombre */}
              <div className="flex flex-col items-center mb-5 pb-5 border-b border-petcast-bg-soft">
                <div className="w-28 h-28 bg-petcast-bg-soft rounded-2xl flex items-center justify-center mb-3 overflow-hidden">
                  <span className="text-5xl">
                    {mascota.especie === 'Perro' ? '🐕' : mascota.especie === 'Gato' ? '🐈' : '🐾'}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-petcast-heading">{mascota.nombre}</h2>
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
                  {mascota.sexo === 'MACHO' ? 'Macho' : mascota.sexo === 'HEMBRA' ? 'Hembra' : mascota.sexo || 'N/A'}
                </p>
              </div>

              {/* Color */}
              {mascota.color && (
                <div>
                  <p className="text-xs text-petcast-text-light uppercase tracking-wide mb-2">Color</p>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: mascota.color }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Columna derecha - Ficha médica */}
          <div className="flex flex-col gap-6 h-full">

            {/* Sección de última ficha médica */}
            <div className="flex-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 min-h-0">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-sm font-semibold text-petcast-heading">Ultima revision medica</h3>
              </div>

              {ultimaFicha ? (
                <div className="space-y-4">
                  {/* Fecha */}
                  <div className="flex items-center gap-2 text-sm text-petcast-text-light bg-blue-50 rounded-lg px-3 py-2 w-fit">
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
                  <p className="text-xs text-gray-400 mt-1">Aun no hay revisiones registradas</p>
                </div>
              )}
            </div>

            {/* Historial completo */}
            {fichasOrdenadas.length > 1 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-petcast-bg-soft rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-petcast-orange" />
                  </div>
                  <h3 className="text-sm font-semibold text-petcast-heading">Historial Medico</h3>
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-petcast-bg-soft text-petcast-heading ml-2">
                    {fichasOrdenadas.length} registros
                  </span>
                </div>

                {/* Contenedor con scroll y efecto difuminado */}
                <div className="relative">
                  <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 pb-4">
                    {fichasOrdenadas.map((ficha) => (
                      <div
                        key={ficha.id}
                        className="bg-white rounded-xl p-4 border border-gray-200"
                      >
                        <div className="flex items-center gap-2 text-sm text-petcast-text-light bg-white rounded-lg px-2 py-1 w-fit mb-2 shadow-sm">
                          <Calendar className="w-3.5 h-3.5 text-petcast-orange" />
                          {new Date(ficha.fechaConsulta).toLocaleDateString('es-MX', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                        <p className="text-sm font-medium text-petcast-heading mb-1">{ficha.diagnostico}</p>
                        {ficha.tratamiento && (
                          <p className="text-sm text-petcast-text-light mb-1">
                            <span className="font-medium text-petcast-orange">Tratamiento:</span> {ficha.tratamiento}
                          </p>
                        )}
                        {ficha.observaciones && (
                          <p className="text-xs text-petcast-text-light line-clamp-2">{ficha.observaciones}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  {/* Efecto difuminado en la parte inferior */}
                  {fichasOrdenadas.length > 2 && (
                    <div className="absolute bottom-0 left-0 right-2 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-xl" />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
