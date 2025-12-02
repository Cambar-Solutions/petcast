import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { petApi } from '@/shared/services/api';

/**
 * Hooks para gestionar recordatorios
 */

// Keys para el cache de TanStack Query
const QUERY_KEYS = {
  reminders: ['reminders'],
  reminder: (id) => ['reminders', id],
  remindersByOwner: (duenoId) => ['reminders', 'owner', duenoId],
  pendingReminders: ['reminders', 'pending'],
};

/**
 * Obtener todos los recordatorios
 */
export const useReminders = () => {
  return useQuery({
    queryKey: QUERY_KEYS.reminders,
    queryFn: async () => {
      const { data } = await petApi.get('/reminders');
      return data;
    },
  });
};

/**
 * Obtener recordatorios pendientes
 */
export const usePendingReminders = () => {
  return useQuery({
    queryKey: QUERY_KEYS.pendingReminders,
    queryFn: async () => {
      const { data } = await petApi.get('/reminders/pending');
      return data;
    },
  });
};

/**
 * Obtener un recordatorio por ID
 */
export const useReminder = (id) => {
  return useQuery({
    queryKey: QUERY_KEYS.reminder(id),
    queryFn: async () => {
      const { data } = await petApi.get(`/reminders/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

/**
 * Obtener recordatorios de un dueño específico
 */
export const useRemindersByOwner = (duenoId) => {
  return useQuery({
    queryKey: QUERY_KEYS.remindersByOwner(duenoId),
    queryFn: async () => {
      const { data } = await petApi.get(`/reminders/owner/${duenoId}`);
      return data;
    },
    enabled: !!duenoId,
  });
};

/**
 * Crear un nuevo recordatorio
 */
export const useCreateReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reminderData) => {
      const { data } = await petApi.post('/reminders', reminderData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reminders });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pendingReminders });
      if (data.duenoId) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.remindersByOwner(data.duenoId) });
      }
      toast.success('Recordatorio creado correctamente');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Error al crear recordatorio';
      toast.error(Array.isArray(message) ? message[0] : message);
    },
  });
};

/**
 * Actualizar un recordatorio
 */
export const useUpdateReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...reminderData }) => {
      const { data } = await petApi.patch(`/reminders/${id}`, reminderData);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reminders });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reminder(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pendingReminders });
      toast.success('Recordatorio actualizado correctamente');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Error al actualizar recordatorio';
      toast.error(Array.isArray(message) ? message[0] : message);
    },
  });
};

/**
 * Eliminar un recordatorio
 */
export const useDeleteReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await petApi.delete(`/reminders/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reminders });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pendingReminders });
      toast.success('Recordatorio eliminado correctamente');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Error al eliminar recordatorio';
      toast.error(Array.isArray(message) ? message[0] : message);
    },
  });
};

/**
 * Enviar recordatorio manualmente
 */
export const useSendReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await petApi.post(`/reminders/${id}/send`);
      return data;
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reminders });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pendingReminders });
        toast.success('Recordatorio enviado por WhatsApp');
      } else {
        toast.error(data.error || 'Error al enviar recordatorio');
      }
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Error al enviar recordatorio';
      toast.error(message);
    },
  });
};

/**
 * Enviar recordatorio de vacunación inmediato
 */
export const useSendVaccinationReminderNow = () => {
  return useMutation({
    mutationFn: async (data) => {
      const { data: response } = await petApi.post('/reminders/send-vaccination', data);
      return response;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Recordatorio de vacunación enviado por WhatsApp');
      } else {
        toast.error(data.error || 'Error al enviar recordatorio');
      }
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Error al enviar recordatorio';
      toast.error(message);
    },
  });
};

/**
 * Enviar recordatorio de cita inmediato
 */
export const useSendAppointmentReminderNow = () => {
  return useMutation({
    mutationFn: async (data) => {
      const { data: response } = await petApi.post('/reminders/send-appointment', data);
      return response;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Recordatorio de cita enviado por WhatsApp');
      } else {
        toast.error(data.error || 'Error al enviar recordatorio');
      }
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Error al enviar recordatorio';
      toast.error(message);
    },
  });
};

/**
 * Procesar todos los recordatorios pendientes
 */
export const useProcessAllReminders = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await petApi.post('/reminders/process-all');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reminders });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pendingReminders });
      toast.success('Recordatorios procesados');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Error al procesar recordatorios';
      toast.error(message);
    },
  });
};
