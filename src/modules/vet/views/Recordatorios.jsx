import { useState, useEffect } from 'react';
import {
  MessageCircle,
  Syringe,
  Calendar,
  Plus,
  Send,
  Clock,
  CheckCircle
} from 'lucide-react';
import {
  WhatsappStatus,
  VaccinationReminderForm,
  AppointmentReminderForm,
  Button,
  Title,
  Description,
  FilterTabs
} from '@/shared/components';
import {
  usePendingReminders,
  useSendReminder,
  useProcessAllReminders
} from '@/shared/hooks';

export default function Recordatorios() {
  const [activeTab, setActiveTab] = useState('whatsapp');
  const [showVaccinationForm, setShowVaccinationForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { data: pendingReminders = [], isLoading } = usePendingReminders();
  const sendReminder = useSendReminder();
  const processAll = useProcessAllReminders();

  const filtros = [
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'crear', label: 'Crear' },
    { id: 'por-enviar', label: `Por Enviar${pendingReminders.length ? ` (${pendingReminders.length})` : ''}` },
  ];

  const getTipoLabel = (tipo) => {
    switch (tipo) {
      case 'CITA_PROXIMA': return 'Cita';
      case 'VACUNACION': return 'Vacuna';
      case 'REVISION': return 'Revision';
      default: return tipo;
    }
  };

  const getTipoStyles = (tipo) => {
    switch (tipo) {
      case 'CITA_PROXIMA': return 'bg-blue-100 text-blue-700';
      case 'VACUNACION': return 'bg-green-100 text-green-700';
      case 'REVISION': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Title variant="page-title">Recordatorios</Title>
          <Description variant="section-description" mobileText="Envia recordatorios">
            Conecta WhatsApp y envia recordatorios a tus clientes
          </Description>
        </div>
      </div>

      {/* Tabs */}
      <FilterTabs
        filters={filtros}
        selectedFilter={activeTab}
        onFilterChange={setActiveTab}
      />

      {/* Contenido */}
      {activeTab === 'whatsapp' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          <div className="flex justify-center">
            <WhatsappStatus />
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-blue-900 text-lg">Como funciona?</h3>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-800">Escanea el QR</p>
                  <p className="text-sm text-gray-600">Abre WhatsApp en tu celular y escanea el codigo</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-800">Conecta tu cuenta</p>
                  <p className="text-sm text-gray-600">Una vez conectado, podras enviar recordatorios</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-800">Envia mensajes</p>
                  <p className="text-sm text-gray-600">Los recordatorios se enviaran desde tu numero</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'crear' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card Vacunacion */}
          <button
            onClick={() => setShowVaccinationForm(true)}
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 shadow-sm border border-green-200 hover:shadow-md hover:scale-[1.02] transition-all duration-200 text-left w-full group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                <Syringe className="w-7 h-7 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-lg">Vacunacion</h3>
                <p className="text-sm text-gray-600 mt-0.5">
                  Recordatorio de vacunas
                </p>
              </div>
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-700 transition-colors">
                <Plus className="w-5 h-5 text-white" />
              </div>
            </div>
          </button>

          {/* Card Cita */}
          <button
            onClick={() => setShowAppointmentForm(true)}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 shadow-sm border border-blue-200 hover:shadow-md hover:scale-[1.02] transition-all duration-200 text-left w-full group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                <Calendar className="w-7 h-7 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-lg">Cita</h3>
                <p className="text-sm text-gray-600 mt-0.5">
                  Recordatorio de citas
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-700 transition-colors">
                <Plus className="w-5 h-5 text-white" />
              </div>
            </div>
          </button>
        </div>
      )}

      {activeTab === 'por-enviar' && (
        <div className="space-y-4">
          {/* Acciones */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {pendingReminders.length} recordatorio{pendingReminders.length !== 1 ? 's' : ''} pendiente{pendingReminders.length !== 1 ? 's' : ''}
            </p>
            {pendingReminders.length > 0 && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => processAll.mutate()}
                disabled={processAll.isPending}
              >
                <Send className="w-4 h-4 mr-1" />
                Enviar todos
              </Button>
            )}
          </div>

          {/* Lista de pendientes */}
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">
              Cargando...
            </div>
          ) : pendingReminders.length === 0 ? (
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="font-medium text-gray-900">Todo enviado</p>
              <p className="text-sm text-gray-500 mt-1">No hay recordatorios pendientes</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {pendingReminders.map((reminder) => (
                <div key={reminder.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-900 line-clamp-2">
                        {reminder.mensaje || `Recordatorio de ${getTipoLabel(reminder.tipo).toLowerCase()}`}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(reminder.fechaEnvio).toLocaleString('es-MX', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTipoStyles(reminder.tipo)}`}>
                      {getTipoLabel(reminder.tipo)}
                    </span>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => sendReminder.mutate(reminder.id)}
                      disabled={sendReminder.isPending}
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Enviar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Form Vacunacion */}
      <VaccinationReminderForm
        isOpen={showVaccinationForm}
        onClose={() => setShowVaccinationForm(false)}
        onSuccess={() => setShowVaccinationForm(false)}
        isMobile={isMobile}
      />

      {/* Form Cita */}
      <AppointmentReminderForm
        isOpen={showAppointmentForm}
        onClose={() => setShowAppointmentForm(false)}
        onSuccess={() => setShowAppointmentForm(false)}
        isMobile={isMobile}
      />
    </div>
  );
}
