import { Calendar, PawPrint, Clock, Users } from 'lucide-react';

export default function VetDashboard() {
  const stats = [
    { label: 'Citas Hoy', value: '8', icon: Calendar, color: 'bg-blue-500' },
    { label: 'Mascotas', value: '45', icon: PawPrint, color: 'bg-green-500' },
    { label: 'Pendientes', value: '3', icon: Clock, color: 'bg-yellow-500' },
    { label: 'Duenos', value: '32', icon: Users, color: 'bg-purple-500' },
  ];

  const citasHoy = [
    { id: 1, mascota: 'Max', dueno: 'Maria Garcia', hora: '09:00', tipo: 'Consulta' },
    { id: 2, mascota: 'Luna', dueno: 'Carlos Lopez', hora: '10:30', tipo: 'Vacunacion' },
    { id: 3, mascota: 'Rocky', dueno: 'Ana Martinez', hora: '12:00', tipo: 'Revision' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Panel de Veterinario</h1>
        <p className="text-gray-600">Bienvenido, estas son tus citas de hoy</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Citas de Hoy</h2>
        <div className="space-y-3">
          {citasHoy.map((cita) => (
            <div key={cita.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <PawPrint className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{cita.mascota}</p>
                <p className="text-sm text-gray-500">{cita.dueno} - {cita.tipo}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{cita.hora}</p>
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  Pendiente
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
