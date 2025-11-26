import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Search } from 'lucide-react';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import ProfileSheet from '../ProfileSheet';
import HelpSheet from '../HelpSheet';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ user, tabs }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    setIsProfileOpen(false);
    logout();
    navigate('/login');
  };

  // Determinar el tab activo basado en la ruta actual
  const getActiveTab = () => {
    const currentPath = location.pathname;
    const activeTab = tabs.find(tab => tab.path === currentPath);
    return activeTab?.id || tabs[0]?.id;
  };

  return (
    <>
      {/* Navbar principal - flotante */}
      <header className="sticky top-0 z-50 w-full">
        <div className="px-4 py-2 lg:px-6 lg:py-4">
          {/* Desktop layout - iconos afuera */}
          <div className="hidden lg:flex items-center justify-between">
            {/* Icono ayuda - izquierda */}
            <button
              onClick={() => setIsHelpOpen(true)}
              className="p-3 rounded-2xl bg-petcast-white/95 backdrop-blur-xl text-petcast-text hover:text-white hover:bg-petcast-hover transition-colors animated-border"
              title="Ayuda"
            >
              <Search className="w-6 h-6" />
            </button>

            {/* Navbar container - centro */}
            <nav className="flex-1 max-w-4xl mx-8 bg-petcast-white/95 backdrop-blur-xl rounded-3xl animated-border">
              <div className="flex items-center justify-between h-16 px-6">
                {/* Logo */}
                <button
                  onClick={() => navigate(tabs[0]?.path || '/')}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <img
                    src="/logopestcast.png"
                    alt="PetCast Logo"
                    className="w-10 h-10 object-contain"
                  />
                  <span className="text-xl font-bold text-petcast-heading">
                    PetCast
                  </span>
                </button>

                {/* Navegacion desktop */}
                <DesktopNav tabs={tabs} activeTab={getActiveTab()} />

                {/* Spacer derecho para centrar navegacion */}
                <div className="w-24" />
              </div>
            </nav>

            {/* Icono perfil - derecha */}
            {user && (
              <button
                onClick={() => setIsProfileOpen(true)}
                className="p-3 rounded-2xl bg-petcast-white/95 backdrop-blur-xl text-petcast-text hover:text-white hover:bg-petcast-hover transition-colors animated-border"
                title="Mi perfil"
              >
                <User className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Mobile layout - icono perfil dentro del navbar */}
          <div className="lg:hidden">
            <nav className="bg-petcast-white/95 backdrop-blur-xl rounded-2xl animated-border">
              <div className="flex items-center justify-between h-14 px-4">
                {/* Logo - abre sheet de ayuda en mobile */}
                <button
                  onClick={() => setIsHelpOpen(true)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <img
                    src="/logopestcast.png"
                    alt="PetCast Logo"
                    className="w-9 h-9 object-contain"
                  />
                  <span className="text-lg font-bold text-petcast-heading">
                    PetCast
                  </span>
                </button>

                {/* Icono perfil - dentro del navbar en mobile */}
                {user && (
                  <button
                    onClick={() => setIsProfileOpen(true)}
                    className="p-2 rounded-xl text-petcast-text hover:text-white hover:bg-petcast-hover transition-colors"
                    title="Mi perfil"
                  >
                    <User className="w-5 h-5" />
                  </button>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Navegacion movil inferior */}
      <MobileNav tabs={tabs} activeTab={getActiveTab()} />

      {/* Profile Sheet */}
      <ProfileSheet
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onLogout={handleLogout}
      />

      {/* Help Sheet */}
      <HelpSheet
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </>
  );
};

export default Navbar;
