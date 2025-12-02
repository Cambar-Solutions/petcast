import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { userApi } from '@/shared/services/api';

/**
 * Hooks para recuperación de contraseña por WhatsApp
 */

/**
 * Solicitar código de recuperación por WhatsApp
 */
export const useSolicitarCodigoWhatsApp = () => {
  return useMutation({
    mutationFn: async (telefono) => {
      const { data } = await userApi.post('/auth/solicitar-codigo-whatsapp', {
        telefono,
      });
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Código enviado por WhatsApp');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Error al enviar código';
      toast.error(message);
    },
  });
};

/**
 * Verificar código de WhatsApp
 */
export const useVerificarCodigoWhatsApp = () => {
  return useMutation({
    mutationFn: async ({ telefono, codigo }) => {
      const { data } = await userApi.post('/auth/verificar-codigo-whatsapp', {
        telefono,
        codigo,
      });
      return data;
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Código inválido o expirado';
      toast.error(message);
    },
  });
};

/**
 * Resetear contraseña con código de WhatsApp
 */
export const useResetContrasenaWhatsApp = () => {
  return useMutation({
    mutationFn: async ({ telefono, codigo, nuevaContrasena }) => {
      const { data } = await userApi.post('/auth/reset-contrasena-whatsapp', {
        telefono,
        codigo,
        nuevaContrasena,
      });
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Contraseña actualizada correctamente');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Error al cambiar contraseña';
      toast.error(message);
    },
  });
};
