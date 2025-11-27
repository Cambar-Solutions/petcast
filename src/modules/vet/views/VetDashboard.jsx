import { ProfileCard, ProfileCardMobile, ActividadRecienteMobile } from '@/shared/components';
import { useAuth } from '@/shared/context/AuthContext';
import useIsMobile from '@/shared/hooks/useIsMobile';

export default function VetDashboard() {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();

  const actividadReciente = [
    { id: 1, texto: 'Atendiste a Max (Labrador)', tiempo: 'Hace 1 hora' },
    { id: 2, texto: 'Actualizaste ficha de Luna', tiempo: 'Hace 3 horas' },
    { id: 3, texto: 'Programaste cita con Rocky', tiempo: 'Ayer' },
    { id: 4, texto: 'Vacunación aplicada - Bella', tiempo: 'Hace 2 días' },
    { id: 5, texto: 'Consulta de emergencia - Toby', tiempo: 'Hace 3 días' },
  ];

  if (isMobile) {
    return (
      <div className="flex flex-col flex-1 pb-24">
        <ProfileCardMobile user={user} onLogout={logout} />
        <ActividadRecienteMobile actividad={actividadReciente} />
      </div>
    );
  }

  return (
    <ProfileCard
      user={user}
      actividad={actividadReciente}
    />
  );
}
