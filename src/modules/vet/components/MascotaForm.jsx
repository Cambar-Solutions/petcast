import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
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

const especies = ['Perro', 'Gato', 'Ave', 'Roedor', 'Reptil', 'Otro'];
const sexos = ['Macho', 'Hembra'];

// Normalizar especie del backend a las opciones del select
const normalizeEspecie = (especie) => {
  if (!especie) return 'Perro';
  const especieLower = especie.toLowerCase();
  const found = especies.find(e => e.toLowerCase() === especieLower);
  return found || 'Otro';
};

export default function MascotaForm({
  isOpen,
  onClose,
  onSubmit,
  mascota = null,
  isMobile = false,
  duenos = [],
  isLoading = false,
}) {
  const isEditing = !!mascota;

  // Función para obtener el formData inicial
  const getInitialFormData = (mascotaData) => {
    if (!mascotaData) {
      return {
        nombre: '',
        especie: 'Perro',
        raza: '',
        edad: '',
        peso: '',
        sexo: 'Macho',
        color: '#8B4513',
        duenoId: '',
      };
    }

    // Normalizar sexo del backend
    let sexoNormalizado = 'Macho';
    if (mascotaData.sexo === 'MACHO' || mascotaData.sexo === 'Macho') {
      sexoNormalizado = 'Macho';
    } else if (mascotaData.sexo === 'HEMBRA' || mascotaData.sexo === 'Hembra') {
      sexoNormalizado = 'Hembra';
    }

    return {
      nombre: mascotaData.nombre || mascotaData.name || '',
      especie: normalizeEspecie(mascotaData.especie),
      raza: mascotaData.raza || '',
      edad: mascotaData.edadNum?.toString() || '',
      peso: mascotaData.peso?.toString() || '',
      sexo: sexoNormalizado,
      color: mascotaData.color || '#8B4513',
      duenoId: mascotaData.duenoId?.toString() || '',
    };
  };

  const [formData, setFormData] = useState(() => getInitialFormData(mascota));

  // Reset form cuando cambia mascota o se abre/cierra
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData(mascota));
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
  };

  // Key única para forzar re-render de selects
  const formKey = mascota?.id || 'new';

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
          placeholder="Ej: Max"
          className="rounded-xl"
          required
        />
      </div>

      {/* Especie */}
      <div className="space-y-1.5">
        <Label className="text-xs text-petcast-text-light uppercase tracking-wide">
          Especie
        </Label>
        <Select
          key={`especie-${formKey}-${formData.especie}`}
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

      {/* Raza */}
      <div className="space-y-1.5">
        <Label htmlFor="raza" className="text-xs text-petcast-text-light uppercase tracking-wide">
          Raza
        </Label>
        <Input
          id="raza"
          name="raza"
          type="text"
          value={formData.raza}
          onChange={handleChange}
          placeholder="Ej: Labrador, Siames, etc."
          className="rounded-xl"
        />
      </div>

      {/* Edad y Peso */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="edad" className="text-xs text-petcast-text-light uppercase tracking-wide">
            Edad (años)
          </Label>
          <Input
            id="edad"
            name="edad"
            type="number"
            min="0"
            value={formData.edad}
            onChange={handleChange}
            placeholder="Ej: 3"
            className="rounded-xl"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="peso" className="text-xs text-petcast-text-light uppercase tracking-wide">
            Peso (kg)
          </Label>
          <Input
            id="peso"
            name="peso"
            type="number"
            step="0.1"
            min="0"
            value={formData.peso}
            onChange={handleChange}
            placeholder="Ej: 15.5"
            className="rounded-xl"
          />
        </div>
      </div>

      {/* Sexo y Color */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-petcast-text-light uppercase tracking-wide">
            Sexo
          </Label>
          <Select
            key={`sexo-${formKey}-${formData.sexo}`}
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
            Color
          </Label>
          <div className="flex gap-2">
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="w-12 h-10 rounded-xl border border-petcast-bg-soft cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Dueño */}
      <div className="space-y-1.5">
        <Label className="text-xs text-petcast-text-light uppercase tracking-wide flex items-center gap-2">
          <User className="w-3 h-3" />
          Propietario
        </Label>
        <Select
          key={`dueno-${formKey}-${formData.duenoId}`}
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
      </div>

      {!isMobile && (
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? 'Guardando...' : isEditing ? 'Guardar' : 'Crear'}
          </Button>
        </div>
      )}
    </form>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose} key={formKey}>
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
            <Button
              type="submit"
              variant="primary"
              onClick={handleSubmit}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : isEditing ? 'Guardar' : 'Crear'}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Modal open={isOpen} onClose={onClose} size="md" key={formKey}>
      <h3 className="text-xl font-semibold text-petcast-heading mb-4">
        {isEditing ? 'Editar Mascota' : 'Nueva Mascota'}
      </h3>
      {formContent}
    </Modal>
  );
}
