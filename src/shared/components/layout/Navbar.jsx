import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, PawPrint, LogOut } from 'lucide-react';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ user, tabs }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
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
        <div className="mx-auto px-4 py-2 lg:px-6">
          <nav className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-lg rounded-2xl lg:rounded-3xl mx-auto max-w-6xl">
            <div className="flex items-center justify-between h-14 lg:h-16 px-4 lg:px-6">
              {/* Logo */}
              <button
                onClick={() => navigate(tabs[0]?.path || '/')}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-9 h-9 lg:w-10 lg:h-10 bg-primary rounded-xl flex items-center justify-center">
                  <PawPrint className="w-5 h-5 lg:w-6 lg:h-6 text-primary-foreground" />
                </div>
                <span className="text-lg lg:text-xl font-bold text-gray-900 hidden sm:block">
                  PetCast
                </span>
              </button>

              {/* Navegacion desktop */}
              <DesktopNav tabs={tabs} activeTab={getActiveTab()} />

              {/* Info usuario y logout (desktop) */}
              <div className="hidden lg:flex items-center gap-3">
                {user && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="hidden xl:block max-w-[120px] truncate">{user.name}</span>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="Cerrar sesion"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>

              {/* Boton menu movil */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Menu desplegable movil */}
            {isMobileMenuOpen && (
              <div className="lg:hidden border-t border-gray-200/50 px-4 py-4">
                {user && (
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                )}
                <p className="text-xs text-gray-400 text-center">
                  Usa la barra inferior para navegar
                </p>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Navegacion movil inferior */}
      <MobileNav tabs={tabs} activeTab={getActiveTab()} />
    </>
  );
};

export default Navbar;
