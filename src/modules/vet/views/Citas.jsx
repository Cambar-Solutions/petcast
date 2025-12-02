import { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, PawPrint, Loader2 } from 'lucide-react';
import { Button, SearchBar } from '@/shared/components';
import { CitaForm } from '../components';
import { useAppointments, useCreateAppointment, useUpdateAppointment, usePets, useDuenos } from '@/shared/hooks';

export default function Citas() {
  // Hooks de TanStack Query
  const { data: citas = [], isLoading, error } = useAppointments();
  const { data: mascotas = [] } = usePets();
  const { data: duenos = [] } = useDuenos();
  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();

  const [searchTerm, setSearchTerm] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('Todas');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCita, setSelectedCita] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleOpenCreate = () => {
    setSelectedCita(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedCita(null);
  };

  // Obtener nombre de mascota
  const getMascotaName = (mascotaId) => {
    const mascota = mascotas.find(m => m.id === mascotaId);
    return mascota?.nombre || 'Sin mascota';
  };

  // Obtener nombre de dueño
  const getDuenoName = (duenoId) => {
    const dueno = duenos.find(d => d.id === duenoId);
    return dueno ? `${dueno.nombre} ${dueno.apellido}`.trim() : 'Sin dueño';
  };

  // Mapear estado del backend al frontend
  const mapStatusFromBackend = (estado) => {
    const map = {
      'PROGRAMADA': 'Pendiente',
      'CONFIRMADA': 'Confirmada',
      'COMPLETADA': 'Completada',
      'CANCELADA': 'Cancelada',
    };
    return map[estado] || estado;
  };

  // Mapear estado del frontend al backend
  const mapStatusToBackend = (status) => {
    const map = {
      'Pendiente': 'PROGRAMADA',
      'Confirmada': 'CONFIRMADA',
      'Completada': 'COMPLETADA',
      'Cancelada': 'CANCELADA',
    };
    return map[status] || 'PROGRAMADA';
  };

  const handleSubmit = async (formData) => {
    try {
      // Combinar fecha y hora
      const fechaHora = new Date(`${formData.fecha}T${formData.hora}`);

      const appointmentData = {
        fechaHora: fechaHora.toISOString(),
        motivo: formData.tipo,
        estado: mapStatusToBackend(formData.status),
        mascotaId: parseInt(formData.mascotaId),
        duenoId: parseInt(formData.duenoId),
        veterinarioId: null,
        notas: formData.notas || null,
      };

      if (selectedCita) {
        await updateAppointment.mutateAsync({ id: selectedCita.id, ...appointmentData });
      } else {
        await createAppointment.mutateAsync(appointmentData);
      }
      handleCloseForm();
    } catch (err) {
      console.error('Error al guardar cita:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmada': return 'bg-green-100 text-green-700';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-700';
      case 'Cancelada': return 'bg-red-100 text-red-700';
      case 'Completada': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filtros = ['Todas', 'Hoy', 'Pendientes', 'Confirmadas'];

  // Mapear citas del backend al frontend
  const mappedCitas = citas.map((cita) => {
    const fechaHora = new Date(cita.fechaHora);
    return {
      id: cita.id,
      mascota: getMascotaName(cita.mascotaId),
      mascotaId: cita.mascotaId,
      dueno: getDuenoName(cita.duenoId),
      duenoId: cita.duenoId,
      fecha: fechaHora.toISOString().split('T')[0],
      hora: fechaHora.toTimeString().slice(0, 5),
      tipo: cita.motivo,
      status: mapStatusFromBackend(cita.estado),
      notas: cita.notas,
    };
  });

  const filteredCitas = mappedCitas.filter((cita) => {
    const matchSearch =
      cita.mascota.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.dueno.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.tipo.toLowerCase().includes(searchTerm.toLowerCase());

    if (filtroActivo === 'Todas') return matchSearch;
    if (filtroActivo === 'Hoy') return matchSearch && cita.fecha === new Date().toISOString().split('T')[0];
    if (filtroActivo === 'Pendientes') return matchSearch && cita.status === 'Pendiente';
    if (filtroActivo === 'Confirmadas') return matchSearch && cita.status === 'Confirmada';
    return matchSearch;
  });

  // Preparar datos para el formulario
  const mascotasForForm = mascotas.map(m => ({
    id: m.id,
    nombre: m.nombre,
    duenoId: m.duenoId,
  }));

  const duenosForForm = duenos.map(d => ({
    id: d.id,
    nombre: `${d.nombre} ${d.apellido}`.trim(),
  }));

  // Estado de carga
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error al cargar citas</p>
        <p className="text-gray-500 text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Citas</h1>
          <p className="text-gray-600">Gestiona las citas de tus pacientes</p>
        </div>
        <Button
          variant="primary"
          className="flex items-center gap-2"
          onClick={handleOpenCreate}
          disabled={createAppointment.isPending}
        >
          <Plus className="w-4 h-4" />
          Nueva Cita
        </Button>
      </div>

      {/* Buscador */}
      <SearchBar
        placeholder="Buscar cita..."
        value={searchTerm}
        onChange={setSearchTerm}
        debounceMs={300}
      />

      {/* Filtros rapidos */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filtros.map((filtro) => (
          <button
            key={filtro}
            onClick={() => setFiltroActivo(filtro)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              filtro === filtroActivo
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filtro}
          </button>
        ))}
      </div>

      {/* Lista de citas */}
      <div className="space-y-3">
        {filteredCitas.map((cita) => (
          <div key={cita.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <PawPrint className="w-7 h-7 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{cita.mascota}</h3>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(cita.status)}`}>
                    {cita.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{cita.dueno}</p>
                <p className="text-sm text-gray-400">{cita.tipo}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-gray-900 font-medium">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {cita.fecha}
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {cita.hora}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCitas.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No se encontraron citas
        </div>
      )}

      {/* Form Modal/Drawer */}
      <CitaForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        cita={selectedCita}
        isMobile={isMobile}
        mascotas={mascotasForForm}
        duenos={duenosForForm}
        isLoading={createAppointment.isPending || updateAppointment.isPending}
      />
    </div>
  );
}
