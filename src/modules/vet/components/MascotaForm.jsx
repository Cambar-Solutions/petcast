import { useState, useEffect } from 'react';
import { PawPrint, User, Palette, Scale, Ruler } from 'lucide-react';
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

const tiposAnimal = ['Canino', 'Felino', 'Ave', 'Roedor', 'Reptil', 'Otro'];
const sexos = ['Macho', 'Hembra'];
const tamanos = ['Muy pequeño', 'Pequeño', 'Mediano', 'Grande', 'Muy grande'];

// Mock de dueños - en producción vendría de una API o contexto
const duenosMock = [
  { id: 1, name: 'Maria Garcia', email: 'maria@email.com' },
  { id: 2, name: 'Carlos Lopez', email: 'carlos@email.com' },
  { id: 3, name: 'Ana Martinez', email: 'ana@email.com' },
  { id: 4, name: 'Pedro Sanchez', email: 'pedro@email.com' },
  { id: 5, name: 'Jonathan Ocampo Flores', email: 'jonyocampo05@gmail.com' },
];

export default function MascotaForm({
  isOpen,
  onClose,
  onSubmit,
  mascota = null,
  isMobile = false,
  duenos = duenosMock,
}) {
  const isEditing = !!mascota;

  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'Canino',
    edad: '',
    peso: '',
    sexo: 'Macho',
    tamano: 'Mediano',
    color: '#8B4513',
    colorNombre: '',
    duenoId: '',
  });

  useEffect(() => {
    if (mascota) {
      setFormData({
        nombre: mascota.nombre || mascota.name || '',
        tipo: mascota.tipo || mascota.especie || 'Canino',
        edad: mascota.edad || '',
        peso: mascota.peso || '',
        sexo: mascota.sexo || 'Macho',
        tamano: mascota.tamano || 'Mediano',
        color: mascota.color || '#8B4513',
        colorNombre: mascota.colorNombre || '',
        duenoId: mascota.duenoId?.toString() || '',
      });
    } else {
      setFormData({
        nombre: '',
        tipo: 'Canino',
        edad: '',
        peso: '',
        sexo: 'Macho',
        tamano: 'Mediano',
        color: '#8B4513',
        colorNombre: '',
        duenoId: '',
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
    // Agregar el nombre del dueño al formData para compatibilidad
    const selectedDueno = duenos.find(d => d.id.toString() === formData.duenoId);
    const dataToSubmit = {
      ...formData,
      dueno: selectedDueno?.name || '',
    };
    onSubmit(dataToSubmit);
    onClose();
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nombre */}
      <div className="space-y-1.5">
        <Label htmlFor="nombre" className="text-xs text-petcast-text-light uppercase tracking-wide">
          Nombre
        </Label>
        <Input
          id="nombre"
          name="nombre"
          type="text"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Ej: Solovino"
          className="rounded-xl"
          required
        />
      </div>

      {/* Tipo de animal */}
      <div className="space-y-1.5">
        <Label className="text-xs text-petcast-text-light uppercase tracking-wide">
          Tipo de animal
        </Label>
        <Select
          value={formData.tipo}
          onValueChange={(value) => handleSelectChange('tipo', value)}
        >
          <SelectTrigger className="w-full rounded-xl">
            <SelectValue placeholder="Selecciona" />
          </SelectTrigger>
          <SelectContent>
            {tiposAnimal.map((tipo) => (
              <SelectItem key={tipo} value={tipo}>
                {tipo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Edad y Peso */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="edad" className="text-xs text-petcast-text-light uppercase tracking-wide">
            Edad
          </Label>
          <Input
            id="edad"
            name="edad"
            type="text"
            value={formData.edad}
            onChange={handleChange}
            placeholder="Ej: 3 años"
            className="rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="peso" className="text-xs text-petcast-text-light uppercase tracking-wide">
            Peso
          </Label>
          <Input
            id="peso"
            name="peso"
            type="text"
            value={formData.peso}
            onChange={handleChange}
            placeholder="Ej: 16kg"
            className="rounded-xl"
          />
        </div>
      </div>

      {/* Sexo y Tamaño */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-petcast-text-light uppercase tracking-wide">
            Sexo
          </Label>
          <Select
            value={formData.sexo}
            onValueChange={(value) => handleSelectChange('sexo', value)}
          >
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              {sexos.map((sexo) => (
                <SelectItem key={sexo} value={sexo}>
                  {sexo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-petcast-text-light uppercase tracking-wide">
            Tamaño
          </Label>
          <Select
            value={formData.tamano}
            onValueChange={(value) => handleSelectChange('tamano', value)}
          >
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              {tamanos.map((tam) => (
                <SelectItem key={tam} value={tam}>
                  {tam}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Color */}
      <div className="space-y-1.5">
        <Label className="text-xs text-petcast-text-light uppercase tracking-wide">
          Color
        </Label>
        <div className="flex gap-3">
          <div className="relative">
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="w-12 h-10 rounded-xl border border-petcast-bg-soft cursor-pointer"
            />
          </div>
          <Input
            id="colorNombre"
            name="colorNombre"
            type="text"
            value={formData.colorNombre}
            onChange={handleChange}
            placeholder="Ej: Café, Negro, Blanco..."
            className="rounded-xl flex-1"
          />
        </div>
      </div>

      {/* Dueño - Select */}
      <div className="space-y-1.5">
        <Label className="text-xs text-petcast-text-light uppercase tracking-wide flex items-center gap-2">
          <User className="w-3 h-3" />
          Propietario
        </Label>
        <Select
          value={formData.duenoId}
          onValueChange={(value) => handleSelectChange('duenoId', value)}
        >
          <SelectTrigger className="w-full rounded-xl">
            <SelectValue placeholder="Selecciona un propietario" />
          </SelectTrigger>
          <SelectContent>
            {duenos.map((dueno) => (
              <SelectItem key={dueno.id} value={dueno.id.toString()}>
                <div className="flex flex-col">
                  <span>{dueno.name}</span>
                  <span className="text-xs text-petcast-text-light">{dueno.email}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-petcast-text-light mt-1">
          El propietario debe estar registrado previamente
        </p>
      </div>

      {!isMobile && (
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            {isEditing ? 'Guardar' : 'Crear'}
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
              {isEditing ? 'Guardar' : 'Crear'}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Modal open={isOpen} onClose={onClose} size="md">
      <h3 className="text-xl font-semibold text-petcast-heading mb-4">
        {isEditing ? 'Editar Mascota' : 'Nueva Mascota'}
      </h3>
      {formContent}
    </Modal>
  );
}
