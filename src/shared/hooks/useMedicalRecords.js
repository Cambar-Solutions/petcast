import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { petApi } from '@/shared/services/api';

/**
 * Hooks para gestionar fichas médicas
 */

// Keys para el cache de TanStack Query
const QUERY_KEYS = {
  medicalRecords: ['medicalRecords'],
  medicalRecord: (id) => ['medicalRecords', id],
  medicalRecordsByPet: (mascotaId) => ['medicalRecords', 'pet', mascotaId],
};

/**
 * Obtener todas las fichas médicas
 */
export const useMedicalRecords = () => {
  return useQuery({
    queryKey: QUERY_KEYS.medicalRecords,
    queryFn: async () => {
      const { data } = await petApi.get('/medical-records');
      return data;
    },
  });
};

/**
 * Obtener una ficha médica por ID
 */
export const useMedicalRecord = (id) => {
  return useQuery({
    queryKey: QUERY_KEYS.medicalRecord(id),
    queryFn: async () => {
      const { data } = await petApi.get(`/medical-records/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

/**
 * Obtener fichas médicas de una mascota
 */
export const useMedicalRecordsByPet = (mascotaId) => {
  return useQuery({
    queryKey: QUERY_KEYS.medicalRecordsByPet(mascotaId),
    queryFn: async () => {
      const { data } = await petApi.get(`/medical-records/pet/${mascotaId}`);
      return data;
    },
    enabled: !!mascotaId,
  });
};

/**
 * Crear una nueva ficha médica
 */
export const useCreateMedicalRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recordData) => {
      const { data } = await petApi.post('/medical-records', recordData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.medicalRecords });
      if (data.mascotaId) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.medicalRecordsByPet(data.mascotaId) });
      }
      toast.success('Ficha médica creada correctamente');
    },
    onError: (error) => {
      const backendMsg = error.response?.data?.message;
      const msgStr = Array.isArray(backendMsg) ? backendMsg[0] : backendMsg;
      const message = msgStr && typeof msgStr === 'string' && !msgStr.toLowerCase().includes('internal')
        ? msgStr
        : 'No se pudo crear la ficha médica. Intenta de nuevo.';
      toast.error(message);
    },
  });
};

/**
 * Actualizar una ficha médica
 */
export const useUpdateMedicalRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...recordData }) => {
      const { data } = await petApi.patch(`/medical-records/${id}`, recordData);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.medicalRecords });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.medicalRecord(variables.id) });
      toast.success('Ficha médica actualizada correctamente');
    },
    onError: (error) => {
      const backendMsg = error.response?.data?.message;
      const msgStr = Array.isArray(backendMsg) ? backendMsg[0] : backendMsg;
      const message = msgStr && typeof msgStr === 'string' && !msgStr.toLowerCase().includes('internal')
        ? msgStr
        : 'No se pudo actualizar la ficha médica. Intenta de nuevo.';
      toast.error(message);
    },
  });
};

/**
 * Eliminar una ficha médica
 */
export const useDeleteMedicalRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await petApi.delete(`/medical-records/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.medicalRecords });
      toast.success('Ficha médica eliminada correctamente');
    },
    onError: (error) => {
      const backendMsg = error.response?.data?.message;
      const msgStr = Array.isArray(backendMsg) ? backendMsg[0] : backendMsg;
      const message = msgStr && typeof msgStr === 'string' && !msgStr.toLowerCase().includes('internal')
        ? msgStr
        : 'No se pudo eliminar la ficha médica. Intenta de nuevo.';
      toast.error(message);
    },
  });
};
