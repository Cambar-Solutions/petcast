import { useState } from 'react';
import {
  Bell,
  MessageCircle,
  Syringe,
  Calendar,
  Send,
  CheckCircle,
  Clock,
  RefreshCw,
  Plus
} from 'lucide-react';
import {
  WhatsappStatus,
  VaccinationReminderForm,
  AppointmentReminderForm,
  Card,
  Button,
  Title,
  Description,
  Modal
} from '@/shared/components';
import {
  usePendingReminders,
  useSendReminder,
  useProcessAllReminders
} from '@/shared/hooks';

/**
 * Vista para gestionar recordatorios y mensajes de WhatsApp
 */
export default function Recordatorios() {
  const [activeTab, setActiveTab] = useState('status');
  const [showVaccinationForm, setShowVaccinationForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);

  const { data: pendingReminders, isLoading, refetch } = usePendingReminders();
  const sendReminder = useSendReminder();
  const processAll = useProcessAllReminders();

  const getTipoLabel = (tipo) => {
    switch (tipo) {
      case 'CITA_PROXIMA':
        return 'Cita';
      case 'VACUNACION':
        return 'Vacunación';
      case 'REVISION':
        return 'Revisión';
      default:
        return tipo;
    }
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'CITA_PROXIMA':
        return <Calendar className="w-4 h-4" />;
      case 'VACUNACION':
        return <Syringe className="w-4 h-4" />;
      case 'REVISION':
        return <Clock className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getTipoBgColor = (tipo) => {
    switch (tipo) {
      case 'CITA_PROXIMA':
        return 'bg-blue-100 text-blue-700';
      case 'VACUNACION':
        return 'bg-green-100 text-green-700';
      case 'REVISION':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const tabs = [
    { id: 'status', label: 'Estado WhatsApp', icon: MessageCircle },
    { id: 'pending', label: 'Pendientes', icon: Clock },
    { id: 'send', label: 'Enviar Recordatorio', icon: Send },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title variant="page-title" className="flex items-center gap-3">
          <Bell className="w-7 h-7 text-petcast-heading" />
          Recordatorios y WhatsApp
        </Title>
        <Description variant="section-description" mobileText="Gestión de recordatorios" className="mt-1">
          Gestiona los recordatorios y mensajes de WhatsApp para tus pacientes
        </Description>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-petcast-heading text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'status' && (
          <div className="max-w-md">
            <WhatsappStatus />
          </div>
        )}

        {activeTab === 'pending' && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-petcast-heading">
                Recordatorios Pendientes
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isLoading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Actualizar
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => processAll.mutate()}
                  disabled={processAll.isPending || !pendingReminders?.length}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar todos
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                Cargando recordatorios...
              </div>
            ) : !pendingReminders?.length ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                <p>No hay recordatorios pendientes</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingReminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center gap-1 px-2 py-1 rounded text-sm font-medium ${getTipoBgColor(reminder.tipo)}`}>
                        {getTipoIcon(reminder.tipo)}
                        {getTipoLabel(reminder.tipo)}
                      </span>
                      <div>
                        <p className="font-medium text-gray-800">
                          {reminder.mensaje ?
                            (reminder.mensaje.length > 50
                              ? reminder.mensaje.substring(0, 50) + '...'
                              : reminder.mensaje)
                            : `Recordatorio de ${getTipoLabel(reminder.tipo).toLowerCase()}`
                          }
                        </p>
                        <p className="text-sm text-gray-500">
                          Programado: {new Date(reminder.fechaEnvio).toLocaleString('es-MX')}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => sendReminder.mutate(reminder.id)}
                      disabled={sendReminder.isPending}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {activeTab === 'send' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Syringe className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-petcast-heading mb-2">
                Recordatorio de Vacunación
              </h3>
              <p className="text-gray-600 mb-4">
                Envía un recordatorio a los dueños sobre la próxima vacuna de su mascota
              </p>
              <Button
                variant="primary"
                onClick={() => setShowVaccinationForm(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Recordatorio
              </Button>
            </Card>

            <Card className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-petcast-heading mb-2">
                Recordatorio de Cita
              </h3>
              <p className="text-gray-600 mb-4">
                Recuerda a los dueños sobre una cita programada próximamente
              </p>
              <Button
                variant="primary"
                onClick={() => setShowAppointmentForm(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Recordatorio
              </Button>
            </Card>
          </div>
        )}
      </div>

      {/* Modal de Formulario de Vacunación */}
      <Modal
        open={showVaccinationForm}
        onClose={() => setShowVaccinationForm(false)}
        size="lg"
      >
        <VaccinationReminderForm
          onSuccess={() => setShowVaccinationForm(false)}
          onCancel={() => setShowVaccinationForm(false)}
        />
      </Modal>

      {/* Modal de Formulario de Cita */}
      <Modal
        open={showAppointmentForm}
        onClose={() => setShowAppointmentForm(false)}
        size="lg"
      >
        <AppointmentReminderForm
          onSuccess={() => setShowAppointmentForm(false)}
          onCancel={() => setShowAppointmentForm(false)}
        />
      </Modal>
    </div>
  );
}
