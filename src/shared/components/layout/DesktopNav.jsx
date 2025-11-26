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
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              isActive
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <IconComponent className="w-4 h-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default DesktopNav;
