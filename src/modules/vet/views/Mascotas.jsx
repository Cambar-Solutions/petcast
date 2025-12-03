import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { Button, Title, Description, SearchBar, ConfirmDialog } from '@/shared/components';
import { MascotaForm } from '../components';
import { usePets, useCreatePet, useUpdatePet, useDeletePet, useDuenos, useUpdatePetStatus } from '@/shared/hooks';
import { Switch } from '@/shared/components/ui/switch';

export default function Mascotas() {
  const navigate = useNavigate();

  const { data: mascotas = [], isLoading, error } = usePets();
  const { data: duenos = [] } = useDuenos();
  const createPet = useCreatePet();
  const updatePet = useUpdatePet();
  const deletePet = useDeletePet();
  const updatePetStatus = useUpdatePetStatus();

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

  const handleToggleStatus = async (mascota) => {
    const nuevoEstado = mascota.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    try {
      await updatePetStatus.mutateAsync({ id: mascota.id, estado: nuevoEstado });
    } catch (err) {
      console.error('Error al cambiar estado:', err);
    }
  };

  const mappedDuenos = duenos.map((d) => ({
    id: d.id,
    name: (d.nombre + ' ' + d.apellido).trim(),
    email: d.correoElectronico,
  }));

  const getDuenoName = (duenoId) => {
    const dueno = duenos.find(d => d.id === duenoId);
    return dueno ? (dueno.nombre + ' ' + dueno.apellido).trim() : 'Sin dueño';
  };

  const mappedMascotas = mascotas.map((m) => ({
    id: m.id,
    name: m.nombre,
    nombre: m.nombre,
    especie: m.especie,
    raza: m.raza,
    razaDisplay: m.raza || 'Sin raza',
    dueno: getDuenoName(m.duenoId),
    duenoId: m.duenoId,
    edad: m.edad ? m.edad + ' anos' : 'Sin edad',
    edadNum: m.edad,
    peso: m.peso,
    sexo: m.sexo,
    color: m.color,
    codigoQR: m.codigoQR,
    estado: m.estado || 'ACTIVO',
    ultimaVisita: m.ultimaVisita,
  }));

  const filteredMascotas = mappedMascotas.filter(
    (mascota) =>
      mascota.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mascota.dueno.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mascota.razaDisplay.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <Description variant="section-description" mobileText="Gestion de mascotas">
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

      <SearchBar
        placeholder="Buscar mascota por nombre o dueño..."
        value={searchTerm}
        onChange={setSearchTerm}
        debounceMs={300}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMascotas.map((mascota) => (
          <div
            key={mascota.id}
            className={"bg-white rounded-2xl p-4 shadow-sm border flex flex-col " + (
              mascota.estado === 'INACTIVO'
                ? 'border-red-200 bg-red-50/30'
                : 'border-gray-100'
            )}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className={"w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 " + (
                mascota.estado === 'INACTIVO'
                  ? 'bg-gradient-to-br from-gray-200 to-gray-300'
                  : 'bg-gradient-to-br from-blue-100 to-purple-100'
              )}>
                <span className={"text-2xl " + (mascota.estado === 'INACTIVO' ? 'grayscale opacity-60' : '')}>
                  {mascota.especie === 'Perro' ? '\uD83D\uDC15' : mascota.especie === 'Gato' ? '\uD83D\uDC08' : '\uD83D\uDC3E'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 truncate">{mascota.name}</h3>
                  {mascota.estado === 'INACTIVO' && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                      Inactivo
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate">{mascota.razaDisplay} - {mascota.edad}</p>
              </div>
              <button
                onClick={() => handleOpenDeleteConfirm(mascota)}
                className="p-2 text-red-500 bg-red-50 hover:bg-red-100 hover:scale-110 rounded-lg cursor-pointer transition-all duration-200 flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between py-2 px-1 mb-2 bg-gray-50 rounded-lg">
              <span className="text-xs text-gray-600">Estado</span>
              <div className="flex items-center gap-2">
                <span className={"text-xs font-medium " + (
                  mascota.estado === 'ACTIVO' ? 'text-green-600' : 'text-red-600'
                )}>
                  {mascota.estado === 'ACTIVO' ? 'Activo' : 'Inactivo'}
                </span>
                <Switch
                  checked={mascota.estado === 'ACTIVO'}
                  onCheckedChange={() => handleToggleStatus(mascota)}
                  disabled={updatePetStatus.isPending}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400">Dueño</p>
                <p className="text-sm font-medium text-gray-700 truncate">{mascota.dueno}</p>
              </div>
              <button
                onClick={() => navigate('/vet/mascota/' + mascota.id)}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium flex-shrink-0 ml-2 cursor-pointer"
              >
                Ver detalles
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMascotas.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No se encontraron mascotas
        </div>
      )}

      <MascotaForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        mascota={selectedMascota}
        isMobile={isMobile}
        duenos={mappedDuenos}
        isLoading={createPet.isPending || updatePet.isPending}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmDelete}
        title="Eliminar mascota"
        message={'Estas seguro de eliminar a ' + (mascotaToDelete?.name || '') + '? Esta accion no se puede deshacer.'}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={deletePet.isPending}
      />
    </div>
  );
}
