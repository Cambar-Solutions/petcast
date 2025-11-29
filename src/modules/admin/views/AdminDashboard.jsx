import { ProfileCard, ProfileCardMobile, ActividadRecienteMobile } from '@/shared/components';
import { useAuth } from '@/shared/context/AuthContext';
import useIsMobile from '@/shared/hooks/useIsMobile';
import { useVeterinarios, useDuenos, useAppointments, usePets } from '@/shared/hooks';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  const { data: veterinarios = [] } = useVeterinarios();
  const { data: duenos = [] } = useDuenos();
  const { data: citas = [] } = useAppointments();
  const { data: mascotas = [] } = usePets();

  // Generar resumen de actividad del sistema
  const actividadReciente = [
    {
      id: 1,
      texto: `${veterinarios.length} veterinarios registrados`,
      tiempo: 'Total',
    },
    {
      id: 2,
      texto: `${duenos.length} dueños en el sistema`,
      tiempo: 'Total',
    },
    {
      id: 3,
      texto: `${mascotas.length} mascotas registradas`,
      tiempo: 'Total',
    },
    {
      id: 4,
      texto: `${citas.filter(c => c.estado === 'PROGRAMADA').length} citas pendientes`,
      tiempo: 'Próximas',
    },
    {
      id: 5,
      texto: `${citas.filter(c => c.estado === 'COMPLETADA').length} citas completadas`,
      tiempo: 'Histórico',
    },
  ];

  if (isMobile) {
    return (
      <div className="flex flex-col flex-1 pb-32">
        <ProfileCardMobile user={user} onLogout={logout} />
        <ActividadRecienteMobile actividad={actividadReciente} />
      </div>
    );
  }

  return (
    <ProfileCard
      user={user}
    />
  );
}
