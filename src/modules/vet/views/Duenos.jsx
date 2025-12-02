import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Phone, Mail, Loader2 } from 'lucide-react';
import { Button, Title, Description, SearchBar, ConfirmDialog } from '@/shared/components';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip';
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
        // Generar contraseña: Nombre + Año actual (ej: Jonathan2025)
        const contrasenaGenerada = formData.nombre + new Date().getFullYear();
        await createUser.mutateAsync({
          ...userData,
          contrasena: contrasenaGenerada,
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
    <div className="space-y-6 pb-8">
      <div className="flex flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Title variant="page-title">Dueños</Title>
          <Description variant="section-description" mobileText="Gestión de dueños">
            Gestiona los dueños de mascotas
          </Description>
        </div>
        <Button
          variant="circular"
          size="md-mobile"
          onClick={handleOpenCreate}
          disabled={createUser.isPending}
        >
          <Plus className="w-5 h-5 sm:w-4 sm:h-4 sm:mr-2" />
          <span className="hidden sm:inline">Nuevo Dueño</span>
        </Button>
      </div>

      {/* Buscador */}
      <SearchBar
        placeholder="Buscar dueno..."
        value={searchTerm}
        onChange={setSearchTerm}
        debounceMs={300}
      />

      {/* Cards en móvil */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {filteredDuenos.map((dueno) => (
          <div key={dueno.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-semibold text-sm">
                    {dueno.name.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 text-sm truncate">{dueno.name}</p>
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700 flex-shrink-0">
                      {dueno.mascotas} 🐾
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{dueno.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                <button
                  onClick={() => handleOpenEdit(dueno)}
                  className="p-2 text-blue-500 bg-blue-50 hover:bg-blue-100 hover:scale-110 rounded-lg cursor-pointer transition-all duration-200"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenDeleteConfirm(dueno)}
                  className="p-2 text-red-500 bg-red-50 hover:bg-red-100 hover:scale-110 rounded-lg cursor-pointer transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredDuenos.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No se encontraron dueños
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
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 hidden lg:table-cell">Teléfono</th>
              <th className="text-center px-6 py-3 text-sm font-medium text-gray-500">Mascotas</th>
              <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredDuenos.map((dueno) => (
              <tr key={dueno.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-semibold text-sm">
                        {dueno.name.charAt(0)}
                      </span>
                    </div>
                    <p className="font-medium text-gray-900">{dueno.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{dueno.email}</td>
                <td className="px-6 py-4 text-gray-600 hidden lg:table-cell">{dueno.telefono}</td>
                <td className="px-6 py-4 text-center">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                    {dueno.mascotas}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleOpenEdit(dueno)}
                          className="p-2 text-blue-500 bg-blue-50 hover:bg-blue-100 hover:scale-110 rounded-lg cursor-pointer transition-all duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Editar</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleOpenDeleteConfirm(dueno)}
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredDuenos.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No se encontraron dueños
          </div>
        )}
      </div>

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
