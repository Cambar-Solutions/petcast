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
}) {
  const isEditing = !!dueno;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telefono: '',
    direccion: '',
  });

  useEffect(() => {
    if (dueno) {
      setFormData({
        name: dueno.name || '',
        email: dueno.email || '',
        telefono: dueno.telefono || '',
        direccion: dueno.direccion || '',
      });
    } else {
      setFormData({
        name: '',
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
          placeholder="Maria Garcia"
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
          <Button type="submit" variant="primary">
            {isEditing ? 'Guardar Cambios' : 'Crear Dueno'}
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
            <Button type="submit" variant="primary" onClick={handleSubmit} className="w-full">
              {isEditing ? 'Guardar Cambios' : 'Crear Dueno'}
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
