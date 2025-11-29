import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { userApi } from '@/shared/services/api';

/**
 * Hooks para gestionar usuarios (veterinarios y dueños)
 */

// Keys para el cache de TanStack Query
const QUERY_KEYS = {
  users: ['users'],
  veterinarios: ['users', 'veterinarios'],
  duenos: ['users', 'duenos'],
  user: (id) => ['users', id],
};

/**
 * Obtener todos los usuarios
 */
export const useUsers = () => {
  return useQuery({
    queryKey: QUERY_KEYS.users,
    queryFn: async () => {
      const { data } = await userApi.get('/users');
      return data;
    },
  });
};

/**
 * Obtener todos los veterinarios
 */
export const useVeterinarios = () => {
  return useQuery({
    queryKey: QUERY_KEYS.veterinarios,
    queryFn: async () => {
      const { data } = await userApi.get('/users/veterinarios');
      return data;
    },
  });
};

/**
 * Obtener todos los dueños
 */
export const useDuenos = () => {
  return useQuery({
    queryKey: QUERY_KEYS.duenos,
    queryFn: async () => {
      const { data } = await userApi.get('/users/duenos');
      return data;
    },
  });
};

/**
 * Obtener un usuario por ID
 */
export const useUser = (id) => {
  return useQuery({
    queryKey: QUERY_KEYS.user(id),
    queryFn: async () => {
      const { data } = await userApi.get(`/users/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

/**
 * Crear un nuevo usuario
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData) => {
      const { data } = await userApi.post('/users', userData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.veterinarios });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.duenos });
      toast.success('Usuario creado correctamente');
    },
    onError: (error) => {
      const backendMsg = error.response?.data?.message;
      const msgStr = Array.isArray(backendMsg) ? backendMsg[0] : backendMsg;
      const message = msgStr && typeof msgStr === 'string' && !msgStr.toLowerCase().includes('internal')
        ? msgStr
        : 'No se pudo crear el usuario. Intenta de nuevo.';
      toast.error(message);
    },
  });
};

/**
 * Actualizar un usuario
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...userData }) => {
      const { data } = await userApi.patch(`/users/${id}`, userData);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.veterinarios });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.duenos });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user(variables.id) });
      toast.success('Usuario actualizado correctamente');
    },
    onError: (error) => {
      const backendMsg = error.response?.data?.message;
      const msgStr = Array.isArray(backendMsg) ? backendMsg[0] : backendMsg;
      const message = msgStr && typeof msgStr === 'string' && !msgStr.toLowerCase().includes('internal')
        ? msgStr
        : 'No se pudo actualizar el usuario. Intenta de nuevo.';
      toast.error(message);
    },
  });
};

/**
 * Eliminar un usuario
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await userApi.delete(`/users/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.veterinarios });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.duenos });
      toast.success('Usuario eliminado correctamente');
    },
    onError: (error) => {
      const backendMsg = error.response?.data?.message;
      const msgStr = Array.isArray(backendMsg) ? backendMsg[0] : backendMsg;
      const message = msgStr && typeof msgStr === 'string' && !msgStr.toLowerCase().includes('internal')
        ? msgStr
        : 'No se pudo eliminar el usuario. Intenta de nuevo.';
      toast.error(message);
    },
  });
};
