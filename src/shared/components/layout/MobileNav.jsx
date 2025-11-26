import { useNavigate } from 'react-router-dom';
import { Home, Users, BarChart3, User, PawPrint, Calendar } from 'lucide-react';

const iconMap = {
  Home,
  Users,
  BarChart3,
  User,
  PawPrint,
  Calendar,
};

const MobileNav = ({ tabs, activeTab }) => {
  const navigate = useNavigate();

  // Filtrar el tab de perfil (está en el navbar superior)
  const filteredTabs = tabs.filter(tab => !tab.path.includes('perfil'));

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
      <div className="mx-auto px-4 py-2 max-w-6xl">
        <nav className="bg-petcast-white/95 backdrop-blur-xl rounded-2xl animated-border">
          <div className="flex justify-around items-center px-2 py-2">
            {filteredTabs.map((tab) => {
              const IconComponent = iconMap[tab.icon] || Home;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => navigate(tab.path)}
                  className={`relative flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'text-petcast-heading'
                      : 'text-petcast-text-light hover:text-petcast-heading hover:bg-petcast-bg-soft'
                  }`}
                >
                  <IconComponent className="w-5 h-5 mb-0.5" />
                  <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                    {tab.label}
                  </span>
                  {/* Línea activa */}
                  <span
                    className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 h-0.5 bg-petcast-heading rounded-full transition-all duration-200 ${
                      isActive ? 'w-6' : 'w-0'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default MobileNav;
