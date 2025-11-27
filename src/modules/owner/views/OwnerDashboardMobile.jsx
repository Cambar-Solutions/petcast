import { ProfileCardMobile, ActividadRecienteMobile } from '@/shared/components';
import { useAuth } from '@/shared/context/AuthContext';

export default function OwnerDashboardMobile() {
  const { user, logout } = useAuth();

  const actividadReciente = [
    { id: 1, texto: 'Programaste cita para Max', tiempo: 'Hace 1 hora' },
    { id: 2, texto: 'Vacunación completada - Luna', tiempo: 'Hace 2 días' },
    { id: 3, texto: 'Revisión general - Max', tiempo: 'Hace 1 semana' },
    { id: 4, texto: 'Desparasitación - Rocky', tiempo: 'Hace 2 semanas' },
    { id: 5, texto: 'Control de peso - Luna', tiempo: 'Hace 3 semanas' },
  ];

  return (
    <div className="flex flex-col flex-1">
      <ProfileCardMobile user={user} onLogout={logout} />
      <ActividadRecienteMobile actividad={actividadReciente} />
    </div>
  );
}
