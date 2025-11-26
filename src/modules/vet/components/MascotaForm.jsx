import { useState, useEffect } from 'react';
import { PawPrint, User, Palette, Calendar } from 'lucide-react';
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

const especies = ['Perro', 'Gato', 'Ave', 'Conejo', 'Hamster', 'Otro'];

export default function MascotaForm({
  isOpen,
  onClose,
  onSubmit,
  mascota = null,
  isMobile = false,
}) {
  const isEditing = !!mascota;

  const [formData, setFormData] = useState({
    name: '',
    especie: 'Perro',
    raza: '',
    edad: '',
    color: '',
    dueno: '',
  });

  useEffect(() => {
    if (mascota) {
      setFormData({
        name: mascota.name || '',
        especie: mascota.especie || 'Perro',
        raza: mascota.raza || '',
        edad: mascota.edad || '',
        color: mascota.color || '',
        dueno: mascota.dueno || '',
      });
    } else {
      setFormData({
        name: '',
        especie: 'Perro',
        raza: '',
        edad: '',
        color: '',
        dueno: '',
      });
    }
  }, [mascota, isOpen]);

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
          <PawPrint className="w-4 h-4 text-gray-400" />
          Nombre
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Max"
          className="rounded-xl"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            Especie
          </Label>
          <Select
            value={formData.especie}
            onValueChange={(value) => handleSelectChange('especie', value)}
          >
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              {especies.map((esp) => (
                <SelectItem key={esp} value={esp}>
                  {esp}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="raza">Raza</Label>
          <Input
            id="raza"
            name="raza"
            type="text"
            value={formData.raza}
            onChange={handleChange}
            placeholder="Labrador"
            className="rounded-xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edad" className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            Edad
          </Label>
          <Input
            id="edad"
            name="edad"
            type="text"
            value={formData.edad}
            onChange={handleChange}
            placeholder="3 anos"
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="color" className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-gray-400" />
            Color
          </Label>
          <Input
            id="color"
            name="color"
            type="text"
            value={formData.color}
            onChange={handleChange}
            placeholder="Dorado"
            className="rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueno" className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          Dueno
        </Label>
        <Input
          id="dueno"
          name="dueno"
          type="text"
          value={formData.dueno}
          onChange={handleChange}
          placeholder="Maria Garcia"
          className="rounded-xl"
          required
        />
      </div>

      {!isMobile && (
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            {isEditing ? 'Guardar Cambios' : 'Crear Mascota'}
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
              {isEditing ? 'Editar Mascota' : 'Nueva Mascota'}
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
              {isEditing ? 'Guardar Cambios' : 'Crear Mascota'}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Modal open={isOpen} onClose={onClose} size="md">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        {isEditing ? 'Editar Mascota' : 'Nueva Mascota'}
      </h3>
      {formContent}
    </Modal>
  );
}
