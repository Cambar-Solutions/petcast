import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin } from 'lucide-react';
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

export default function DuenoForm({
  isOpen,
  onClose,
  onSubmit,
  dueno = null,
  isMobile = false,
  isLoading = false,
}) {
  const isEditing = !!dueno;

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
  });

  useEffect(() => {
    if (dueno) {
      // Separar nombre completo en nombre y apellido
      const nameParts = (dueno.name || '').split(' ');
      const nombre = nameParts[0] || '';
      const apellido = nameParts.slice(1).join(' ') || '';

      setFormData({
        nombre: nombre,
        apellido: apellido,
        email: dueno.email || '',
        telefono: dueno.telefono || '',
        direccion: dueno.direccion || '',
      });
    } else {
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: '',
      });
    }
  }, [dueno, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre" className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            Nombre
          </Label>
          <Input
            id="nombre"
            name="nombre"
            type="text"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Maria"
            className="rounded-xl"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="apellido">Apellido</Label>
          <Input
            id="apellido"
            name="apellido"
            type="text"
            value={formData.apellido}
            onChange={handleChange}
            placeholder="Garcia"
            className="rounded-xl"
            required
          />
        </div>
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
          placeholder="maria@email.com"
          className="rounded-xl"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefono" className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-400" />
          Telefono
        </Label>
        <Input
          id="telefono"
          name="telefono"
          type="tel"
          value={formData.telefono}
          onChange={handleChange}
          placeholder="+52 123 456 7890"
          className="rounded-xl"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="direccion" className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          Direccion
        </Label>
        <Input
          id="direccion"
          name="direccion"
          type="text"
          value={formData.direccion}
          onChange={handleChange}
          placeholder="Calle 123, Ciudad"
          className="rounded-xl"
        />
      </div>

      {!isMobile && (
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Dueno'}
          </Button>
        </div>
      )}
    </form>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {isEditing ? 'Editar Dueno' : 'Nuevo Dueno'}
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {formContent}
          </div>
          <DrawerFooter>
            <Button type="button" variant="secondary" onClick={onClose} className="w-full">
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              onClick={handleSubmit}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Dueno'}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Modal open={isOpen} onClose={onClose} size="md">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        {isEditing ? 'Editar Dueno' : 'Nuevo Dueno'}
      </h3>
      {formContent}
    </Modal>
  );
}
