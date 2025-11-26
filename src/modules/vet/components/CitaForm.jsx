import { useState, useEffect } from 'react';
import { PawPrint, Calendar, Clock, FileText } from 'lucide-react';
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

const tiposCita = ['Consulta', 'Vacunacion', 'Revision', 'Cirugia', 'Desparasitacion', 'Emergencia'];
const statusOptions = ['Pendiente', 'Confirmada', 'Cancelada', 'Completada'];

export default function CitaForm({
  isOpen,
  onClose,
  onSubmit,
  cita = null,
  isMobile = false,
}) {
  const isEditing = !!cita;

  const [formData, setFormData] = useState({
    mascota: '',
    dueno: '',
    fecha: '',
    hora: '',
    tipo: 'Consulta',
    status: 'Pendiente',
    notas: '',
  });

  useEffect(() => {
    if (cita) {
      setFormData({
        mascota: cita.mascota || '',
        dueno: cita.dueno || '',
        fecha: cita.fecha || '',
        hora: cita.hora || '',
        tipo: cita.tipo || 'Consulta',
        status: cita.status || 'Pendiente',
        notas: cita.notas || '',
      });
    } else {
      setFormData({
        mascota: '',
        dueno: '',
        fecha: '',
        hora: '',
        tipo: 'Consulta',
        status: 'Pendiente',
        notas: '',
      });
    }
  }, [cita, isOpen]);

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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mascota" className="flex items-center gap-2">
            <PawPrint className="w-4 h-4 text-gray-400" />
            Mascota
          </Label>
          <Input
            id="mascota"
            name="mascota"
            type="text"
            value={formData.mascota}
            onChange={handleChange}
            placeholder="Max"
            className="rounded-xl"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueno">Dueno</Label>
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fecha" className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            Fecha
          </Label>
          <Input
            id="fecha"
            name="fecha"
            type="date"
            value={formData.fecha}
            onChange={handleChange}
            className="rounded-xl"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hora" className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            Hora
          </Label>
          <Input
            id="hora"
            name="hora"
            type="time"
            value={formData.hora}
            onChange={handleChange}
            className="rounded-xl"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" />
            Tipo de cita
          </Label>
          <Select
            value={formData.tipo}
            onValueChange={(value) => handleSelectChange('tipo', value)}
          >
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              {tiposCita.map((tipo) => (
                <SelectItem key={tipo} value={tipo}>
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Estado</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleSelectChange('status', value)}
          >
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!isMobile && (
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            {isEditing ? 'Guardar Cambios' : 'Crear Cita'}
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
              {isEditing ? 'Editar Cita' : 'Nueva Cita'}
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
              {isEditing ? 'Guardar Cambios' : 'Crear Cita'}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Modal open={isOpen} onClose={onClose} size="md">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        {isEditing ? 'Editar Cita' : 'Nueva Cita'}
      </h3>
      {formContent}
    </Modal>
  );
}
