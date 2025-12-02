import { ProfileCardMobile } from '@/shared/components';
import { useAuth } from '@/shared/context/AuthContext';

export default function OwnerDashboardMobile() {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col flex-1">
      <ProfileCardMobile user={user} onLogout={logout} />
    </div>
  );
}
