import { useQuery } from '@tanstack/react-query';
import { statisticsApi } from '@/shared/services/api';

/**
 * Hooks para gestionar estadísticas
 */

// Keys para el cache de TanStack Query
const QUERY_KEYS = {
  statistics: ['statistics'],
  dashboard: ['statistics', 'dashboard'],
};

/**
 * Obtener todas las estadísticas
 */
export const useStatistics = () => {
  return useQuery({
    queryKey: QUERY_KEYS.statistics,
    queryFn: async () => {
      const { data } = await statisticsApi.get('/statistics');
      return data;
    },
  });
};

/**
 * Obtener resumen del dashboard
 */
export const useDashboard = () => {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard,
    queryFn: async () => {
      const { data } = await statisticsApi.get('/statistics/dashboard');
      return data;
    },
  });
};
