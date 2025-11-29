import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { appointmentApi } from '@/shared/services/api';

/**
 * Hooks para gestionar citas
 */

// Keys para el cache de TanStack Query
const QUERY_KEYS = {
  appointments: ['appointments'],
  appointment: (id) => ['appointments', id],
  appointmentsToday: ['appointments', 'today'],
  appointmentsByStatus: (status) => ['appointments', 'status', status],
  appointmentsByPet: (mascotaId) => ['appointments', 'pet', mascotaId],
  appointmentsByOwner: (duenoId) => ['appointments', 'owner', duenoId],
  appointmentsByVet: (vetId) => ['appointments', 'vet', vetId],
};

/**
 * Obtener todas las citas
 */
export const useAppointments = () => {
  return useQuery({
    queryKey: QUERY_KEYS.appointments,
    queryFn: async () => {
      const { data } = await appointmentApi.get('/appointments');
      return data;
    },
  });
};

/**
 * Obtener una cita por ID
 */
export const useAppointment = (id) => {
  return useQuery({
    queryKey: QUERY_KEYS.appointment(id),
    queryFn: async () => {
      const { data } = await appointmentApi.get(`/appointments/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

/**
 * Obtener citas de hoy
 */
export const useAppointmentsToday = () => {
  return useQuery({
    queryKey: QUERY_KEYS.appointmentsToday,
    queryFn: async () => {
      const { data } = await appointmentApi.get('/appointments/today');
      return data;
    },
  });
};

/**
 * Obtener citas por estado
 */
export const useAppointmentsByStatus = (status) => {
  return useQuery({
    queryKey: QUERY_KEYS.appointmentsByStatus(status),
    queryFn: async () => {
      const { data } = await appointmentApi.get(`/appointments/status/${status}`);
      return data;
    },
    enabled: !!status,
  });
};

/**
 * Obtener citas de una mascota
 */
export const useAppointmentsByPet = (mascotaId) => {
  return useQuery({
    queryKey: QUERY_KEYS.appointmentsByPet(mascotaId),
    queryFn: async () => {
      const { data } = await appointmentApi.get(`/appointments/pet/${mascotaId}`);
      return data;
    },
    enabled: !!mascotaId,
  });
};

/**
 * Obtener citas de un dueño
 */
export const useAppointmentsByOwner = (duenoId) => {
  return useQuery({
    queryKey: QUERY_KEYS.appointmentsByOwner(duenoId),
    queryFn: async () => {
      const { data } = await appointmentApi.get(`/appointments/owner/${duenoId}`);
      return data;
    },
    enabled: !!duenoId,
  });
};

/**
 * Obtener citas de un veterinario
 */
export const useAppointmentsByVet = (vetId) => {
  return useQuery({
    queryKey: QUERY_KEYS.appointmentsByVet(vetId),
    queryFn: async () => {
      const { data } = await appointmentApi.get(`/appointments/vet/${vetId}`);
      return data;
    },
    enabled: !!vetId,
  });
};

/**
 * Crear una nueva cita
 */
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentData) => {
      const { data } = await appointmentApi.post('/appointments', appointmentData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Cita creada correctamente');
    },
    onError: (error) => {
      const backendMsg = error.response?.data?.message;
      const msgStr = Array.isArray(backendMsg) ? backendMsg[0] : backendMsg;
      const message = msgStr && typeof msgStr === 'string' && !msgStr.toLowerCase().includes('internal')
        ? msgStr
        : 'No se pudo crear la cita. Intenta de nuevo.';
      toast.error(message);
    },
  });
};

/**
 * Actualizar una cita
 */
export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...appointmentData }) => {
      const { data } = await appointmentApi.patch(`/appointments/${id}`, appointmentData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Cita actualizada correctamente');
    },
    onError: (error) => {
      const backendMsg = error.response?.data?.message;
      const msgStr = Array.isArray(backendMsg) ? backendMsg[0] : backendMsg;
      const message = msgStr && typeof msgStr === 'string' && !msgStr.toLowerCase().includes('internal')
        ? msgStr
        : 'No se pudo actualizar la cita. Intenta de nuevo.';
      toast.error(message);
    },
  });
};

/**
 * Confirmar una cita
 */
export const useConfirmAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await appointmentApi.patch(`/appointments/${id}/confirm`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Cita confirmada');
    },
    onError: (error) => {
      const backendMsg = error.response?.data?.message;
      const msgStr = Array.isArray(backendMsg) ? backendMsg[0] : backendMsg;
      const message = msgStr && typeof msgStr === 'string' && !msgStr.toLowerCase().includes('internal')
        ? msgStr
        : 'No se pudo confirmar la cita. Intenta de nuevo.';
      toast.error(message);
    },
  });
};

/**
 * Completar una cita
 */
export const useCompleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await appointmentApi.patch(`/appointments/${id}/complete`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Cita completada');
    },
    onError: (error) => {
      const backendMsg = error.response?.data?.message;
      const msgStr = Array.isArray(backendMsg) ? backendMsg[0] : backendMsg;
      const message = msgStr && typeof msgStr === 'string' && !msgStr.toLowerCase().includes('internal')
        ? msgStr
        : 'No se pudo completar la cita. Intenta de nuevo.';
      toast.error(message);
    },
  });
};

/**
 * Cancelar una cita
 */
export const useCancelAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await appointmentApi.patch(`/appointments/${id}/cancel`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Cita cancelada');
    },
    onError: (error) => {
      const backendMsg = error.response?.data?.message;
      const msgStr = Array.isArray(backendMsg) ? backendMsg[0] : backendMsg;
      const message = msgStr && typeof msgStr === 'string' && !msgStr.toLowerCase().includes('internal')
        ? msgStr
        : 'No se pudo cancelar la cita. Intenta de nuevo.';
      toast.error(message);
    },
  });
};

/**
 * Eliminar una cita
 */
export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await appointmentApi.delete(`/appointments/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Cita eliminada correctamente');
    },
    onError: (error) => {
      const backendMsg = error.response?.data?.message;
      const msgStr = Array.isArray(backendMsg) ? backendMsg[0] : backendMsg;
      const message = msgStr && typeof msgStr === 'string' && !msgStr.toLowerCase().includes('internal')
        ? msgStr
        : 'No se pudo eliminar la cita. Intenta de nuevo.';
      toast.error(message);
    },
  });
};
