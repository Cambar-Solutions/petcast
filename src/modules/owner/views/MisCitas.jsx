import { useState, useEffect } from 'react';
import { Calendar, Clock, PawPrint, Loader2, CheckCircle, FileText } from 'lucide-react';
import { Title, Description, SearchBar, Modal, Button, FilterTabs } from '@/shared/components';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/shared/components/ui/drawer';
import { useAppointmentsByOwner, usePetsByOwner } from '@/shared/hooks';
import { useAuth } from '@/shared/context/AuthContext';

export default function MisCitas() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCita, setSelectedCita] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('todas');

  const filters = [
    { id: 'todas', label: 'Todas' },
    { id: 'CONFIRMADA', label: 'Confirmadas' },
    { id: 'COMPLETADA', label: 'Completadas' },
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { data: citas = [], isLoading, error } = useAppointmentsByOwner(user?.id);
  const { data: mascotas = [] } = usePetsByOwner(user?.id);

  // Crear mapa de mascotas por ID para búsqueda rápida
  const mascotasMap = mascotas.reduce((acc, m) => {
    acc[m.id] = m;
    return acc;
  }, {});

  // Filtrar solo CONFIRMADA y COMPLETADA (el backend usa 'estado')
  const citasFiltradas = citas.filter(
    (cita) => cita.estado === 'CONFIRMADA' || cita.estado === 'COMPLETADA'
  );

  // Extraer fecha y hora de fechaHora
  const extraerFechaHora = (fechaHora) => {
    if (!fechaHora) return { fecha: null, hora: null };
    const date = new Date(fechaHora);
    return {
      fecha: date,
      hora: date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    };
  };

  // Mapear datos del backend (campos reales: fechaHora, motivo, estado)
  const mappedCitas = citasFiltradas.map((c) => {
    const { fecha, hora } = extraerFechaHora(c.fechaHora);
    const mascota = mascotasMap[c.mascotaId] || c.mascota;
    return {
      id: c.id,
      mascota: mascota?.nombre || 'Sin mascota',
      especie: mascota?.especie || 'Perro',
      raza: mascota?.raza,
      fecha: fecha,
      hora: hora,
      tipo: c.motivo || 'Consulta',
      status: c.estado,
      notas: c.notas,
    };
  });

  // Ordenar: primero las confirmadas (próximas), luego las completadas
  const sortedCitas = [...mappedCitas].sort((a, b) => {
    if (a.status === 'CONFIRMADA' && b.status === 'COMPLETADA') return -1;
    if (a.status === 'COMPLETADA' && b.status === 'CONFIRMADA') return 1;
    return new Date(a.fecha) - new Date(b.fecha);
  });

  const filteredCitas = sortedCitas.filter((cita) => {
    const matchesSearch =
      cita.mascota.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.tipo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'todas' || cita.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMADA': return 'bg-green-100 text-green-700';
      case 'COMPLETADA': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'CONFIRMADA': return 'Confirmada';
      case 'COMPLETADA': return 'Completada';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-petcast-orange" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error al cargar citas</p>
        <p className="text-gray-500 text-sm">{error.message}</p>
      </div>
    );
  }

  // Contenido del detalle de cita (reutilizado en Modal y Drawer)
  const CitaDetalleContent = ({ cita, onClose }) => (
    <div className="space-y-4">
      {/* Header con mascota */}
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 bg-petcast-bg-soft rounded-2xl flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">
            {cita.especie === 'Perro' ? '🐕' : cita.especie === 'Gato' ? '🐈' : '🐾'}
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-petcast-heading">{cita.mascota}</h3>
            <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md ${cita.status === 'COMPLETADA' ? 'bg-green-100 text-green-700' : 'bg-petcast-bg-soft text-petcast-heading'}`}>
              {getStatusLabel(cita.status)}
            </span>
          </div>
          <p className="text-sm text-petcast-text-light">{cita.especie}{cita.raza ? ` • ${cita.raza}` : ''}</p>
        </div>
      </div>

      {/* Grid de info - mejor distribuido */}
      <div className="bg-petcast-bg rounded-2xl p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Fecha */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <Calendar className="w-5 h-5 text-petcast-orange" />
            </div>
            <div>
              <p className="text-[10px] text-petcast-text-light uppercase tracking-wider">Fecha</p>
              <p className="text-sm font-semibold text-petcast-heading">
                {new Date(cita.fecha).toLocaleDateString('es-MX', {
                  day: 'numeric',
                  month: 'short'
                })}
              </p>
            </div>
          </div>

          {/* Hora */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <Clock className="w-5 h-5 text-petcast-orange" />
            </div>
            <div>
              <p className="text-[10px] text-petcast-text-light uppercase tracking-wider">Hora</p>
              <p className="text-sm font-semibold text-petcast-heading">{cita.hora}</p>
            </div>
          </div>

          {/* Motivo - ocupa 2 columnas */}
          <div className="col-span-2 flex items-center gap-3 pt-2 border-t border-petcast-bg-soft">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <FileText className="w-5 h-5 text-petcast-blue" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-petcast-text-light uppercase tracking-wider">Motivo</p>
              <p className="text-sm font-semibold text-petcast-heading">{cita.tipo}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notas (si existen) - mejor contraste */}
      {cita.notas && (
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-petcast-orange" />
            <span className="text-xs font-semibold text-petcast-heading">Notas del veterinario</span>
          </div>
          <p className="text-sm text-petcast-text leading-relaxed">{cita.notas}</p>
        </div>
      )}

      {/* Botón cerrar */}
      <Button variant="primary" className="w-full" onClick={onClose}>
        Cerrar
      </Button>
    </div>
  );

  return (
    <div className="space-y-6 pb-8">
      <div>
        <Title variant="page-title">Mis Citas</Title>
        <Description variant="section-description" mobileText="Tus citas">
          Citas confirmadas y completadas
        </Description>
      </div>

      {/* Buscador */}
      <SearchBar
        placeholder="Buscar cita..."
        value={searchTerm}
        onChange={setSearchTerm}
        debounceMs={300}
      />

      {/* Filtros */}
      <FilterTabs
        filters={filters}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />

      {/* Grid de citas - 3 columnas en desktop, 1 en mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCitas.map((cita) => (
          <button
            key={cita.id}
            onClick={() => setSelectedCita(cita)}
            className="text-left bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-petcast-bg-soft transition-all"
          >
            {/* Header: Mascota + Badge */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-petcast-bg-soft rounded-xl flex items-center justify-center">
                  <span className="text-lg">
                    {cita.especie === 'Perro' ? '🐕' : cita.especie === 'Gato' ? '🐈' : '🐾'}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-petcast-heading text-sm">{cita.mascota}</h3>
                  <p className="text-xs text-petcast-text-light">{cita.tipo}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-[10px] font-semibold rounded-lg ${cita.status === 'COMPLETADA' ? 'bg-green-100 text-green-700' : 'bg-petcast-bg-soft text-petcast-heading'}`}>
                {getStatusLabel(cita.status)}
              </span>
            </div>

            {/* Footer: Fecha y Hora */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-petcast-text">
                <Calendar className="w-4 h-4 text-petcast-orange" />
                <span className="text-sm font-medium">
                  {new Date(cita.fecha).toLocaleDateString('es-MX', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-petcast-text">
                <Clock className="w-4 h-4 text-petcast-blue" />
                <span className="text-sm font-medium">{cita.hora}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {filteredCitas.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchTerm ? 'No se encontraron citas' : 'No tienes citas confirmadas o completadas'}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Contacta a tu veterinario para agendar una cita
          </p>
        </div>
      )}

      {/* Modal en desktop / Drawer en mobile */}
      {isMobile ? (
        <Drawer open={!!selectedCita} onOpenChange={(open) => !open && setSelectedCita(null)}>
          <DrawerContent>
            <div className="px-4 pb-6 pt-2">
              {selectedCita && <CitaDetalleContent cita={selectedCita} onClose={() => setSelectedCita(null)} />}
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Modal open={!!selectedCita} onClose={() => setSelectedCita(null)} size="sm">
          {selectedCita && <CitaDetalleContent cita={selectedCita} onClose={() => setSelectedCita(null)} />}
        </Modal>
      )}
    </div>
  );
}
