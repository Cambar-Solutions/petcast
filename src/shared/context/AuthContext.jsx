import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { userApi } from '@/shared/services/api';

const AuthContext = createContext(null);

/**
 * Mapeo de roles del backend al frontend
 * Backend: ADMINISTRADOR, VETERINARIO, DUENO
 * Frontend: ADMIN, VET, OWNER
 */
const mapRoleFromBackend = (backendRole) => {
  const roleMap = {
    ADMINISTRADOR: 'ADMIN',
    VETERINARIO: 'VET',
    DUENO: 'OWNER',
  };
  return roleMap[backendRole] || backendRole;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar si hay una sesion guardada al cargar
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('accessToken');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Login con API real
  const login = async (email, password) => {
    setLoading(true);

    try {
      const { data } = await userApi.post('/auth/login', {
        correoElectronico: email,
        contrasena: password,
      });

      // Mapear datos del usuario del backend al formato del frontend
      const userData = {
        id: data.user.id,
        email: data.user.correoElectronico,
        name: `${data.user.nombre} ${data.user.apellido}`,
        role: mapRoleFromBackend(data.user.rol),
      };

      // Guardar tokens y usuario en localStorage
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);
      setLoading(false);

      toast.success(`Bienvenido, ${userData.name}`);
      return { success: true, user: userData };
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || 'Credenciales incorrectas';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Sesión cerrada correctamente');
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
          { id: 'veterinarios', label: 'Veterinarios', path: '/admin/veterinarios', icon: 'Users' },
          { id: 'perfil', label: 'Perfil', path: '/admin', icon: 'Home' },
          { id: 'estadisticas', label: 'Estadisticas', path: '/admin/estadisticas', icon: 'BarChart3' },
        ];
      case 'VET':
        return [
          { id: 'mascotas', label: 'Mascotas', path: '/vet/mascotas', icon: 'PawPrint' },
          { id: 'duenos', label: 'Duenos', path: '/vet/duenos', icon: 'Users' },
          { id: 'perfil', label: 'Perfil', path: '/vet', icon: 'Home' },
          { id: 'citas', label: 'Citas', path: '/vet/citas', icon: 'Calendar' },
        ];
      case 'OWNER':
        return [
          { id: 'mascotas', label: 'Mis Mascotas', path: '/owner/mascotas', icon: 'PawPrint' },
          { id: 'perfil', label: 'Perfil', path: '/owner', icon: 'Home' },
          { id: 'citas', label: 'Mis Citas', path: '/owner/citas', icon: 'Calendar' },
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
