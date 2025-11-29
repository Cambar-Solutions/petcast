import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Phone, Mail, Loader2 } from 'lucide-react';
import { Button, SearchBar, ConfirmDialog } from '@/shared/components';
import { DuenoForm } from '../components';
import { useDuenos, useCreateUser, useUpdateUser, useDeleteUser, usePets } from '@/shared/hooks';

export default function Duenos() {
  // Hooks de TanStack Query
  const { data: duenos = [], isLoading, error } = useDuenos();
  const { data: mascotas = [] } = usePets();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDueno, setSelectedDueno] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [duenoToDelete, setDuenoToDelete] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleOpenCreate = () => {
    setSelectedDueno(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (dueno) => {
    setSelectedDueno(dueno);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedDueno(null);
  };

  const handleSubmit = async (formData) => {
    try {
      const userData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        correoElectronico: formData.email,
        telefono: formData.telefono,
        direccion: formData.direccion || null,
      };

      if (selectedDueno) {
        await updateUser.mutateAsync({ id: selectedDueno.id, ...userData });
      } else {
        await createUser.mutateAsync({
          ...userData,
          contrasena: '123456',
          rol: 'DUENO',
          estado: 'ACTIVO',
        });
      }
      handleCloseForm();
    } catch (err) {
      console.error('Error al guardar dueño:', err);
    }
  };

  const handleOpenDeleteConfirm = (dueno) => {
    setDuenoToDelete(dueno);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (duenoToDelete) {
      try {
        await deleteUser.mutateAsync(duenoToDelete.id);
        setDuenoToDelete(null);
        setIsConfirmOpen(false);
      } catch (err) {
        console.error('Error al eliminar dueño:', err);
      }
    }
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
    setDuenoToDelete(null);
  };

  // Contar mascotas por dueño
  const countMascotasByDueno = (duenoId) => {
    return mascotas.filter(m => m.duenoId === duenoId).length;
  };

  // Mapear datos del backend al frontend
  const mappedDuenos = duenos.map((d) => ({
    id: d.id,
    name: `${d.nombre} ${d.apellido}`.trim(),
    email: d.correoElectronico,
    telefono: d.telefono || 'Sin teléfono',
    direccion: d.direccion,
    mascotas: countMascotasByDueno(d.id),
  }));

  const filteredDuenos = mappedDuenos.filter(
    (dueno) =>
      dueno.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dueno.email.toLowerCase().includes(searchTerm.toLowerCase())
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
        <p className="text-red-500">Error al cargar dueños</p>
        <p className="text-gray-500 text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Duenos</h1>
          <p className="text-gray-600">Gestiona los duenos de mascotas</p>
        </div>
        <Button
          variant="primary"
          className="flex items-center gap-2"
          onClick={handleOpenCreate}
          disabled={createUser.isPending}
        >
          <Plus className="w-4 h-4" />
          Nuevo Dueno
        </Button>
      </div>

      {/* Buscador */}
      <SearchBar
        placeholder="Buscar dueno..."
        value={searchTerm}
        onChange={setSearchTerm}
        debounceMs={300}
      />

      {/* Lista de duenos */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {filteredDuenos.map((dueno) => (
            <div key={dueno.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium text-gray-700">
                    {dueno.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900">{dueno.name}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {dueno.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {dueno.telefono}
                    </span>
                  </div>
                </div>
                <div className="text-center px-3">
                  <p className="text-lg font-semibold text-gray-900">{dueno.mascotas}</p>
                  <p className="text-xs text-gray-500">mascotas</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleOpenEdit(dueno)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenDeleteConfirm(dueno)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredDuenos.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No se encontraron duenos
        </div>
      )}

      {/* Form Modal/Drawer */}
      <DuenoForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        dueno={selectedDueno}
        isMobile={isMobile}
        isLoading={createUser.isPending || updateUser.isPending}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmDelete}
        title="Eliminar dueno"
        message={`Estas seguro de eliminar a ${duenoToDelete?.name}? Esta accion no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={deleteUser.isPending}
      />
    </div>
  );
}
