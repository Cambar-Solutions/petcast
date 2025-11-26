import { TrendingUp, Users, Calendar, PawPrint } from 'lucide-react';

export default function Estadisticas() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Estadisticas</h1>
        <p className="text-gray-600">Metricas y reportes de tu clinica</p>
      </div>

      {/* Cards de estadisticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Citas este mes</span>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">156</p>
          <p className="text-sm text-green-600">+12% vs mes anterior</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Veterinarios activos</span>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">8</p>
          <p className="text-sm text-gray-500">2 nuevos este mes</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Mascotas registradas</span>
            <PawPrint className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">342</p>
          <p className="text-sm text-green-600">+8% vs mes anterior</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Promedio citas/dia</span>
            <Calendar className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">12</p>
          <p className="text-sm text-gray-500">Dias laborales</p>
        </div>
      </div>

      {/* Grafico placeholder */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Citas por mes</h2>
        <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
          <p className="text-gray-400">Grafico de citas (proximamente)</p>
        </div>
      </div>

      {/* Tabla resumen */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Veterinarios</h2>
        <div className="space-y-3">
          {['Dr. Carlos Martinez', 'Dra. Ana Lopez', 'Dr. Pedro Sanchez'].map((name, i) => (
            <div key={name} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {i + 1}
                </span>
                <span className="font-medium text-gray-900">{name}</span>
              </div>
              <span className="text-sm text-gray-500">{45 - i * 8} citas</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
