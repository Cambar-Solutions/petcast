import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronRight, Mail, Lock, LogOut } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';

const frases = [
  '"El mejor médico del mundo es el veterinario."',
  '"Los animales son amigos tan agradables."',
  '"Un perro te ama más de lo que se ama a sí mismo."',
  '"Los ojos de un animal tienen el poder de hablar."',
];

export default function ProfileCardMobile({ user, onLogout }) {
  const [view, setView] = useState('profile');
  const [currentFrase, setCurrentFrase] = useState(0);

  const [formData, setFormData] = useState({ name: '', email: '' });
  const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Rotación de frases
  useEffect(() => {
    if (view !== 'profile') return;
    const interval = setInterval(() => {
      setCurrentFrase((prev) => (prev + 1) % frases.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [view]);

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

  const handleSaveProfile = () => {
    const newErrors = {
      name: validateProfileField('name', formData.name),
      email: validateProfileField('email', formData.email),
    };
    setErrors(newErrors);
    if (newErrors.name || newErrors.email) return;
    console.log('Guardando perfil:', formData);
    setView('profile');
  };

  const handleSavePassword = () => {
    const newErrors = {
      newPassword: validatePasswordField('newPassword', passwordData.newPassword),
      confirmPassword: validatePasswordField('confirmPassword', passwordData.confirmPassword),
    };
    setErrors(newErrors);
    setTouched({ newPassword: true, confirmPassword: true });
    if (newErrors.newPassword || newErrors.confirmPassword) return;
    console.log('Guardando contraseña');
    setView('profile');
  };

  const hasProfileChanges = formData.name.trim() !== '' || formData.email.trim() !== '';
  const hasPasswordChanges = passwordData.newPassword !== '' && passwordData.confirmPassword !== '';

  return (
    <div className="flex flex-col flex-1">
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
            <div className="flex items-center gap-4 px-4 py-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">{user?.name || 'Usuario'}</h2>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>

            {/* Frase inspiracional */}
            <div className="px-4 py-4">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentFrase}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-gray-500 italic text-sm text-center"
                >
                  {frases[currentFrase]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Opciones de menú */}
            <div className="px-4 mt-4 space-y-2">
              <button
                onClick={() => setView('editProfile')}
                className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 active:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="font-medium text-gray-900">Editar perfil</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button
                onClick={() => setView('changePassword')}
                className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 active:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Lock className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="font-medium text-gray-900">Cambiar contraseña</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-red-100 active:bg-red-50 transition-colors mt-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                      <LogOut className="w-5 h-5 text-red-500" />
                    </div>
                    <span className="font-medium text-red-600">Cerrar sesión</span>
                  </div>
                </button>
              )}
            </div>
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
                disabled={!hasProfileChanges}
                className="w-full h-12 rounded-xl bg-gray-800 hover:bg-gray-900 disabled:bg-gray-300 mt-6"
              >
                Guardar cambios
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
                <Input
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  onBlur={(e) => handleBlur(e, 'password')}
                  placeholder="Mínimo 6 caracteres"
                  className={`h-12 rounded-xl bg-white ${errors.newPassword && touched.newPassword ? 'border-red-400' : ''}`}
                />
                {errors.newPassword && touched.newPassword && (
                  <p className="text-xs text-red-500">{errors.newPassword}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Confirmar contraseña</Label>
                <Input
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  onBlur={(e) => handleBlur(e, 'password')}
                  placeholder="Repite tu contraseña"
                  className={`h-12 rounded-xl bg-white ${errors.confirmPassword && touched.confirmPassword ? 'border-red-400' : ''}`}
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="text-xs text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={!hasPasswordChanges}
                className="w-full h-12 rounded-xl bg-gray-800 hover:bg-gray-900 disabled:bg-gray-300 mt-6"
              >
                Guardar contraseña
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
