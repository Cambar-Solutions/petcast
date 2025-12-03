import { TrendingUp, Users, Calendar, PawPrint, Loader2, UserCheck, AlertCircle } from 'lucide-react';
import { Title, Description } from '@/shared/components';
import { useDashboard, useCitasPorMes } from '@/shared/hooks';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Estadisticas() {
  const { data: stats, isLoading, error } = useDashboard();
  const { data: citasPorMes = [], isLoading: loadingChart } = useCitasPorMes();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-500">Error al cargar estadisticas</p>
        <p className="text-gray-500 text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <Title variant="page-title">Estadisticas</Title>
        <Description variant="section-description" mobileText="Metricas y reportes">
          Metricas y reportes de tu clinica
        </Description>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Citas hoy</span>
            <Calendar className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.citasHoy || 0}</p>
          <p className="text-sm text-gray-500">Programadas para hoy</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Citas este mes</span>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.citasMes || 0}</p>
          <p className="text-sm text-gray-500">Total del mes actual</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Veterinarios</span>
            <UserCheck className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.totalVeterinarios || 0}</p>
          <p className="text-sm text-gray-500">Registrados en el sistema</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Clientes</span>
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.totalClientes || 0}</p>
          <p className="text-sm text-gray-500">Duenos registrados</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Total mascotas</span>
            <PawPrint className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.totalMascotas || 0}</p>
          <p className="text-sm text-gray-500">Registradas en el sistema</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Mascotas activas</span>
            <PawPrint className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">{stats?.mascotasActivas || 0}</p>
          <p className="text-sm text-gray-500">Con visitas al dia</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Mascotas inactivas</span>
            <PawPrint className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-600">{stats?.mascotasInactivas || 0}</p>
          <p className="text-sm text-gray-500">Sin visita en 2+ meses</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <Title variant="card-title" className="mb-4">Resumen General</Title>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <p className="text-2xl font-bold text-blue-600">{stats?.totalCitas || 0}</p>
            <p className="text-sm text-gray-600">Citas totales</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <p className="text-2xl font-bold text-green-600">{stats?.totalMascotas || 0}</p>
            <p className="text-sm text-gray-600">Mascotas totales</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <p className="text-2xl font-bold text-purple-600">{stats?.totalClientes || 0}</p>
            <p className="text-sm text-gray-600">Clientes totales</p>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-xl">
            <p className="text-2xl font-bold text-amber-600">{stats?.totalVeterinarios || 0}</p>
            <p className="text-sm text-gray-600">Veterinarios</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <Title variant="card-title" className="mb-4">Citas por mes</Title>
        <div className="h-64">
          {loadingChart ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : citasPorMes.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={citasPorMes} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={{ stroke: "#e5e7eb" }} />
                <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={{ stroke: "#e5e7eb" }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  formatter={(value) => [value, "Citas"]}
                />
                <Bar dataKey="citas" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full bg-gray-50 rounded-xl flex items-center justify-center">
              <p className="text-gray-400">No hay datos de citas disponibles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
