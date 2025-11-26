import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button, SearchBar, ConfirmDialog } from '@/shared/components';
import { VeterinarioForm } from '../components';

export default function Veterinarios() {
  const [veterinarios, setVeterinarios] = useState([
    { id: 1, name: 'Dr. Carlos Martinez', email: 'carlos@petcast.com', especialidad: 'General', status: 'Activo' },
    { id: 2, name: 'Dra. Ana Lopez', email: 'ana@petcast.com', especialidad: 'Cirugia', status: 'Activo' },
    { id: 3, name: 'Dr. Pedro Sanchez', email: 'pedro@petcast.com', especialidad: 'Dermatologia', status: 'Inactivo' },
  ]);

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

  const handleSubmit = (formData) => {
    if (selectedVet) {
      // Editar
      setVeterinarios((prev) =>
        prev.map((v) => (v.id === selectedVet.id ? { ...v, ...formData } : v))
      );
    } else {
      // Crear
      const newVet = {
        id: Date.now(),
        ...formData,
      };
      setVeterinarios((prev) => [...prev, newVet]);
    }
  };

  const handleOpenDeleteConfirm = (vet) => {
    setVetToDelete(vet);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (vetToDelete) {
      setVeterinarios((prev) => prev.filter((v) => v.id !== vetToDelete.id));
      setVetToDelete(null);
    }
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
    setVetToDelete(null);
  };

  const filteredVets = veterinarios.filter(
    (vet) =>
      vet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vet.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vet.especialidad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Veterinarios</h1>
          <p className="text-gray-600">Gestiona los veterinarios de tu clinica</p>
        </div>
        <Button
          variant="primary"
          className="flex items-center gap-2"
          onClick={handleOpenCreate}
        >
          <Plus className="w-4 h-4" />
          Nuevo Veterinario
        </Button>
      </div>

      {/* Buscador */}
      <SearchBar
        placeholder="Buscar veterinario..."
        value={searchTerm}
        onChange={setSearchTerm}
        debounceMs={300}
      />

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Nombre</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 hidden md:table-cell">Email</th>
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
                    <p className="text-sm text-gray-500 md:hidden">{vet.email}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600 hidden md:table-cell">{vet.email}</td>
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
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenDeleteConfirm(vet)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmDelete}
        title="Eliminar veterinario"
        message={`Estas seguro de eliminar a ${vetToDelete?.name}? Esta accion no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}
