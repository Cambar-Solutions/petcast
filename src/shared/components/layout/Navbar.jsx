import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import { ConfirmDialog } from '@/shared/components';
import { useAuth } from '@/shared/context/AuthContext';

const Navbar = ({ user, tabs }) => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, getRedirectPath } = useAuth();

  // Determinar el tab activo basado en la ruta actual
  const getActiveTab = () => {
    const currentPath = location.pathname;
    const activeTab = tabs.find(tab => tab.path === currentPath);
    return activeTab?.id || tabs[0]?.id;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    const profileRoute = getRedirectPath();
    navigate(profileRoute);
  };

  return (
    <>
      {/* Navbar principal - flotante */}
      <header className="sticky top-0 z-50 w-full bg-gradient-to-b from-white/80 via-white/60 to-transparent backdrop-blur-md">
        <div className="px-4 py-2 lg:px-6 lg:py-4">
          {/* Desktop layout - navbar centrado, logo izquierda, logout derecha */}
          <div className="hidden lg:flex items-center relative">
            {/* Logo - posición absoluta en la izquierda, flotando */}
            <div className="absolute left-0 flex items-center gap-3">
              <img
                src="/logopestcast.png"
                alt="PetCast Logo"
                className="w-14 h-14 object-contain"
              />
              <span className="text-2xl font-bold text-petcast-heading">
                PetCast
              </span>
            </div>

            {/* Navbar container - centrado */}
            <nav className="mx-auto bg-petcast-white/95 backdrop-blur-xl rounded-3xl animated-border">
              <div className="flex items-center h-16 px-6">
                {/* Navegacion desktop */}
                <DesktopNav tabs={tabs} activeTab={getActiveTab()} />
              </div>
            </nav>

            {/* Icono logout - posición absoluta en la derecha */}
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="absolute right-0 p-3 rounded-2xl bg-petcast-white/95 backdrop-blur-xl text-petcast-text hover:text-white hover:bg-red-500 transition-colors animated-border"
              aria-label="Cerrar sesión"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile layout */}
          <div className="lg:hidden">
            <nav className="bg-petcast-white/95 backdrop-blur-xl rounded-2xl animated-border">
              <div className="flex items-center justify-between h-14 px-4">
                {/* Logo y nombre */}
                <div className="flex items-center gap-2">
                  <img
                    src="/logopestcast.png"
                    alt="PetCast Logo"
                    className="w-9 h-9 object-contain"
                  />
                  <span className="text-lg font-bold text-petcast-heading">
                    PetCast
                  </span>
                </div>

                {/* Icono de perfil a la derecha */}
                <button
                  onClick={handleProfileClick}
                  className="p-2 rounded-xl text-petcast-text hover:bg-petcast-bg-soft transition-colors"
                  aria-label="Mi perfil"
                >
                  <User className="w-5 h-5" />
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Navegacion movil inferior */}
      <MobileNav tabs={tabs} activeTab={getActiveTab()} />

      {/* Modal de confirmación para cerrar sesión */}
      <ConfirmDialog
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Cerrar sesión"
        message="¿Estás seguro de que deseas cerrar sesión?"
        confirmText="Cerrar sesión"
        cancelText="Cancelar"
        variant="danger"
        icon={<LogOut className="w-6 h-6" />}
      />
    </>
  );
};

export default Navbar;
