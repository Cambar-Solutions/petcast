import { ProfileCardMobile, ActividadRecienteMobile } from '@/shared/components';
import { useAuth } from '@/shared/context/AuthContext';

export default function AdminDashboardMobile() {
  const { user, logout } = useAuth();

  const actividadReciente = [
    { id: 1, texto: 'Agregaste un nuevo veterinario', tiempo: 'Hace 2 horas' },
    { id: 2, texto: 'Actualizaste las estadísticas', tiempo: 'Hace 5 horas' },
    { id: 3, texto: 'Modificaste la configuración', tiempo: 'Ayer' },
    { id: 4, texto: 'Desactivaste cuenta de veterinario', tiempo: 'Hace 2 días' },
    { id: 5, texto: 'Generaste reporte mensual', tiempo: 'Hace 1 semana' },
  ];

  return (
    <div className="flex flex-col flex-1">
      <ProfileCardMobile user={user} onLogout={logout} />
      <ActividadRecienteMobile actividad={actividadReciente} />
    </div>
  );
}
