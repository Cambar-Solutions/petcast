import { useParams } from 'react-router-dom';
import { Phone, Mail, MapPin, Loader2, PawPrint, User, Calendar, FileText, Stethoscope, Pill, ClipboardList, Weight, Palette } from 'lucide-react';
import { usePet, useDuenos, useMedicalRecordsByPet } from '@/shared/hooks';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';

export default function MascotaPublica() {
  const { id } = useParams();

  // Cargar datos
  const { data: mascota, isLoading, error } = usePet(id);
  const { data: duenos = [] } = useDuenos();
  const { data: fichasMedicas = [] } = useMedicalRecordsByPet(id);

  // Obtener propietario
  const propietario = duenos.find(d => d.id === mascota?.duenoId);

  // Ordenar fichas por fecha (más reciente primero)
  const fichasOrdenadas = [...fichasMedicas].sort((a, b) => new Date(b.fechaConsulta) - new Date(a.fechaConsulta));

  // Estado de carga
  if (isLoading) {
    return (
      <div className="min-h-screen bg-petcast-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-petcast-main" />
          <p className="text-sm text-petcast-text-light">Cargando informacion...</p>
        </div>
      </div>
    );
  }

  // Estado de error o no encontrado
  if (error || !mascota) {
    return (
      <div className="min-h-screen bg-petcast-bg flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <PawPrint className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-xl font-semibold text-petcast-heading mb-2">Mascota no encontrada</h1>
          <p className="text-sm text-petcast-text-light">
            El codigo QR no corresponde a ninguna mascota registrada.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-petcast-bg py-6 px-4">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <div className="text-center mb-2">
          <p className="text-xs text-petcast-text-light uppercase tracking-wider">Identificacion de Mascota</p>
        </div>

        {/* Card principal - Info de mascota */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header con info básica */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-petcast-bg-soft rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-4xl">
                  {mascota.especie === 'Perro' ? '🐕' : mascota.especie === 'Gato' ? '🐈' : '🐾'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-petcast-heading truncate">{mascota.nombre}</h1>
                  {mascota.color && (
                    <div
                      className="w-4 h-4 rounded-full shadow-sm flex-shrink-0 border border-white"
                      style={{ backgroundColor: mascota.color }}
                    />
                  )}
                </div>
                <p className="text-sm text-petcast-text-light">
                  {mascota.especie} {mascota.raza ? `• ${mascota.raza}` : ''}
                </p>
                {mascota.codigoQR && (
                  <p className="text-xs text-petcast-text-light mt-1 font-mono">{mascota.codigoQR}</p>
                )}
              </div>
            </div>
          </div>

          {/* Info rápida */}
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            <div className="p-3 text-center">
              <p className="text-lg font-semibold text-petcast-heading">
                {mascota.edad || '-'}
              </p>
              <p className="text-xs text-petcast-text-light">años</p>
            </div>
            <div className="p-3 text-center">
              <p className="text-lg font-semibold text-petcast-heading">
                {mascota.peso || '-'}
              </p>
              <p className="text-xs text-petcast-text-light">kg</p>
            </div>
            <div className="p-3 text-center">
              <p className="text-lg font-semibold text-petcast-heading">
                {mascota.sexo === 'MACHO' ? '♂' : mascota.sexo === 'HEMBRA' ? '♀' : '-'}
              </p>
              <p className="text-xs text-petcast-text-light">
                {mascota.sexo === 'MACHO' ? 'Macho' : mascota.sexo === 'HEMBRA' ? 'Hembra' : 'Sexo'}
              </p>
            </div>
          </div>
        </div>

        {/* Acordeones */}
        <Accordion type="single" collapsible defaultValue="propietario" className="space-y-3">
          {/* Acordeon Propietario */}
          <AccordionItem value="propietario" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-teal-50 rounded-xl flex items-center justify-center">
                  <User className="w-4 h-4 text-teal-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-petcast-heading">Propietario</p>
                  {propietario && (
                    <p className="text-xs text-petcast-text-light">{propietario.nombre} {propietario.apellido}</p>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              {propietario ? (
                <div className="space-y-2">
                  {/* Teléfono */}
                  {propietario.telefono && (
                    <a
                      href={`tel:${propietario.telefono}`}
                      className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors active:scale-[0.98]"
                    >
                      <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center">
                        <Phone className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-petcast-text-light">Telefono</p>
                        <p className="text-sm font-medium text-petcast-heading">{propietario.telefono}</p>
                      </div>
                    </a>
                  )}

                  {/* Email */}
                  {propietario.correoElectronico && (
                    <a
                      href={`mailto:${propietario.correoElectronico}`}
                      className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors active:scale-[0.98]"
                    >
                      <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-petcast-text-light">Correo</p>
                        <p className="text-sm font-medium text-petcast-heading truncate">{propietario.correoElectronico}</p>
                      </div>
                    </a>
                  )}

                  {/* Dirección */}
                  {propietario.direccion && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-petcast-text-light">Direccion</p>
                        <p className="text-sm font-medium text-petcast-heading">{propietario.direccion}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <User className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-petcast-text-light">Sin propietario registrado</p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Acordeon Información Completa */}
          <AccordionItem value="info" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-petcast-bg-soft rounded-xl flex items-center justify-center">
                  <PawPrint className="w-4 h-4 text-petcast-main" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-petcast-heading">Informacion Completa</p>
                  <p className="text-xs text-petcast-text-light">Detalles de la mascota</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-petcast-text-light mb-1">Especie</p>
                  <p className="text-sm font-medium text-petcast-heading">{mascota.especie}</p>
                </div>

                {mascota.raza && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-petcast-text-light mb-1">Raza</p>
                    <p className="text-sm font-medium text-petcast-heading">{mascota.raza}</p>
                  </div>
                )}

                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-petcast-text-light mb-1">Edad</p>
                  <p className="text-sm font-medium text-petcast-heading">
                    {mascota.edad ? `${mascota.edad} años` : 'No registrada'}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-petcast-text-light mb-1">Sexo</p>
                  <p className="text-sm font-medium text-petcast-heading">
                    {mascota.sexo === 'MACHO' ? 'Macho' : mascota.sexo === 'HEMBRA' ? 'Hembra' : 'No registrado'}
                  </p>
                </div>

                {mascota.peso && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-petcast-text-light mb-1">Peso</p>
                    <p className="text-sm font-medium text-petcast-heading">{mascota.peso} kg</p>
                  </div>
                )}

                {mascota.color && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-petcast-text-light mb-1">Color</p>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full border border-gray-200 shadow-sm"
                        style={{ backgroundColor: mascota.color }}
                      />
                    </div>
                  </div>
                )}

                {mascota.talla && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-petcast-text-light mb-1">Talla</p>
                    <p className="text-sm font-medium text-petcast-heading">{mascota.talla} cm</p>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Acordeon Historial Médico */}
          <AccordionItem value="historial" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-petcast-heading">Historial Medico</p>
                  <p className="text-xs text-petcast-text-light">
                    {fichasOrdenadas.length} {fichasOrdenadas.length === 1 ? 'registro' : 'registros'}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              {fichasOrdenadas.length > 0 ? (
                <div className="space-y-3">
                  {fichasOrdenadas.map((ficha, index) => (
                    <div
                      key={ficha.id}
                      className={`rounded-xl p-3 ${index === 0 ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'}`}
                    >
                      {/* Fecha */}
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className={`w-3.5 h-3.5 ${index === 0 ? 'text-blue-500' : 'text-gray-400'}`} />
                        <span className={`text-xs font-medium ${index === 0 ? 'text-blue-600' : 'text-petcast-text-light'}`}>
                          {new Date(ficha.fechaConsulta).toLocaleDateString('es-MX', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                          {index === 0 && <span className="ml-2 text-blue-500">(Última)</span>}
                        </span>
                      </div>

                      {/* Diagnóstico */}
                      {ficha.diagnostico && (
                        <div className="mb-2">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Stethoscope className="w-3 h-3 text-blue-500" />
                            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Diagnostico</p>
                          </div>
                          <p className="text-sm text-petcast-heading">{ficha.diagnostico}</p>
                        </div>
                      )}

                      {/* Tratamiento */}
                      {ficha.tratamiento && (
                        <div className="mb-2">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Pill className="w-3 h-3 text-green-500" />
                            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Tratamiento</p>
                          </div>
                          <p className="text-sm text-petcast-heading">{ficha.tratamiento}</p>
                        </div>
                      )}

                      {/* Observaciones */}
                      {ficha.observaciones && (
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <ClipboardList className="w-3 h-3 text-gray-400" />
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Observaciones</p>
                          </div>
                          <p className="text-sm text-petcast-text-light">{ficha.observaciones}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <FileText className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-petcast-text-light">Sin historial medico</p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Footer */}
        <div className="text-center pt-2 pb-4">
          <p className="text-xs text-petcast-text-light">
            Si encontraste a esta mascota, contacta al propietario
          </p>
          <p className="text-xs text-petcast-text-light mt-2">
            PetCast © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
