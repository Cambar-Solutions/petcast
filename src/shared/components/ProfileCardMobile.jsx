import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronRight, Pencil, Lock, LogOut, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import Button from '@/shared/components/Button';
import { useUpdateUser } from '@/shared/hooks';

export default function ProfileCardMobile({ user, onLogout }) {
  const updateUser = useUpdateUser();
  const [view, setView] = useState('profile');

  const [formData, setFormData] = useState({ name: '', email: '' });
  const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  // Limpiar forms al cambiar vista
  useEffect(() => {
    if (view === 'editProfile') {
      setFormData({ name: '', email: '' });
    } else if (view === 'changePassword') {
      setPasswordData({ newPassword: '', confirmPassword: '' });
    }
    setErrors({});
    setTouched({});
  }, [view]);

  const validateProfileField = (name, value) => {
    if (!value.trim()) return '';
    if (name === 'name' && value.trim().length < 2) return 'Mínimo 2 caracteres';
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Correo inválido';
    return '';
  };

  const validatePasswordField = (name, value) => {
    if (name === 'newPassword') {
      if (!value) return 'Requerida';
      if (value.length < 6) return 'Mínimo 6 caracteres';
    }
    if (name === 'confirmPassword') {
      if (!value) return 'Confirma tu contraseña';
      if (value !== passwordData.newPassword) return 'No coinciden';
    }
    return '';
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateProfileField(name, value) }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validatePasswordField(name, value) }));
    }
  };

  const handleBlur = (e, type = 'profile') => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const validateFn = type === 'profile' ? validateProfileField : validatePasswordField;
    setErrors((prev) => ({ ...prev, [name]: validateFn(name, value) }));
  };

  const handleBack = () => {
    setView('profile');
    setFormData({ name: '', email: '' });
    setPasswordData({ newPassword: '', confirmPassword: '' });
    setErrors({});
    setTouched({});
  };

  const handleSaveProfile = async () => {
    const newErrors = {
      name: validateProfileField('name', formData.name),
      email: validateProfileField('email', formData.email),
    };
    setErrors(newErrors);
    if (newErrors.name || newErrors.email) return;

    const dataToSave = { id: user?.id };
    if (formData.name.trim()) dataToSave.nombre = formData.name.trim();
    if (formData.email.trim()) dataToSave.correo = formData.email.trim();

    try {
      await updateUser.mutateAsync(dataToSave);
      setView('profile');
    } catch (err) {
      // El hook ya muestra el toast de error
    }
  };

  const handleSavePassword = async () => {
    const newErrors = {
      newPassword: validatePasswordField('newPassword', passwordData.newPassword),
      confirmPassword: validatePasswordField('confirmPassword', passwordData.confirmPassword),
    };
    setErrors(newErrors);
    setTouched({ newPassword: true, confirmPassword: true });
    if (newErrors.newPassword || newErrors.confirmPassword) return;

    try {
      await updateUser.mutateAsync({
        id: user?.id,
        contrasena: passwordData.newPassword,
      });
      setPasswordData({ newPassword: '', confirmPassword: '' });
      setView('profile');
    } catch (err) {
      // El hook ya muestra el toast de error
    }
  };

  const hasProfileChanges = formData.name.trim() !== '' || formData.email.trim() !== '';
  const hasPasswordChanges = passwordData.newPassword !== '' && passwordData.confirmPassword !== '';

  return (
    <div className="flex flex-col flex-1 pb-24">
      <AnimatePresence mode="wait">
        {view === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col flex-1"
          >
            {/* Header con avatar */}
            <div className="flex flex-col items-center gap-3 px-4 py-8">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center shadow-md border-4 border-white">
                <User className="w-10 h-10 text-orange-500" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold text-petcast-heading">{user?.name || 'Usuario'}</h2>
                <p className="text-sm text-petcast-text-light">{user?.email}</p>
              </div>
            </div>

            {/* Opciones de menú */}
            <div className="px-4 space-y-3">
              <button
                onClick={() => setView('editProfile')}
                className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-100 active:bg-gray-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-petcast-bg-soft rounded-xl flex items-center justify-center">
                    <Pencil className="w-5 h-5 text-sky-600" />
                  </div>
                  <div className="text-left">
                    <span className="font-medium text-petcast-heading block">Editar perfil</span>
                    <span className="text-xs text-petcast-text-light">Nombre y correo</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button
                onClick={() => setView('changePassword')}
                className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-100 active:bg-gray-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-petcast-bg-soft rounded-xl flex items-center justify-center">
                    <Lock className="w-5 h-5 text-sky-600" />
                  </div>
                  <div className="text-left">
                    <span className="font-medium text-petcast-heading block">Cambiar contraseña</span>
                    <span className="text-xs text-petcast-text-light">Seguridad de tu cuenta</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Cerrar sesión separado */}
            {onLogout && (
              <div className="px-4 mt-auto pt-8">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 p-4 bg-red-500 rounded-2xl active:bg-red-600 transition-all"
                >
                  <LogOut className="w-5 h-5 text-white" />
                  <span className="font-medium text-white">Cerrar sesión</span>
                </button>
              </div>
            )}
          </motion.div>
        )}

        {view === 'editProfile' && (
          <motion.div
            key="editProfile"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col flex-1 px-4"
          >
            {/* Header */}
            <div className="py-4">
              <button
                onClick={handleBack}
                className="text-sm text-gray-500 mb-4"
              >
                ← Regresar
              </button>
              <h2 className="text-xl font-semibold text-gray-900">Editar perfil</h2>
              <p className="text-sm text-gray-500 mt-1">Actualiza tu información personal</p>
            </div>

            {/* Formulario */}
            <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }} className="space-y-5 mt-4">
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Nombre actual: {user?.name || 'No definido'}</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleProfileChange}
                  onBlur={(e) => handleBlur(e, 'profile')}
                  placeholder="Nuevo nombre"
                  className={`h-12 rounded-xl bg-white ${errors.name && touched.name ? 'border-red-400' : ''}`}
                />
                {errors.name && touched.name && (
                  <p className="text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Correo actual: {user?.email || 'No definido'}</Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleProfileChange}
                  onBlur={(e) => handleBlur(e, 'profile')}
                  placeholder="Nuevo correo"
                  className={`h-12 rounded-xl bg-white ${errors.email && touched.email ? 'border-red-400' : ''}`}
                />
                {errors.email && touched.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={!hasProfileChanges}
                loading={updateUser.isPending}
                className="w-full mt-6"
              >
                {updateUser.isPending ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </form>
          </motion.div>
        )}

        {view === 'changePassword' && (
          <motion.div
            key="changePassword"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col flex-1 px-4"
          >
            {/* Header */}
            <div className="py-4">
              <button
                onClick={handleBack}
                className="text-sm text-gray-500 mb-4"
              >
                ← Regresar
              </button>
              <h2 className="text-xl font-semibold text-gray-900">Cambiar contraseña</h2>
              <p className="text-sm text-gray-500 mt-1">Ingresa tu nueva contraseña</p>
            </div>

            {/* Formulario */}
            <form onSubmit={(e) => { e.preventDefault(); handleSavePassword(); }} className="space-y-5 mt-4">
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Nueva contraseña</Label>
                <div className="relative">
                  <Input
                    name="newPassword"
                    type={showPasswords.newPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    onBlur={(e) => handleBlur(e, 'password')}
                    placeholder="Mínimo 6 caracteres"
                    className={`h-12 rounded-xl bg-white pr-10 ${errors.newPassword && touched.newPassword ? 'border-red-400' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(p => ({ ...p, newPassword: !p.newPassword }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-petcast-orange transition-colors"
                  >
                    {showPasswords.newPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.newPassword && touched.newPassword && (
                  <p className="text-xs text-red-500">{errors.newPassword}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Confirmar contraseña</Label>
                <div className="relative">
                  <Input
                    name="confirmPassword"
                    type={showPasswords.confirmPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    onBlur={(e) => handleBlur(e, 'password')}
                    placeholder="Repite tu contraseña"
                    className={`h-12 rounded-xl bg-white pr-10 ${errors.confirmPassword && touched.confirmPassword ? 'border-red-400' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(p => ({ ...p, confirmPassword: !p.confirmPassword }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-petcast-orange transition-colors"
                  >
                    {showPasswords.confirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="text-xs text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={!hasPasswordChanges}
                loading={updateUser.isPending}
                className="w-full mt-6"
              >
                {updateUser.isPending ? 'Guardando...' : 'Guardar contraseña'}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
