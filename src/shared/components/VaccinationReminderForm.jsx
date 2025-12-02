import { useState, useEffect } from 'react';
import { Syringe, Send } from 'lucide-react';
import { useSendVaccinationReminder, useDuenos, usePetsByOwner } from '@/shared/hooks';
import Modal from './Modal';
import Button from './Button';
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

const commonVaccines = [
  'Rabia', 'Parvovirus', 'Moquillo', 'Hepatitis', 'Leptospirosis',
  'Polivalente', 'Triple Felina', 'Leucemia Felina', 'Bordetella',
];

export default function VaccinationReminderForm({
  isOpen,
  onClose,
  pet = null,
  owner = null,
  onSuccess,
  isMobile = false,
}) {
  const [selectedOwnerId, setSelectedOwnerId] = useState(owner?.id?.toString() || '');
  const [selectedPetId, setSelectedPetId] = useState(pet?.id?.toString() || '');
  const [formData, setFormData] = useState({
    nombreVacuna: '',
    fechaProgramada: '',
    notas: '',
  });

  const { data: duenos = [], isLoading: loadingDuenos } = useDuenos();
  const { data: mascotas = [], isLoading: loadingMascotas } = usePetsByOwner(selectedOwnerId || null);
  const sendReminder = useSendVaccinationReminder();

  // Reset form cuando se abre
  useEffect(() => {
    if (isOpen) {
      setSelectedOwnerId(owner?.id?.toString() || '');
      setSelectedPetId(pet?.id?.toString() || '');
      setFormData({
        nombreVacuna: '',
        fechaProgramada: '',
        notas: '',
      });
    }
  }, [isOpen, owner, pet]);

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
    if (!selectedOwner || !selectedPet || !formData.nombreVacuna) {
      return;
    }

    const dataToSend = {
      phone: selectedOwner.telefono || '',
      nombreDueno: `${selectedOwner.nombre} ${selectedOwner.apellido || ''}`.trim(),
      nombreMascota: selectedPet.nombre,
      nombreVacuna: formData.nombreVacuna,
      fechaProgramada: formData.fechaProgramada,
      notas: formData.notas,
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
      {/* Seleccionar Dueño */}
      <div className="space-y-1.5">
        <Label className="text-xs text-petcast-text-light uppercase tracking-wide">
          Dueño *
        </Label>
        <Select
          value={selectedOwnerId}
          onValueChange={(value) => setSelectedOwnerId(value)}
        >
          <SelectTrigger className="w-full rounded-xl">
            <SelectValue placeholder={loadingDuenos ? 'Cargando...' : 'Selecciona un dueño'} />
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
            <p className="text-sm text-amber-600 mt-1">Este dueño no tiene mascotas registradas</p>
          )}
        </div>
      )}

      {/* Vacuna */}
      <div className="space-y-1.5">
        <Label className="text-xs text-petcast-text-light uppercase tracking-wide">
          Vacuna *
        </Label>
        <Select
          value={formData.nombreVacuna}
          onValueChange={(value) => setFormData(prev => ({ ...prev, nombreVacuna: value }))}
        >
          <SelectTrigger className="w-full rounded-xl">
            <SelectValue placeholder="Selecciona una vacuna" />
          </SelectTrigger>
          <SelectContent>
            {commonVaccines.map((vaccine) => (
              <SelectItem key={vaccine} value={vaccine}>
                {vaccine}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Fecha programada */}
      <div className="space-y-1.5">
        <Label htmlFor="fechaProgramada" className="text-xs text-petcast-text-light uppercase tracking-wide">
          Fecha programada
        </Label>
        <Input
          id="fechaProgramada"
          name="fechaProgramada"
          type="date"
          value={formData.fechaProgramada}
          onChange={handleChange}
          className="rounded-xl"
        />
      </div>

      {/* Notas */}
      <div className="space-y-1.5">
        <Label htmlFor="notas" className="text-xs text-petcast-text-light uppercase tracking-wide">
          Notas adicionales
        </Label>
        <Textarea
          id="notas"
          name="notas"
          value={formData.notas}
          onChange={handleChange}
          placeholder="Instrucciones o notas adicionales..."
          rows={3}
          className="rounded-xl resize-none"
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
              <Syringe className="w-5 h-5 text-green-600" />
              Recordatorio de Vacunacion
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
        <div className="bg-green-100 p-2 rounded-lg">
          <Syringe className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-petcast-heading">
          Recordatorio de Vacunacion
        </h3>
      </div>
      {formContent}
    </Modal>
  );
}
