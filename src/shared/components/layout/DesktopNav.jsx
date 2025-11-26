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

const DesktopNav = ({ tabs, activeTab }) => {
  const navigate = useNavigate();

  return (
    <div className="hidden lg:flex items-center gap-2">
      {tabs.map((tab) => {
        const IconComponent = iconMap[tab.icon] || Home;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 flex flex-col items-center gap-1 cursor-pointer ${
              isActive
                ? 'text-petcast-heading'
                : 'text-petcast-text hover:text-petcast-heading hover:bg-petcast-bg-soft rounded-xl'
            }`}
          >
            <div className="flex items-center gap-2">
              <IconComponent className="w-4 h-4" />
              {tab.label}
            </div>
            {/* Línea activa */}
            <span
              className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-petcast-heading rounded-full transition-all duration-200 ${
                isActive ? 'w-8' : 'w-0'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default DesktopNav;
