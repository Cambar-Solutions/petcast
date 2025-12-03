import { useQuery } from '@tanstack/react-query';
import { statisticsApi } from '@/shared/services/api';

const QUERY_KEYS = {
  statistics: ['statistics'],
  dashboard: ['statistics', 'dashboard'],
  citasPorMes: ['statistics', 'citas-por-mes'],
};

export const useStatistics = () => {
  return useQuery({
    queryKey: QUERY_KEYS.statistics,
    queryFn: async () => {
      const { data } = await statisticsApi.get('/statistics');
      return data;
    },
  });
};

export const useDashboard = () => {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard,
    queryFn: async () => {
      const { data } = await statisticsApi.get('/statistics/dashboard');
      return data;
    },
  });
};

export const useCitasPorMes = () => {
  return useQuery({
    queryKey: QUERY_KEYS.citasPorMes,
    queryFn: async () => {
      const { data } = await statisticsApi.get('/statistics/citas-por-mes');
      return data;
    },
  });
};
