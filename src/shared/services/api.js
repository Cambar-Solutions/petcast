import axios from 'axios';

/**
 * Configuración base de los servicios del backend
 * Cada servicio corre en un puerto diferente (arquitectura SBA)
 */
const API_PORTS = {
  USER: 4201,
  PET: 4202,
  APPOINTMENT: 4203,
  STATISTICS: 4204,
};

const BASE_URL = 'http://localhost';

/**
 * Crea una instancia de axios configurada para un servicio específico
 */
const createApiInstance = (port) => {
  const instance = axios.create({
    baseURL: `${BASE_URL}:${port}/api`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Interceptor para agregar token de autenticación
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Interceptor para manejar errores de respuesta
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Si el token expiró y NO estamos en la página de login, redirigir
      if (error.response?.status === 401) {
        const isLoginPage = window.location.pathname === '/login';

        // Solo limpiar y redirigir si no estamos ya en login
        if (!isLoginPage) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Instancias de API para cada servicio
export const userApi = createApiInstance(API_PORTS.USER);
export const petApi = createApiInstance(API_PORTS.PET);
export const appointmentApi = createApiInstance(API_PORTS.APPOINTMENT);
export const statisticsApi = createApiInstance(API_PORTS.STATISTICS);

export default {
  userApi,
  petApi,
  appointmentApi,
  statisticsApi,
};
