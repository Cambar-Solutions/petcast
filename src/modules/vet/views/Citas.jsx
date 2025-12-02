import { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, PawPrint, Loader2, Edit } from 'lucide-react';
import { Button, Title, Description, SearchBar, FilterTabs } from '@/shared/components';
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

  const handleOpenEdit = (cita) => {
    setSelectedCita(cita);
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

  const filtros = [
    { id: 'Todas', label: 'Todas' },
    { id: 'Pendientes', label: 'Pendientes' },
    { id: 'Confirmadas', label: 'Confirmadas' },
    { id: 'Canceladas', label: 'Canceladas' },
  ];

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
    if (filtroActivo === 'Pendientes') return matchSearch && cita.status === 'Pendiente';
    if (filtroActivo === 'Confirmadas') return matchSearch && cita.status === 'Confirmada';
    if (filtroActivo === 'Canceladas') return matchSearch && cita.status === 'Cancelada';
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
      <div className="flex flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Title variant="page-title">Citas</Title>
          <Description variant="section-description" mobileText="Gestión de citas">
            Gestiona las citas de tus pacientes
          </Description>
        </div>
        <Button
          variant="circular"
          size="md-mobile"
          onClick={handleOpenCreate}
          disabled={createAppointment.isPending}
        >
          <Plus className="w-5 h-5 sm:w-4 sm:h-4 sm:mr-2" />
          <span className="hidden sm:inline">Nueva Cita</span>
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
      <FilterTabs
        filters={filtros}
        selectedFilter={filtroActivo}
        onFilterChange={setFiltroActivo}
      />

      {/* Lista de citas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredCitas.map((cita) => (
          <div key={cita.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                  <PawPrint className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{cita.mascota}</h3>
                  <p className="text-xs text-gray-500">{cita.dueno}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(cita.status)}`}>
                {cita.status}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {cita.fecha}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {cita.hora}
              </span>
              <span className="text-gray-400 truncate max-w-[80px]">{cita.tipo}</span>
            </div>
            <button
              onClick={() => handleOpenEdit(cita)}
              className="w-full flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
            >
              <Edit className="w-3 h-3" />
              Editar cita
            </button>
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
