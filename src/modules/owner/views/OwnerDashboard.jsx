import { PawPrint, Calendar, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function OwnerDashboard() {
  const navigate = useNavigate();

  const misMascotas = [
    { id: 1, nombre: 'Max', especie: 'Perro', raza: 'Labrador', proximaCita: '15 Ene' },
    { id: 2, nombre: 'Luna', especie: 'Gato', raza: 'Siames', proximaCita: '20 Ene' },
  ];

  const proximasCitas = [
    { id: 1, mascota: 'Max', fecha: '15 Ene 2024', hora: '10:00', tipo: 'Vacunacion' },
    { id: 2, mascota: 'Luna', fecha: '20 Ene 2024', hora: '11:30', tipo: 'Revision' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bienvenido</h1>
        <p className="text-gray-600">Panel de dueno de mascotas</p>
      </div>

      {/* Resumen rapido */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mb-3">
            <PawPrint className="w-5 h-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{misMascotas.length}</p>
          <p className="text-sm text-gray-500">Mis Mascotas</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mb-3">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{proximasCitas.length}</p>
          <p className="text-sm text-gray-500">Proximas Citas</p>
        </div>
      </div>

      {/* Mis mascotas */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Mis Mascotas</h2>
          <button
            onClick={() => navigate('/owner/mascotas')}
            className="text-sm text-blue-600 hover:underline"
          >
            Ver todas
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {misMascotas.map((mascota) => (
            <button
              key={mascota.id}
              onClick={() => navigate(`/owner/mascota/${mascota.id}`)}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">
                  {mascota.especie === 'Perro' ? '🐕' : '🐈'}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{mascota.nombre}</p>
                <p className="text-sm text-gray-500">{mascota.raza}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Proximas citas */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Proximas Citas</h2>
          <button
            onClick={() => navigate('/owner/citas')}
            className="text-sm text-blue-600 hover:underline"
          >
            Ver todas
          </button>
        </div>
        <div className="space-y-3">
          {proximasCitas.map((cita) => (
            <div key={cita.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{cita.mascota} - {cita.tipo}</p>
                <p className="text-sm text-gray-500">{cita.fecha} a las {cita.hora}</p>
              </div>
              <Bell className="w-5 h-5 text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
