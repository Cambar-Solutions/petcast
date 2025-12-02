import { useState, useEffect } from 'react';
import { PawPrint, Calendar, Clock, FileText, User } from 'lucide-react';
import { Modal, Button } from '@/shared/components';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
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
  mascotas = [],
  duenos = [],
  isLoading = false,
}) {
  const isEditing = !!cita;

  // Key única para forzar re-render de selects
  const formKey = cita?.id || 'new';

  const [formData, setFormData] = useState({
    mascotaId: '',
    duenoId: '',
    fecha: '',
    hora: '',
    tipo: 'Consulta',
    status: 'Pendiente',
    notas: '',
  });

  // Mascotas filtradas por dueño seleccionado
  const [mascotasFiltradas, setMascotasFiltradas] = useState([]);

  useEffect(() => {
    if (cita) {
      setFormData({
        mascotaId: cita.mascotaId?.toString() || '',
        duenoId: cita.duenoId?.toString() || '',
        fecha: cita.fecha || '',
        hora: cita.hora || '',
        tipo: cita.tipo || 'Consulta',
        status: cita.status || 'Pendiente',
        notas: cita.notas || '',
      });
    } else {
      setFormData({
        mascotaId: '',
        duenoId: '',
        fecha: '',
        hora: '',
        tipo: 'Consulta',
        status: 'Pendiente',
        notas: '',
      });
    }
  }, [cita, isOpen]);

  // Filtrar mascotas cuando cambia el dueño
  useEffect(() => {
    if (formData.duenoId) {
      const filtered = mascotas.filter(m => m.duenoId?.toString() === formData.duenoId);
      setMascotasFiltradas(filtered);
    } else {
      setMascotasFiltradas(mascotas);
    }
  }, [formData.duenoId, mascotas]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Si cambia el dueño, resetear la mascota
    if (name === 'duenoId') {
      setFormData((prev) => ({ ...prev, mascotaId: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Dueño */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          Dueño
        </Label>
        <Select
          key={`dueno-${formKey}-${formData.duenoId}`}
          value={formData.duenoId}
          onValueChange={(value) => handleSelectChange('duenoId', value)}
        >
          <SelectTrigger className="w-full rounded-xl">
            <SelectValue placeholder="Selecciona un dueño" />
          </SelectTrigger>
          <SelectContent>
            {duenos.map((dueno) => (
              <SelectItem key={dueno.id} value={dueno.id.toString()}>
                {dueno.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mascota */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <PawPrint className="w-4 h-4 text-gray-400" />
          Mascota
        </Label>
        <Select
          key={`mascota-${formKey}-${formData.mascotaId}`}
          value={formData.mascotaId}
          onValueChange={(value) => handleSelectChange('mascotaId', value)}
          disabled={!formData.duenoId}
        >
          <SelectTrigger className="w-full rounded-xl">
            <SelectValue placeholder={formData.duenoId ? "Selecciona una mascota" : "Primero selecciona un dueño"} />
          </SelectTrigger>
          <SelectContent>
            {mascotasFiltradas.map((mascota) => (
              <SelectItem key={mascota.id} value={mascota.id.toString()}>
                {mascota.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
            key={`tipo-${formKey}-${formData.tipo}`}
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
            key={`status-${formKey}-${formData.status}`}
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

      {/* Notas */}
      <div className="space-y-2">
        <Label htmlFor="notas">Notas (opcional)</Label>
        <Textarea
          id="notas"
          name="notas"
          value={formData.notas}
          onChange={handleChange}
          placeholder="Observaciones adicionales..."
          className="rounded-xl"
          rows={3}
        />
      </div>

      {!isMobile && (
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Cita'}
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
            <Button
              type="submit"
              variant="primary"
              onClick={handleSubmit}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Cita'}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Modal open={isOpen} onClose={onClose} size="md" key={formKey}>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        {isEditing ? 'Editar Cita' : 'Nueva Cita'}
      </h3>
      {formContent}
    </Modal>
  );
}
