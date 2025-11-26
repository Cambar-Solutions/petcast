import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, QrCode, Eye } from 'lucide-react';
import { Button, SearchBar, ConfirmDialog } from '@/shared/components';
import { MascotaForm } from '../components';

export default function Mascotas() {
  const navigate = useNavigate();
  const [mascotas, setMascotas] = useState([
    { id: 1, name: 'Max', especie: 'Perro', raza: 'Labrador', dueno: 'Maria Garcia', edad: '3 anos' },
    { id: 2, name: 'Luna', especie: 'Gato', raza: 'Siames', dueno: 'Carlos Lopez', edad: '2 anos' },
    { id: 3, name: 'Rocky', especie: 'Perro', raza: 'Bulldog', dueno: 'Ana Martinez', edad: '5 anos' },
    { id: 4, name: 'Michi', especie: 'Gato', raza: 'Persa', dueno: 'Pedro Sanchez', edad: '1 ano' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMascota, setSelectedMascota] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [mascotaToDelete, setMascotaToDelete] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleOpenCreate = () => {
    setSelectedMascota(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (mascota) => {
    setSelectedMascota(mascota);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedMascota(null);
  };

  const handleSubmit = (formData) => {
    if (selectedMascota) {
      setMascotas((prev) =>
        prev.map((m) => (m.id === selectedMascota.id ? { ...m, ...formData } : m))
      );
    } else {
      const newMascota = { id: Date.now(), ...formData };
      setMascotas((prev) => [...prev, newMascota]);
    }
  };

  const handleOpenDeleteConfirm = (mascota) => {
    setMascotaToDelete(mascota);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (mascotaToDelete) {
      setMascotas((prev) => prev.filter((m) => m.id !== mascotaToDelete.id));
      setMascotaToDelete(null);
    }
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
    setMascotaToDelete(null);
  };

  const filteredMascotas = mascotas.filter(
    (mascota) =>
      mascota.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mascota.dueno.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mascota.raza.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mascotas</h1>
          <p className="text-gray-600">Gestiona las mascotas registradas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <QrCode className="w-4 h-4" />
            Escanear QR
          </Button>
          <Button variant="primary" className="flex items-center gap-2" onClick={handleOpenCreate}>
            <Plus className="w-4 h-4" />
            Nueva Mascota
          </Button>
        </div>
      </div>

      {/* Buscador */}
      <SearchBar
        placeholder="Buscar mascota por nombre o dueno..."
        value={searchTerm}
        onChange={setSearchTerm}
        debounceMs={300}
      />

      {/* Grid de mascotas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMascotas.map((mascota) => (
          <div key={mascota.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">
                  {mascota.especie === 'Perro' ? '🐕' : '🐈'}
                </span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => navigate(`/vet/mascota/${mascota.id}`)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenEdit(mascota)}
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenDeleteConfirm(mascota)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900">{mascota.name}</h3>
            <p className="text-sm text-gray-500">{mascota.raza} - {mascota.edad}</p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">Dueno</p>
              <p className="text-sm font-medium text-gray-700">{mascota.dueno}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredMascotas.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No se encontraron mascotas
        </div>
      )}

      {/* Form Modal/Drawer */}
      <MascotaForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        mascota={selectedMascota}
        isMobile={isMobile}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmDelete}
        title="Eliminar mascota"
        message={`Estas seguro de eliminar a ${mascotaToDelete?.name}? Esta accion no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}
