import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { petApi } from '@/shared/services/api';

/**
 * Hooks para gestionar WhatsApp
 */

// Keys para el cache de TanStack Query
const QUERY_KEYS = {
  whatsappStatus: ['whatsapp', 'status'],
  whatsappQR: ['whatsapp', 'qr'],
};

/**
 * Obtener estado de conexión de WhatsApp
 */
export const useWhatsappStatus = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.whatsappStatus,
    queryFn: async () => {
      const { data } = await petApi.get('/whatsapp/status');
      return data;
    },
    refetchInterval: 5000, // Refrescar cada 5 segundos
    ...options,
  });
};

/**
 * Obtener código QR de WhatsApp
 */
export const useWhatsappQR = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.whatsappQR,
    queryFn: async () => {
      const { data } = await petApi.get('/whatsapp/qr');
      return data;
    },
    refetchInterval: 3000, // Refrescar cada 3 segundos para el QR
    ...options,
  });
};

/**
 * Enviar mensaje de WhatsApp
 */
export const useSendWhatsappMessage = () => {
  return useMutation({
    mutationFn: async ({ phone, message }) => {
      const { data } = await petApi.post('/whatsapp/send-message', {
        phone,
        message,
      });
      return data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Mensaje enviado correctamente');
      } else {
        toast.error(data.error || 'Error al enviar mensaje');
      }
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Error al enviar mensaje';
      toast.error(message);
    },
  });
};

/**
 * Enviar mensaje masivo de WhatsApp
 */
export const useSendBulkWhatsappMessage = () => {
  return useMutation({
    mutationFn: async ({ phones, message }) => {
      const { data } = await petApi.post('/whatsapp/send-bulk-message', {
        phones,
        message,
      });
      return data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`Mensajes enviados: ${data.successCount}/${data.total}`);
        if (data.errorCount > 0) {
          toast.error(`${data.errorCount} mensajes fallaron`);
        }
      } else {
        toast.error(data.error || 'Error al enviar mensajes');
      }
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Error al enviar mensajes';
      toast.error(message);
    },
  });
};

/**
 * Enviar recordatorio de cita por WhatsApp
 */
export const useSendAppointmentReminder = () => {
  return useMutation({
    mutationFn: async (data) => {
      const { data: response } = await petApi.post('/whatsapp/send-appointment-reminder', data);
      return response;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Recordatorio de cita enviado');
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
 * Enviar recordatorio de vacunación por WhatsApp
 */
export const useSendVaccinationReminder = () => {
  return useMutation({
    mutationFn: async (data) => {
      const { data: response } = await petApi.post('/whatsapp/send-vaccination-reminder', data);
      return response;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Recordatorio de vacunación enviado');
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
 * Enviar confirmación de cita
 */
export const useSendAppointmentConfirmation = () => {
  return useMutation({
    mutationFn: async (data) => {
      const { data: response } = await petApi.post('/whatsapp/send-appointment-confirmation', data);
      return response;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Confirmación de cita enviada');
      } else {
        toast.error(data.error || 'Error al enviar confirmación');
      }
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Error al enviar confirmación';
      toast.error(message);
    },
  });
};

/**
 * Forzar cierre de sesión de WhatsApp
 */
export const useForceWhatsappLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await petApi.post('/whatsapp/force-logout');
      return data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Sesión de WhatsApp cerrada');
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.whatsappStatus });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.whatsappQR });
      } else {
        toast.error(data.error || 'Error al cerrar sesión');
      }
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Error al cerrar sesión';
      toast.error(message);
    },
  });
};
