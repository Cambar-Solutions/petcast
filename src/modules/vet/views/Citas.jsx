import { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, PawPrint } from 'lucide-react';
import { Button, SearchBar } from '@/shared/components';
import { CitaForm } from '../components';

export default function Citas() {
  const [citas, setCitas] = useState([
    { id: 1, mascota: 'Max', dueno: 'Maria Garcia', fecha: '2024-01-15', hora: '09:00', tipo: 'Consulta', status: 'Pendiente' },
    { id: 2, mascota: 'Luna', dueno: 'Carlos Lopez', fecha: '2024-01-15', hora: '10:30', tipo: 'Vacunacion', status: 'Confirmada' },
    { id: 3, mascota: 'Rocky', dueno: 'Ana Martinez', fecha: '2024-01-15', hora: '12:00', tipo: 'Revision', status: 'Pendiente' },
    { id: 4, mascota: 'Michi', dueno: 'Pedro Sanchez', fecha: '2024-01-16', hora: '09:30', tipo: 'Consulta', status: 'Confirmada' },
  ]);

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

  const handleSubmit = (formData) => {
    if (selectedCita) {
      setCitas((prev) =>
        prev.map((c) => (c.id === selectedCita.id ? { ...c, ...formData } : c))
      );
    } else {
      const newCita = { id: Date.now(), ...formData };
      setCitas((prev) => [...prev, newCita]);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmada': return 'bg-green-100 text-green-700';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-700';
      case 'Cancelada': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filtros = ['Todas', 'Hoy', 'Pendientes', 'Confirmadas'];

  const filteredCitas = citas.filter((cita) => {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Citas</h1>
          <p className="text-gray-600">Gestiona las citas de tus pacientes</p>
        </div>
        <Button variant="primary" className="flex items-center gap-2" onClick={handleOpenCreate}>
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
      />
    </div>
  );
}
