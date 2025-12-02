import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Loader2 } from 'lucide-react';
import { Button, Title, Description, SearchBar, ConfirmDialog } from '@/shared/components';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { MascotaForm } from '../components';
import { usePets, useCreatePet, useUpdatePet, useDeletePet, useDuenos } from '@/shared/hooks';

export default function Mascotas() {
  const navigate = useNavigate();

  // Hooks de TanStack Query
  const { data: mascotas = [], isLoading, error } = usePets();
  const { data: duenos = [] } = useDuenos();
  const createPet = useCreatePet();
  const updatePet = useUpdatePet();
  const deletePet = useDeletePet();

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

  const handleSubmit = async (formData) => {
    try {
      const petData = {
        nombre: formData.nombre,
        especie: formData.especie,
        raza: formData.raza || null,
        edad: parseInt(formData.edad) || 0,
        peso: formData.peso ? parseFloat(formData.peso) : null,
        sexo: formData.sexo === 'Macho' ? 'MACHO' : 'HEMBRA',
        color: formData.color || null,
      };

      // Solo incluir duenoId si está seleccionado
      if (formData.duenoId) {
        petData.duenoId = parseInt(formData.duenoId);
      }

      if (selectedMascota) {
        await updatePet.mutateAsync({ id: selectedMascota.id, ...petData });
      } else {
        await createPet.mutateAsync(petData);
      }
      handleCloseForm();
    } catch (err) {
      console.error('Error al guardar mascota:', err);
    }
  };

  const handleOpenDeleteConfirm = (mascota) => {
    setMascotaToDelete(mascota);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (mascotaToDelete) {
      try {
        await deletePet.mutateAsync(mascotaToDelete.id);
        setMascotaToDelete(null);
        setIsConfirmOpen(false);
      } catch (err) {
        console.error('Error al eliminar mascota:', err);
      }
    }
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
    setMascotaToDelete(null);
  };

  // Mapear dueños para el formulario
  const mappedDuenos = duenos.map((d) => ({
    id: d.id,
    name: `${d.nombre} ${d.apellido}`.trim(),
    email: d.correoElectronico,
  }));

  // Función para obtener nombre del dueño
  const getDuenoName = (duenoId) => {
    const dueno = duenos.find(d => d.id === duenoId);
    return dueno ? `${dueno.nombre} ${dueno.apellido}`.trim() : 'Sin dueño';
  };

  // Mapear mascotas del backend al formato del frontend
  const mappedMascotas = mascotas.map((m) => ({
    id: m.id,
    name: m.nombre,
    nombre: m.nombre,
    especie: m.especie,
    raza: m.raza, // Mantener null/undefined para el form
    razaDisplay: m.raza || 'Sin raza', // Solo para mostrar en lista
    dueno: getDuenoName(m.duenoId),
    duenoId: m.duenoId,
    edad: m.edad ? `${m.edad} años` : 'Sin edad',
    edadNum: m.edad,
    peso: m.peso,
    sexo: m.sexo,
    color: m.color,
    codigoQR: m.codigoQR,
  }));

  const filteredMascotas = mappedMascotas.filter(
    (mascota) =>
      mascota.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mascota.dueno.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mascota.razaDisplay.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <p className="text-red-500">Error al cargar mascotas</p>
        <p className="text-gray-500 text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Title variant="page-title">Mascotas</Title>
          <Description variant="section-description" mobileText="Gestión de mascotas">
            Gestiona las mascotas registradas
          </Description>
        </div>
        <Button
          variant="circular"
          size="md-mobile"
          onClick={handleOpenCreate}
          disabled={createPet.isPending}
        >
          <Plus className="w-5 h-5 sm:w-4 sm:h-4 sm:mr-2" />
          <span className="hidden sm:inline">Nueva Mascota</span>
        </Button>
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
                  {mascota.especie === 'Perro' ? '🐕' : mascota.especie === 'Gato' ? '🐈' : '🐾'}
                </span>
              </div>
              <div className="flex gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => navigate(`/vet/mascota/${mascota.id}`)}
                      className="p-2 text-blue-500 bg-blue-50 hover:bg-blue-100 hover:scale-110 rounded-lg cursor-pointer transition-all duration-200"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ver detalles</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleOpenDeleteConfirm(mascota)}
                      className="p-2 text-red-500 bg-red-50 hover:bg-red-100 hover:scale-110 rounded-lg cursor-pointer transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Eliminar</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900">{mascota.name}</h3>
            <p className="text-sm text-gray-500">{mascota.razaDisplay} - {mascota.edad}</p>
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
        duenos={mappedDuenos}
        isLoading={createPet.isPending || updatePet.isPending}
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
        isLoading={deletePet.isPending}
      />
    </div>
  );
}
