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

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200 shadow-lg z-50 safe-area-bottom">
      <div className="flex justify-around items-center px-2 py-2">
        {tabs.map((tab) => {
          const IconComponent = iconMap[tab.icon] || Home;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md scale-105'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <IconComponent className={`w-5 h-5 ${isActive ? 'mb-1' : 'mb-0.5'}`} />
              <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
