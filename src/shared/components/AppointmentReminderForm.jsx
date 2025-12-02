import { useState, useEffect } from 'react';
import { Calendar, Send, User, PawPrint, Phone, Clock, FileText, Stethoscope, Users } from 'lucide-react';
import { useSendAppointmentReminder, useDuenos, usePetsByOwner } from '@/shared/hooks';
import { useAuth } from '@/shared/context/AuthContext';
import Card from './Card';
import Button from './Button';

export default function AppointmentReminderForm({
  appointment = null,
  pet = null,
  owner = null,
  vet = null,
  onSuccess,
  onCancel
}) {
  const { user } = useAuth();
  const [selectedOwnerId, setSelectedOwnerId] = useState(owner?.id || '');
  const [selectedPetId, setSelectedPetId] = useState(pet?.id || '');

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
    phone: owner?.telefono || '',
    nombreDueno: owner?.nombre || '',
    nombreMascota: pet?.nombre || '',
    fechaCita: appointment?.fechaHora ? formatDate(appointment.fechaHora) : '',
    horaCita: appointment?.fechaHora ? formatTime(appointment.fechaHora) : '',
    motivo: appointment?.motivo || '',
    nombreVeterinario: vet?.nombre || user?.name || '',
  });

  const { data: duenos = [], isLoading: loadingDuenos } = useDuenos();
  const { data: mascotas = [], isLoading: loadingMascotas } = usePetsByOwner(selectedOwnerId || null);
  const sendReminder = useSendAppointmentReminder();

  useEffect(() => {
    if (selectedOwnerId && duenos.length > 0) {
      const selectedOwner = duenos.find(d => d.id === parseInt(selectedOwnerId));
      if (selectedOwner) {
        setFormData(prev => ({
          ...prev,
          phone: selectedOwner.telefono || '',
          nombreDueno: (selectedOwner.nombre + ' ' + (selectedOwner.apellido || '')).trim(),
        }));
        setSelectedPetId('');
      }
    }
  }, [selectedOwnerId, duenos]);

  useEffect(() => {
    if (selectedPetId && mascotas.length > 0) {
      const selectedPet = mascotas.find(p => p.id === parseInt(selectedPetId));
      if (selectedPet) {
        setFormData(prev => ({
          ...prev,
          nombreMascota: selectedPet.nombre || '',
        }));
      }
    }
  }, [selectedPetId, mascotas]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.phone || !formData.nombreDueno || !formData.nombreMascota || !formData.fechaCita || !formData.horaCita) {
      return;
    }
    const fechaFormateada = new Date(formData.fechaCita).toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    sendReminder.mutate({
      ...formData,
      fechaCita: fechaFormateada,
    }, {
      onSuccess: (data) => {
        if (data.success && onSuccess) {
          onSuccess(data);
        }
      },
    });
  };

  return (
    <Card className="w-full max-w-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Calendar className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-petcast-heading">
          Recordatorio de Cita
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <Users className="w-4 h-4" />
            Seleccionar Dueno *
          </label>
          <select
            value={selectedOwnerId}
            onChange={(e) => setSelectedOwnerId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-petcast-heading focus:border-transparent"
            required
          >
            <option value="">
              {loadingDuenos ? 'Cargando duenos...' : 'Selecciona un dueno'}
            </option>
            {duenos.map((dueno) => (
              <option key={dueno.id} value={dueno.id}>
                {dueno.nombre} {dueno.apellido} - {dueno.telefono || 'Sin telefono'}
              </option>
            ))}
          </select>
        </div>

        {selectedOwnerId && (
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <PawPrint className="w-4 h-4" />
              Seleccionar Mascota *
            </label>
            <select
              value={selectedPetId}
              onChange={(e) => setSelectedPetId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-petcast-heading focus:border-transparent"
              required
            >
              <option value="">
                {loadingMascotas ? 'Cargando mascotas...' : 'Selecciona una mascota'}
              </option>
              {mascotas.map((mascota) => (
                <option key={mascota.id} value={mascota.id}>
                  {mascota.nombre} - {mascota.especie}
                </option>
              ))}
            </select>
            {!loadingMascotas && mascotas.length === 0 && (
              <p className="text-sm text-amber-600 mt-1">Este dueno no tiene mascotas registradas</p>
            )}
          </div>
        )}

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <Phone className="w-4 h-4" />
            Telefono del dueno *
          </label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Ej: 7771234567" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-petcast-heading focus:border-transparent" required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <User className="w-4 h-4" />
              Nombre del dueno *
            </label>
            <input type="text" name="nombreDueno" value={formData.nombreDueno} onChange={handleChange} placeholder="Nombre del propietario" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-petcast-heading focus:border-transparent" required />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <PawPrint className="w-4 h-4" />
              Nombre de la mascota *
            </label>
            <input type="text" name="nombreMascota" value={formData.nombreMascota} onChange={handleChange} placeholder="Nombre de la mascota" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-petcast-heading focus:border-transparent" required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Calendar className="w-4 h-4" />
              Fecha de cita *
            </label>
            <input type="date" name="fechaCita" value={formData.fechaCita} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-petcast-heading focus:border-transparent" required />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Clock className="w-4 h-4" />
              Hora de cita *
            </label>
            <input type="time" name="horaCita" value={formData.horaCita} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-petcast-heading focus:border-transparent" required />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <FileText className="w-4 h-4" />
            Motivo de la cita (opcional)
          </label>
          <input type="text" name="motivo" value={formData.motivo} onChange={handleChange} placeholder="Ej: Consulta general, Vacunacion, etc." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-petcast-heading focus:border-transparent" />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <Stethoscope className="w-4 h-4" />
            Nombre del veterinario (opcional)
          </label>
          <input type="text" name="nombreVeterinario" value={formData.nombreVeterinario} onChange={handleChange} placeholder="Nombre del veterinario" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-petcast-heading focus:border-transparent" />
        </div>

        <div className="flex gap-3 pt-2">
          {onCancel && (<Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>)}
          <Button type="submit" variant="primary" disabled={sendReminder.isPending} className="flex-1">
            <Send className="w-4 h-4 mr-2" />
            {sendReminder.isPending ? 'Enviando...' : 'Enviar Recordatorio'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
