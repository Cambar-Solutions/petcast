import { Navbar } from '../shared/components/layout';
import { useAuth } from '../shared/context/AuthContext';

export default function MainLayout({ children }) {
  const { user, getTabsForRole } = useAuth();
  const tabs = getTabsForRole();

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--gradient-petcast-bg)' }}
    >
      <Navbar user={user} tabs={tabs} />

      {/* Contenido principal con padding para el navbar inferior en mobile */}
      <main className="pb-24 lg:pb-8">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
