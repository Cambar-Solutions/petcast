import { QueryClient } from '@tanstack/react-query';

/**
 * Configuración del cliente de TanStack Query
 * - staleTime: tiempo que los datos se consideran "frescos"
 * - retry: número de reintentos en caso de error
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
