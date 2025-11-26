import { useState, useEffect } from 'react';
import { User, Mail, Stethoscope, ToggleLeft } from 'lucide-react';
import { Modal, Button } from '@/shared/components';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/shared/components/ui/drawer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

const especialidades = [
  'General',
  'Cirugia',
  'Dermatologia',
  'Cardiologia',
  'Oftalmologia',
  'Neurologia',
  'Oncologia',
];

export default function VeterinarioForm({
  isOpen,
  onClose,
  onSubmit,
  veterinario = null,
  isMobile = false,
}) {
  const isEditing = !!veterinario;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    especialidad: 'General',
    status: 'Activo',
  });

  useEffect(() => {
    if (veterinario) {
      setFormData({
        name: veterinario.name || '',
        email: veterinario.email || '',
        especialidad: veterinario.especialidad || 'General',
        status: veterinario.status || 'Activo',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        especialidad: 'General',
        status: 'Activo',
      });
    }
  }, [veterinario, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          Nombre completo
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Dr. Juan Perez"
          className="rounded-xl"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-400" />
          Correo electronico
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="juan@petcast.com"
          className="rounded-xl"
          required
        />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-gray-400" />
          Especialidad
        </Label>
        <Select
          value={formData.especialidad}
          onValueChange={(value) => handleSelectChange('especialidad', value)}
        >
          <SelectTrigger className="w-full rounded-xl">
            <SelectValue placeholder="Selecciona una especialidad" />
          </SelectTrigger>
          <SelectContent>
            {especialidades.map((esp) => (
              <SelectItem key={esp} value={esp}>
                {esp}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <ToggleLeft className="w-4 h-4 text-gray-400" />
          Estado
        </Label>
        <Select
          value={formData.status}
          onValueChange={(value) => handleSelectChange('status', value)}
        >
          <SelectTrigger className="w-full rounded-xl">
            <SelectValue placeholder="Selecciona un estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Activo">Activo</SelectItem>
            <SelectItem value="Inactivo">Inactivo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!isMobile && (
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            {isEditing ? 'Guardar Cambios' : 'Crear Veterinario'}
          </Button>
        </div>
      )}
    </form>
  );

  // Mobile: Drawer
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {isEditing ? 'Editar Veterinario' : 'Nuevo Veterinario'}
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {formContent}
          </div>
          <DrawerFooter>
            <Button type="button" variant="secondary" onClick={onClose} className="w-full">
              Cancelar
            </Button>
            <Button type="submit" variant="primary" onClick={handleSubmit} className="w-full">
              {isEditing ? 'Guardar Cambios' : 'Crear Veterinario'}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop: Modal
  return (
    <Modal open={isOpen} onClose={onClose} size="md">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        {isEditing ? 'Editar Veterinario' : 'Nuevo Veterinario'}
      </h3>
      {formContent}
    </Modal>
  );
}
