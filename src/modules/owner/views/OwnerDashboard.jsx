import { ProfileCard, ProfileCardMobile } from '@/shared/components';
import { useAuth } from '@/shared/context/AuthContext';
import useIsMobile from '@/shared/hooks/useIsMobile';

export default function OwnerDashboard() {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex flex-col flex-1">
        <ProfileCardMobile user={user} onLogout={logout} />
      </div>
    );
  }

  return (
    <ProfileCard
      user={user}
    />
  );
}
