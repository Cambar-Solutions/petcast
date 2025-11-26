import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Syringe, FileText, Weight } from 'lucide-react';

export default function DetalleMascota() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Datos mock
  const mascota = {
    id: id,
    nombre: 'Max',
    especie: 'Perro',
    raza: 'Labrador',
    edad: '3 anos',
    peso: '28 kg',
    color: 'Dorado',
    veterinario: 'Dr. Carlos Martinez',
    historial: [
      { fecha: '2024-01-10', tipo: 'Vacunacion', descripcion: 'Vacuna antirabica' },
      { fecha: '2023-12-15', tipo: 'Consulta', descripcion: 'Revision general - Todo bien' },
      { fecha: '2023-10-20', tipo: 'Desparasitacion', descripcion: 'Desparasitante oral' },
    ],
    proximaCita: {
      fecha: '2024-01-15',
      hora: '10:00',
      tipo: 'Vacunacion',
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-xl"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Detalle de Mascota</h1>
      </div>

      {/* Info principal */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center">
            <span className="text-4xl">🐕</span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{mascota.nombre}</h2>
            <p className="text-gray-500">{mascota.raza} - {mascota.especie}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                {mascota.edad}
              </span>
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm flex items-center gap-1">
                <Weight className="w-3 h-3" /> {mascota.peso}
              </span>
              <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm">
                {mascota.color}
              </span>
            </div>
          </div>
        </div>

        {/* Veterinario */}
        <div className="p-4 bg-gray-50 rounded-xl">
          <p className="text-xs text-gray-400 mb-1">Veterinario asignado</p>
          <p className="font-medium text-gray-900">{mascota.veterinario}</p>
        </div>
      </div>

      {/* Proxima cita */}
      {mascota.proximaCita && (
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-600">Proxima Cita</p>
              <p className="font-semibold text-blue-900">
                {mascota.proximaCita.fecha} a las {mascota.proximaCita.hora}
              </p>
              <p className="text-sm text-blue-700">{mascota.proximaCita.tipo}</p>
            </div>
          </div>
        </div>
      )}

      {/* Historial */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial Medico</h3>
        <div className="space-y-3">
          {mascota.historial.map((item, i) => (
            <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                item.tipo === 'Vacunacion' ? 'bg-green-100' :
                item.tipo === 'Consulta' ? 'bg-blue-100' : 'bg-purple-100'
              }`}>
                {item.tipo === 'Vacunacion' ? (
                  <Syringe className="w-5 h-5 text-green-600" />
                ) : (
                  <FileText className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">{item.tipo}</span>
                  <span className="text-sm text-gray-400">{item.fecha}</span>
                </div>
                <p className="text-sm text-gray-600">{item.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
