import { Navbar } from '../shared/components/layout';
import { useAuth } from '../shared/context/AuthContext';

export default function MainLayout({ children }) {
  const { user, getTabsForRole } = useAuth();
  const tabs = getTabsForRole();

  return (
    <div
      className="min-h-[100dvh] flex flex-col relative overflow-hidden"
    >
      {/* Círculos animados de fondo */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-100 h-100 bg-petcast-blue rounded-full blur-3xl opacity-40 animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-100 h-100 bg-petcast-orange rounded-full blur-3xl opacity-10 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-petcast-bg-soft rounded-full blur-3xl opacity-25 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <Navbar user={user} tabs={tabs} />

      {/* Contenido principal - se expande para llenar el espacio */}
      <main className="flex-1 flex flex-col relative z-10">
        <div className="max-w-6xl w-full mx-auto px-4 pt-6 lg:pt-4 pb-8 flex-1 flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
