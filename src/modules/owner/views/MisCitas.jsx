import { useState } from 'react';
import { Calendar, Clock, PawPrint } from 'lucide-react';
import { SearchBar } from '@/shared/components';

export default function MisCitas() {
  const [searchTerm, setSearchTerm] = useState('');

  const citas = [
    { id: 1, mascota: 'Max', fecha: '2024-01-15', hora: '10:00', tipo: 'Vacunacion', veterinario: 'Dr. Carlos Martinez', status: 'Confirmada' },
    { id: 2, mascota: 'Luna', fecha: '2024-01-20', hora: '11:30', tipo: 'Revision', veterinario: 'Dra. Ana Lopez', status: 'Pendiente' },
    { id: 3, mascota: 'Max', fecha: '2024-02-10', hora: '09:00', tipo: 'Desparasitacion', veterinario: 'Dr. Carlos Martinez', status: 'Pendiente' },
  ];

  const filteredCitas = citas.filter(
    (cita) =>
      cita.mascota.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.veterinario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmada': return 'bg-green-100 text-green-700';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mis Citas</h1>
        <p className="text-gray-600">Proximas citas de tus mascotas</p>
      </div>

      {/* Buscador */}
      <SearchBar
        placeholder="Buscar cita..."
        value={searchTerm}
        onChange={setSearchTerm}
        debounceMs={300}
      />

      {/* Lista de citas */}
      <div className="space-y-4">
        {filteredCitas.map((cita) => (
          <div key={cita.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <PawPrint className="w-7 h-7 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{cita.mascota}</h3>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(cita.status)}`}>
                    {cita.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{cita.tipo}</p>
                <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {cita.fecha}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {cita.hora}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  {cita.veterinario}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCitas.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchTerm ? 'No se encontraron citas' : 'No tienes citas programadas'}
          </p>
        </div>
      )}
    </div>
  );
}
