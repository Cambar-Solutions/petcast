import { ProfileCard, ProfileCardMobile, ActividadRecienteMobile } from '@/shared/components';
import { useAuth } from '@/shared/context/AuthContext';
import useIsMobile from '@/shared/hooks/useIsMobile';
import { useAppointments, usePets } from '@/shared/hooks';

// Formatear tiempo relativo
const formatTiempoRelativo = (fecha) => {
  const ahora = new Date();
  const fechaCita = new Date(fecha);
  const diffMs = ahora - fechaCita;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHoras = Math.floor(diffMs / 3600000);
  const diffDias = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Justo ahora';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHoras < 24) return `Hace ${diffHoras} hora${diffHoras > 1 ? 's' : ''}`;
  if (diffDias === 1) return 'Ayer';
  if (diffDias < 7) return `Hace ${diffDias} días`;
  return fechaCita.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
};

export default function VetDashboard() {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  const { data: citas = [] } = useAppointments();
  const { data: mascotas = [] } = usePets();

  // Obtener nombre de mascota
  const getMascotaNombre = (mascotaId) => {
    const mascota = mascotas.find(m => m.id === mascotaId);
    return mascota?.nombre || 'Mascota';
  };

  // Generar actividad reciente basada en citas
  const actividadReciente = citas
    .sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora))
    .slice(0, 5)
    .map((cita) => {
      const mascotaNombre = getMascotaNombre(cita.mascotaId);
      let texto = '';

      switch (cita.estado) {
        case 'COMPLETADA':
          texto = `Atendiste a ${mascotaNombre} - ${cita.motivo}`;
          break;
        case 'CONFIRMADA':
          texto = `Cita confirmada con ${mascotaNombre}`;
          break;
        case 'PROGRAMADA':
          texto = `Cita programada: ${mascotaNombre} - ${cita.motivo}`;
          break;
        case 'CANCELADA':
          texto = `Cita cancelada: ${mascotaNombre}`;
          break;
        default:
          texto = `${cita.motivo} - ${mascotaNombre}`;
      }

      return {
        id: cita.id,
        texto,
        tiempo: formatTiempoRelativo(cita.fechaHora),
      };
    });

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
