import axios from 'axios';

/**
 * Configuración base de los servicios del backend
 * Cada servicio corre en un dominio diferente (arquitectura SBA)
 */
const API_URLS = {
  USER: 'https://api.user.blocki.tech',
  PET: 'https://api.pet.blocki.tech',
  APPOINTMENT: 'https://api.appointment.blocki.tech',
  STATISTICS: 'https://api.stat.blocki.tech',
};

/**
 * Crea una instancia de axios configurada para un servicio específico
 */
const createApiInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
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
export const userApi = createApiInstance(API_URLS.USER);
export const petApi = createApiInstance(API_URLS.PET);
export const appointmentApi = createApiInstance(API_URLS.APPOINTMENT);
export const statisticsApi = createApiInstance(API_URLS.STATISTICS);

export default {
  userApi,
  petApi,
  appointmentApi,
  statisticsApi,
};
