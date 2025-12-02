import { useState, useEffect } from 'react';
import { User, Check, Pipette } from 'lucide-react';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';

const especies = ['Perro', 'Gato', 'Ave', 'Roedor', 'Reptil', 'Otro'];
const sexos = ['Macho', 'Hembra'];

// Paleta de colores comunes para mascotas
const petColors = [
  { name: 'Negro', value: '#1a1a1a' },
  { name: 'Blanco', value: '#f5f5f5' },
  { name: 'Gris', value: '#6b7280' },
  { name: 'Cafe', value: '#8B4513' },
  { name: 'Dorado', value: '#DAA520' },
  { name: 'Crema', value: '#F5DEB3' },
  { name: 'Naranja', value: '#D2691E' },
  { name: 'Canela', value: '#D2B48C' },
  { name: 'Chocolate', value: '#5D3A1A' },
  { name: 'Beige', value: '#E8D5B7' },
  { name: 'Rojizo', value: '#A0522D' },
  { name: 'Gris claro', value: '#9CA3AF' },
];

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
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="w-full h-10 rounded-xl border border-gray-200 flex items-center gap-3 px-3 hover:border-gray-300 transition-colors"
              >
                <div
                  className="w-6 h-6 rounded-full shadow-inner"
                  style={{ backgroundColor: formData.color }}
                />
                <span className="text-sm text-petcast-text">
                  {petColors.find(c => c.value === formData.color)?.name || 'Personalizado'}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3 z-[10001]" align="start" side="top" sideOffset={8}>
              <div className="space-y-3">
                <p className="text-xs font-medium text-petcast-text-light uppercase tracking-wide">
                  Colores comunes
                </p>
                <div className="grid grid-cols-6 gap-2">
                  {petColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => handleSelectChange('color', color.value)}
                      className={`w-8 h-8 rounded-full transition-all hover:scale-110 flex items-center justify-center ${
                        formData.color === color.value ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-1'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    >
                      {formData.color === color.value && (
                        <Check className={`w-4 h-4 ${color.value === '#f5f5f5' || color.value === '#F5DEB3' || color.value === '#E8D5B7' || color.value === '#D2B48C' ? 'text-gray-700' : 'text-white'}`} />
                      )}
                    </button>
                  ))}
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs font-medium text-petcast-text-light uppercase tracking-wide mb-2">
                    Color personalizado
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input
                        type="color"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        className="w-10 h-10 rounded-lg cursor-pointer opacity-0 absolute inset-0"
                      />
                      <div
                        className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center cursor-pointer hover:border-gray-300"
                        style={{ backgroundColor: formData.color }}
                      >
                        <Pipette className={`w-4 h-4 ${['#f5f5f5', '#F5DEB3', '#E8D5B7', '#D2B48C', '#DAA520', '#9CA3AF'].includes(formData.color) ? 'text-gray-700' : 'text-white'}`} />
                      </div>
                    </div>
                    <Input
                      type="text"
                      value={formData.color}
                      onChange={(e) => handleSelectChange('color', e.target.value)}
                      className="flex-1 rounded-lg text-xs font-mono"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
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
                {dueno.name}
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
