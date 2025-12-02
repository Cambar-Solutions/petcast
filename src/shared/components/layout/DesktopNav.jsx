import { useNavigate } from 'react-router-dom';
import { Home, Users, BarChart3, User, PawPrint, Calendar, MessageCircle, Bell } from 'lucide-react';

const iconMap = {
  Home,
  Users,
  BarChart3,
  User,
  PawPrint,
  Calendar,
  MessageCircle,
  Bell,
};

const DesktopNav = ({ tabs, activeTab }) => {
  const navigate = useNavigate();

  return (
    <div className="hidden lg:flex items-center gap-2">
      {tabs.map((tab) => {
        const IconComponent = iconMap[tab.icon] || Home;
        const isActive = activeTab === tab.id;

        return (
          <div key={tab.id} className="relative group">
            <button
              onClick={() => navigate(tab.path)}
              aria-label={tab.label}
              className={`relative p-3 transition-all duration-200 flex flex-col items-center cursor-pointer rounded-xl ${
                isActive
                  ? 'animated-border'
                  : 'text-petcast-text hover:text-petcast-heading hover:bg-petcast-bg-soft'
              }`}
            >
              <IconComponent className={`w-5 h-5 ${isActive ? 'text-petcast-orange' : ''}`} />
              {/* Linea activa con gradiente animado */}
              {isActive && (
                <span
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #D0EDFE, #7DD3FC, #F97316, #7DD3FC, #D0EDFE)',
                    backgroundSize: '300% 100%',
                    animation: 'border-flow 4s ease-in-out infinite'
                  }}
                />
              )}
            </button>
            {/* Tooltip */}
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
              {tab.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default DesktopNav;
