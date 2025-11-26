import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

// Usuarios mock para pruebas
const MOCK_USERS = [
  {
    id: 1,
    email: 'admin@petcast.com',
    password: '123456',
    name: 'Administrador',
    role: 'ADMIN',
  },
  {
    id: 2,
    email: 'vet@petcast.com',
    password: '123456',
    name: 'Dr. Carlos Veterinario',
    role: 'VET',
  },
  {
    id: 3,
    email: 'owner@petcast.com',
    password: '123456',
    name: 'Maria Gonzalez',
    role: 'OWNER',
  },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  // Login con credenciales mock
  const login = async (email, password) => {
    setLoading(true);

    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const foundUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      setLoading(false);
      return { success: true, user: userWithoutPassword };
    }

    setLoading(false);
    return { success: false, error: 'Credenciales incorrectas' };
  };

  // Logout
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  // Verificadores de rol
  const isAdmin = () => user?.role === 'ADMIN';
  const isVet = () => user?.role === 'VET';
  const isOwner = () => user?.role === 'OWNER';

  // Obtener ruta de redireccion segun rol
  const getRedirectPath = () => {
    if (!user) return '/login';

    switch (user.role) {
      case 'ADMIN':
        return '/admin';
      case 'VET':
        return '/vet';
      case 'OWNER':
        return '/owner';
      default:
        return '/login';
    }
  };

  // Obtener tabs de navegacion segun rol
  const getTabsForRole = () => {
    if (!user) return [];

    switch (user.role) {
      case 'ADMIN':
        return [
          { id: 'dashboard', label: 'Inicio', path: '/admin', icon: 'Home' },
          { id: 'veterinarios', label: 'Veterinarios', path: '/admin/veterinarios', icon: 'Users' },
          { id: 'estadisticas', label: 'Estadisticas', path: '/admin/estadisticas', icon: 'BarChart3' },
          { id: 'perfil', label: 'Perfil', path: '/admin/perfil', icon: 'User' },
        ];
      case 'VET':
        return [
          { id: 'dashboard', label: 'Inicio', path: '/vet', icon: 'Home' },
          { id: 'mascotas', label: 'Mascotas', path: '/vet/mascotas', icon: 'PawPrint' },
          { id: 'duenos', label: 'Duenos', path: '/vet/duenos', icon: 'Users' },
          { id: 'citas', label: 'Citas', path: '/vet/citas', icon: 'Calendar' },
          { id: 'perfil', label: 'Perfil', path: '/vet/perfil', icon: 'User' },
        ];
      case 'OWNER':
        return [
          { id: 'dashboard', label: 'Inicio', path: '/owner', icon: 'Home' },
          { id: 'mascotas', label: 'Mis Mascotas', path: '/owner/mascotas', icon: 'PawPrint' },
          { id: 'citas', label: 'Mis Citas', path: '/owner/citas', icon: 'Calendar' },
          { id: 'perfil', label: 'Perfil', path: '/owner/perfil', icon: 'User' },
        ];
      default:
        return [];
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    isAdmin,
    isVet,
    isOwner,
    getRedirectPath,
    getTabsForRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
