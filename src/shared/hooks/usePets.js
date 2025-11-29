import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { petApi } from '@/shared/services/api';

/**
 * Hooks para gestionar mascotas
 */

// Keys para el cache de TanStack Query
const QUERY_KEYS = {
  pets: ['pets'],
  pet: (id) => ['pets', id],
  petsByOwner: (duenoId) => ['pets', 'owner', duenoId],
  petByQR: (codigo) => ['pets', 'qr', codigo],
};

/**
 * Obtener todas las mascotas
 */
export const usePets = () => {
  return useQuery({
    queryKey: QUERY_KEYS.pets,
    queryFn: async () => {
      const { data } = await petApi.get('/pets');
      return data;
    },
  });
};

/**
 * Obtener una mascota por ID
 */
export const usePet = (id) => {
  return useQuery({
    queryKey: QUERY_KEYS.pet(id),
    queryFn: async () => {
      const { data } = await petApi.get(`/pets/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

/**
 * Obtener mascotas de un dueño específico
 */
export const usePetsByOwner = (duenoId) => {
  return useQuery({
    queryKey: QUERY_KEYS.petsByOwner(duenoId),
    queryFn: async () => {
      const { data } = await petApi.get(`/pets/owner/${duenoId}`);
      return data;
    },
    enabled: !!duenoId,
  });
};

/**
 * Buscar mascota por código QR
 */
export const usePetByQR = (codigo) => {
  return useQuery({
    queryKey: QUERY_KEYS.petByQR(codigo),
    queryFn: async () => {
      const { data } = await petApi.get(`/pets/qr/${codigo}`);
      return data;
    },
    enabled: !!codigo,
  });
};

/**
 * Crear una nueva mascota
 */
export const useCreatePet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (petData) => {
      const { data } = await petApi.post('/pets', petData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pets });
      if (data.duenoId) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.petsByOwner(data.duenoId) });
      }
      toast.success('Mascota registrada correctamente');
    },
    onError: (error) => {
      const backendMsg = error.response?.data?.message;
      const msgStr = Array.isArray(backendMsg) ? backendMsg[0] : backendMsg;
      const message = msgStr && typeof msgStr === 'string' && !msgStr.toLowerCase().includes('internal')
        ? msgStr
        : 'No se pudo registrar la mascota. Intenta de nuevo.';
      toast.error(message);
    },
  });
};

/**
 * Actualizar una mascota
 */
export const useUpdatePet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...petData }) => {
      const { data } = await petApi.patch(`/pets/${id}`, petData);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pets });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pet(variables.id) });
      if (data.duenoId) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.petsByOwner(data.duenoId) });
      }
      toast.success('Mascota actualizada correctamente');
    },
    onError: (error) => {
      const backendMsg = error.response?.data?.message;
      const msgStr = Array.isArray(backendMsg) ? backendMsg[0] : backendMsg;
      const message = msgStr && typeof msgStr === 'string' && !msgStr.toLowerCase().includes('internal')
        ? msgStr
        : 'No se pudo actualizar la mascota. Intenta de nuevo.';
      toast.error(message);
    },
  });
};

/**
 * Eliminar una mascota
 */
export const useDeletePet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await petApi.delete(`/pets/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pets });
      toast.success('Mascota eliminada correctamente');
    },
    onError: (error) => {
      const backendMsg = error.response?.data?.message;
      const msgStr = Array.isArray(backendMsg) ? backendMsg[0] : backendMsg;
      const message = msgStr && typeof msgStr === 'string' && !msgStr.toLowerCase().includes('internal')
        ? msgStr
        : 'No se pudo eliminar la mascota. Intenta de nuevo.';
      toast.error(message);
    },
  });
};
