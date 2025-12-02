import { useState, useEffect } from 'react';
import { Calendar, Send } from 'lucide-react';
import { useSendAppointmentReminder, useDuenos, usePetsByOwner } from '@/shared/hooks';
import { useAuth } from '@/shared/context/AuthContext';
import Modal from './Modal';
import Button from './Button';
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

export default function AppointmentReminderForm({
  isOpen,
  onClose,
  appointment = null,
  pet = null,
  owner = null,
  onSuccess,
  isMobile = false,
}) {
  const { user } = useAuth();
  const [selectedOwnerId, setSelectedOwnerId] = useState(owner?.id?.toString() || '');
  const [selectedPetId, setSelectedPetId] = useState(pet?.id?.toString() || '');

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toTimeString().slice(0, 5);
  };

  const [formData, setFormData] = useState({
    fechaCita: appointment?.fechaHora ? formatDate(appointment.fechaHora) : '',
    horaCita: appointment?.fechaHora ? formatTime(appointment.fechaHora) : '',
    motivo: appointment?.motivo || '',
  });

  const { data: duenos = [], isLoading: loadingDuenos } = useDuenos();
  const { data: mascotas = [], isLoading: loadingMascotas } = usePetsByOwner(selectedOwnerId || null);
  const sendReminder = useSendAppointmentReminder();

  // Reset form cuando se abre
  useEffect(() => {
    if (isOpen) {
      setSelectedOwnerId(owner?.id?.toString() || '');
      setSelectedPetId(pet?.id?.toString() || '');
      setFormData({
        fechaCita: appointment?.fechaHora ? formatDate(appointment.fechaHora) : '',
        horaCita: appointment?.fechaHora ? formatTime(appointment.fechaHora) : '',
        motivo: appointment?.motivo || '',
      });
    }
  }, [isOpen, owner, pet, appointment]);

  // Reset mascota cuando cambia el dueno
  useEffect(() => {
    if (selectedOwnerId) {
      setSelectedPetId('');
    }
  }, [selectedOwnerId]);

  // Obtener datos del dueno y mascota seleccionados
  const selectedOwner = duenos.find(d => d.id === parseInt(selectedOwnerId));
  const selectedPet = mascotas.find(p => p.id === parseInt(selectedPetId));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedOwner || !selectedPet || !formData.fechaCita || !formData.horaCita) {
      return;
    }

    const fechaFormateada = new Date(formData.fechaCita).toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const dataToSend = {
      phone: selectedOwner.telefono || '',
      nombreDueno: `${selectedOwner.nombre} ${selectedOwner.apellido || ''}`.trim(),
      nombreMascota: selectedPet.nombre,
      fechaCita: fechaFormateada,
      horaCita: formData.horaCita,
      motivo: formData.motivo,
      nombreVeterinario: user?.name || '',
    };

    sendReminder.mutate(dataToSend, {
      onSuccess: (data) => {
        if (data.success && onSuccess) {
          onSuccess(data);
        }
        onClose();
      },
    });
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Seleccionar Dueno */}
      <div className="space-y-1.5">
        <Label className="text-xs text-petcast-text-light uppercase tracking-wide">
          Dueno *
        </Label>
        <Select
          value={selectedOwnerId}
          onValueChange={(value) => setSelectedOwnerId(value)}
        >
          <SelectTrigger className="w-full rounded-xl">
            <SelectValue placeholder={loadingDuenos ? 'Cargando...' : 'Selecciona un dueno'} />
          </SelectTrigger>
          <SelectContent>
            {duenos.map((dueno) => (
              <SelectItem key={dueno.id} value={dueno.id.toString()}>
                {dueno.nombre} {dueno.apellido} - {dueno.telefono || 'Sin telefono'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Seleccionar Mascota */}
      {selectedOwnerId && (
        <div className="space-y-1.5">
          <Label className="text-xs text-petcast-text-light uppercase tracking-wide">
            Mascota *
          </Label>
          <Select
            value={selectedPetId}
            onValueChange={(value) => setSelectedPetId(value)}
          >
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue placeholder={loadingMascotas ? 'Cargando...' : 'Selecciona una mascota'} />
            </SelectTrigger>
            <SelectContent>
              {mascotas.map((mascota) => (
                <SelectItem key={mascota.id} value={mascota.id.toString()}>
                  {mascota.nombre} - {mascota.especie}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!loadingMascotas && mascotas.length === 0 && (
            <p className="text-sm text-amber-600 mt-1">Este dueno no tiene mascotas registradas</p>
          )}
        </div>
      )}

      {/* Fecha y Hora */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="fechaCita" className="text-xs text-petcast-text-light uppercase tracking-wide">
            Fecha de cita *
          </Label>
          <Input
            id="fechaCita"
            name="fechaCita"
            type="date"
            value={formData.fechaCita}
            onChange={handleChange}
            className="rounded-xl"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="horaCita" className="text-xs text-petcast-text-light uppercase tracking-wide">
            Hora de cita *
          </Label>
          <Input
            id="horaCita"
            name="horaCita"
            type="time"
            value={formData.horaCita}
            onChange={handleChange}
            className="rounded-xl"
            required
          />
        </div>
      </div>

      {/* Motivo */}
      <div className="space-y-1.5">
        <Label htmlFor="motivo" className="text-xs text-petcast-text-light uppercase tracking-wide">
          Motivo de la cita
        </Label>
        <Input
          id="motivo"
          name="motivo"
          type="text"
          value={formData.motivo}
          onChange={handleChange}
          placeholder="Ej: Consulta general, Vacunacion, etc."
          className="rounded-xl"
        />
      </div>

      {!isMobile && (
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={sendReminder.isPending}>
            <Send className="w-4 h-4 mr-2" />
            {sendReminder.isPending ? 'Enviando...' : 'Enviar'}
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
            <DrawerTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Recordatorio de Cita
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
              disabled={sendReminder.isPending}
            >
              <Send className="w-4 h-4 mr-2" />
              {sendReminder.isPending ? 'Enviando...' : 'Enviar'}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Modal open={isOpen} onClose={onClose} size="md">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Calendar className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-petcast-heading">
          Recordatorio de Cita
        </h3>
      </div>
      {formContent}
    </Modal>
  );
}
