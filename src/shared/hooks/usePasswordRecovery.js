import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { userApi, petApi } from '@/shared/services/api';

/**
 * Hooks para recuperación de contraseña por WhatsApp
 */

/**
 * Solicitar código de recuperación por WhatsApp
 * Llama al backend para generar código y luego envía el WhatsApp desde el frontend
 */
export const useSolicitarCodigoWhatsApp = () => {
  return useMutation({
    mutationFn: async (telefono) => {
      // 1. Solicitar código al backend (lo genera y guarda en BD)
      const { data } = await userApi.post('/auth/solicitar-codigo-whatsapp', {
        telefono,
      });

      // 2. Si el backend retorna el código y nombre, enviar WhatsApp desde frontend
      if (data.codigo && data.nombreUsuario) {
        try {
          await petApi.post('/whatsapp/send-recovery-code', {
            phone: telefono,
            nombreUsuario: data.nombreUsuario,
            codigo: data.codigo,
          });
        } catch (whatsappError) {
          console.error('Error enviando WhatsApp:', whatsappError);
          // No lanzamos error, el código ya está generado
        }
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success('Código enviado por WhatsApp');
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
