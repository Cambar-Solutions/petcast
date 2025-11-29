import { useParams } from 'react-router-dom';
import { Phone, Mail, MapPin, Loader2, PawPrint } from 'lucide-react';
import { usePet, useDuenos } from '@/shared/hooks';

export default function MascotaPublica() {
  const { id } = useParams();

  // Cargar datos
  const { data: mascota, isLoading, error } = usePet(id);
  const { data: duenos = [] } = useDuenos();

  // Obtener propietario
  const propietario = duenos.find(d => d.id === mascota?.duenoId);

  // Estado de carga
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Estado de error o no encontrado
  if (error || !mascota) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PawPrint className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mascota no encontrada</h1>
          <p className="text-gray-500">
            El código QR no corresponde a ninguna mascota registrada en nuestro sistema.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header con logo */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">PetCast</h1>
          <p className="text-sm text-gray-500">Identificación de Mascota</p>
        </div>

        {/* Card principal */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header con emoji */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-center">
            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <span className="text-5xl">
                {mascota.especie === 'Perro' ? '🐕' : mascota.especie === 'Gato' ? '🐈' : '🐾'}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white">{mascota.nombre}</h2>
            {mascota.codigoQR && (
              <p className="text-blue-100 text-sm mt-1">{mascota.codigoQR}</p>
            )}
          </div>

          {/* Información de la mascota */}
          <div className="p-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
              Información
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Especie</p>
                <p className="font-semibold text-gray-900">{mascota.especie}</p>
              </div>

              {mascota.raza && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">Raza</p>
                  <p className="font-semibold text-gray-900">{mascota.raza}</p>
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Edad</p>
                <p className="font-semibold text-gray-900">
                  {mascota.edad ? `${mascota.edad} años` : 'N/A'}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Sexo</p>
                <p className="font-semibold text-gray-900">
                  {mascota.sexo === 'MACHO' ? 'Macho' : mascota.sexo === 'HEMBRA' ? 'Hembra' : mascota.sexo}
                </p>
              </div>

              {mascota.peso && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">Peso</p>
                  <p className="font-semibold text-gray-900">{mascota.peso} kg</p>
                </div>
              )}

              {mascota.color && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">Color</p>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-full border-2 border-white shadow"
                      style={{ backgroundColor: mascota.color }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Información del propietario */}
            {propietario && (
              <>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
                  Contacto del Propietario
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">👤</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Nombre</p>
                      <p className="font-medium text-gray-900">
                        {propietario.nombre} {propietario.apellido}
                      </p>
                    </div>
                  </div>

                  {propietario.telefono && (
                    <a
                      href={`tel:${propietario.telefono}`}
                      className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Phone className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Teléfono</p>
                        <p className="font-medium text-gray-900">{propietario.telefono}</p>
                      </div>
                    </a>
                  )}

                  {propietario.correoElectronico && (
                    <a
                      href={`mailto:${propietario.correoElectronico}`}
                      className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
                    >
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Correo</p>
                        <p className="font-medium text-gray-900 text-sm break-all">
                          {propietario.correoElectronico}
                        </p>
                      </div>
                    </a>
                  )}

                  {propietario.direccion && (
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Dirección</p>
                        <p className="font-medium text-gray-900">{propietario.direccion}</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {!propietario && (
              <div className="text-center py-4 text-gray-500">
                <p>Esta mascota no tiene propietario registrado</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 text-center">
            <p className="text-xs text-gray-400">
              Si encontraste a esta mascota, por favor contacta al propietario
            </p>
          </div>
        </div>

        {/* Powered by */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Powered by PetCast © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
