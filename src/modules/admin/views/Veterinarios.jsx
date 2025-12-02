import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { Button, Title, Description, SearchBar, ConfirmDialog } from '@/shared/components';
import { VeterinarioForm } from '../components';
import { useVeterinarios, useCreateUser, useUpdateUser, useDeleteUser } from '@/shared/hooks';

export default function Veterinarios() {
  // Hooks de TanStack Query
  const { data: veterinarios = [], isLoading, error } = useVeterinarios();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVet, setSelectedVet] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para ConfirmDialog
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [vetToDelete, setVetToDelete] = useState(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleOpenCreate = () => {
    setSelectedVet(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (vet) => {
    setSelectedVet(vet);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedVet(null);
  };

  const handleSubmit = async (formData) => {
    try {
      const userData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        correoElectronico: formData.email,
        especialidad: formData.especialidad,
        estado: formData.status === 'Activo' ? 'ACTIVO' : 'INACTIVO',
      };

      if (selectedVet) {
        await updateUser.mutateAsync({ id: selectedVet.id, ...userData });
      } else {
        await createUser.mutateAsync({
          ...userData,
          contrasena: '123456',
          rol: 'VETERINARIO',
        });
      }
      handleCloseForm();
    } catch (err) {
      console.error('Error al guardar veterinario:', err);
    }
  };

  const handleOpenDeleteConfirm = (vet) => {
    setVetToDelete(vet);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (vetToDelete) {
      try {
        await deleteUser.mutateAsync(vetToDelete.id);
        setVetToDelete(null);
        setIsConfirmOpen(false);
      } catch (err) {
        console.error('Error al eliminar veterinario:', err);
      }
    }
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
    setVetToDelete(null);
  };

  // Mapear datos del backend al formato del frontend para mostrar
  const mappedVeterinarios = veterinarios.map((vet) => ({
    id: vet.id,
    name: `${vet.nombre} ${vet.apellido}`.trim(),
    email: vet.correoElectronico,
    especialidad: vet.especialidad || 'General',
    status: vet.estado === 'ACTIVO' ? 'Activo' : 'Inactivo',
  }));

  const filteredVets = mappedVeterinarios.filter(
    (vet) =>
      vet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vet.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vet.especialidad.toLowerCase().includes(searchTerm.toLowerCase())
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
        <p className="text-red-500">Error al cargar veterinarios</p>
        <p className="text-gray-500 text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Title variant="page-title">Veterinarios</Title>
          <Description variant="section-description" mobileText="Gestión de veterinarios">
            Gestiona los veterinarios de tu clinica
          </Description>
        </div>
        <Button
          variant="circular"
          size="md-mobile"
          onClick={handleOpenCreate}
          disabled={createUser.isPending}
        >
          <Plus className="w-5 h-5 sm:w-4 sm:h-4 sm:mr-2" />
          <span className="hidden sm:inline">Nuevo Veterinario</span>
        </Button>
      </div>

      {/* Buscador */}
      <SearchBar
        placeholder="Buscar veterinario..."
        value={searchTerm}
        onChange={setSearchTerm}
        debounceMs={300}
      />

      {/* Cards en móvil */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {filteredVets.map((vet) => (
          <div key={vet.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-sm">
                    {vet.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 text-sm truncate">{vet.name}</p>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ${
                      vet.status === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {vet.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{vet.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                <button
                  onClick={() => handleOpenEdit(vet)}
                  className="p-2 text-blue-500 bg-blue-50 hover:bg-blue-100 hover:scale-110 rounded-lg cursor-pointer transition-all duration-200"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenDeleteConfirm(vet)}
                  className="p-2 text-red-500 bg-red-50 hover:bg-red-100 hover:scale-110 rounded-lg cursor-pointer transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredVets.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No se encontraron veterinarios
          </div>
        )}
      </div>

      {/* Tabla en desktop */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Nombre</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Email</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 hidden lg:table-cell">Especialidad</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
              <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredVets.map((vet) => (
              <tr key={vet.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{vet.name}</p>
                </td>
                <td className="px-6 py-4 text-gray-600">{vet.email}</td>
                <td className="px-6 py-4 text-gray-600 hidden lg:table-cell">{vet.especialidad}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    vet.status === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {vet.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(vet)}
                      className="p-2 text-blue-500 bg-blue-50 hover:bg-blue-100 hover:scale-110 rounded-lg cursor-pointer transition-all duration-200"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteConfirm(vet)}
                      className="p-2 text-red-500 bg-red-50 hover:bg-red-100 hover:scale-110 rounded-lg cursor-pointer transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredVets.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No se encontraron veterinarios
          </div>
        )}
      </div>

      {/* Form Modal/Drawer */}
      <VeterinarioForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        veterinario={selectedVet}
        isMobile={isMobile}
        isLoading={createUser.isPending || updateUser.isPending}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmDelete}
        title="Eliminar veterinario"
        message={`¿Estás seguro de eliminar a ${vetToDelete?.name}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={deleteUser.isPending}
      />
    </div>
  );
}
