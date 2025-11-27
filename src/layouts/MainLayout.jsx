import { Navbar } from '../shared/components/layout';
import { useAuth } from '../shared/context/AuthContext';

export default function MainLayout({ children }) {
  const { user, getTabsForRole } = useAuth();
  const tabs = getTabsForRole();

  return (
    <div
      className="min-h-[100dvh] flex flex-col"
      style={{ background: 'var(--gradient-petcast-bg)' }}
    >
      <Navbar user={user} tabs={tabs} />

      {/* Contenido principal - se expande para llenar el espacio */}
      <main className="flex-1 flex flex-col">
        <div className="max-w-6xl w-full mx-auto px-4 pt-6 lg:pt-4 pb-0 flex-1 flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
