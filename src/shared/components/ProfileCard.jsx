import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, ArrowLeft, User, Lock } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';
import ActividadReciente from './ActividadReciente';

const frases = [
  '"El mejor médico del mundo es el veterinario. Él no puede preguntar a sus pacientes qué les pasa; simplemente tiene que saberlo."',
  '"Los animales son amigos tan agradables, no hacen preguntas, no pasan críticas."',
  '"Un perro es lo único en la tierra que te ama más de lo que se ama a sí mismo."',
  '"Los ojos de un animal tienen el poder de hablar un gran lenguaje."',
  '"La grandeza de una nación puede juzgarse por la forma en que trata a sus animales."',
];

export default function ProfileCard({ user, actividad = [] }) {
  // Estados de vista: 'profile' | 'editProfile' | 'changePassword'
  const [view, setView] = useState('profile');
  const [currentFrase, setCurrentFrase] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Rotación automática de frases
  useEffect(() => {
    if (view !== 'profile') return;

    const interval = setInterval(() => {
      setCurrentFrase((prev) => (prev + 1) % frases.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [view]);

  // Limpiar forms al cambiar de vista
  useEffect(() => {
    if (view === 'editProfile') {
      setFormData({ name: '', email: '' });
    } else if (view === 'changePassword') {
      setPasswordData({ newPassword: '', confirmPassword: '' });
    }
    setErrors({});
    setTouched({});
  }, [view]);

  // Validación perfil (solo si el campo tiene contenido)
  const validateProfileField = (name, value) => {
    if (!value.trim()) return '';
    switch (name) {
      case 'name':
        if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
        return '';
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Ingresa un correo válido';
        return '';
      default:
        return '';
    }
  };

  // Validación contraseña
  const validatePasswordField = (name, value) => {
    switch (name) {
      case 'newPassword':
        if (!value) return 'La contraseña es requerida';
        if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
        return '';
      case 'confirmPassword':
        if (!value) return 'Confirma tu contraseña';
        if (value !== passwordData.newPassword) return 'Las contraseñas no coinciden';
        return '';
      default:
        return '';
    }
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

    const dataToSave = {};
    if (formData.name.trim()) dataToSave.name = formData.name.trim();
    if (formData.email.trim()) dataToSave.email = formData.email.trim();

    console.log('Guardando perfil:', dataToSave);
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
    <div className="flex flex-col items-center flex-1 pt-8">
      {/* Avatar */}
      <div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center border-4 border-white shadow-xl mb-5">
        <User className="w-12 h-12 text-gray-400" />
      </div>

      {/* Nombre, Email y Botón Editar */}
      <div className="flex items-center gap-3 mb-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">{user?.name || 'Usuario'}</h2>
          <p className="text-gray-500">{user?.email}</p>
        </div>
        <button
          onClick={() => setView('editProfile')}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          title="Editar perfil"
          aria-label="Editar perfil"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </div>

      {/* Contenedor de frases / formulario de edición */}
      <div className="w-full max-w-5xl flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {view === 'profile' && (
            // Vista de frases + actividad reciente
            <motion.div
              key="frases"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col justify-between"
            >
              {/* Frase animada - altura fija para evitar desplazamiento */}
              <div className="text-center px-4 min-h-[80px] flex items-center justify-center flex-shrink-0">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentFrase}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="text-gray-600 italic leading-relaxed text-lg"
                  >
                    {frases[currentFrase]}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Actividad reciente */}
              <ActividadReciente actividad={actividad} />
            </motion.div>
          )}

          {view === 'editProfile' && (
            // Vista de edición de perfil
            <motion.div
              key="editProfile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-10"
            >
              {/* Barra superior */}
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-3 py-2 -ml-3 text-gray-500 hover:text-gray-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">Regresar</span>
                </button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setView('changePassword')}
                  className="rounded-full text-sm"
                >
                  Cambiar contraseña
                </Button>
              </div>

              {/* Título y descripción */}
              <div className="text-center mb-10">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Mi perfil
                </h3>
                <p className="text-gray-500">
                  Actualiza tu nombre o correo electrónico. Deja en blanco los campos que no deseas modificar.
                </p>
              </div>

              {/* Formulario */}
              <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }} className="space-y-8">
                {/* Campo Nombre */}
                <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-2">
                    <Label className="text-gray-500 text-sm">Nombre Actual</Label>
                    <p className="text-gray-900 py-2">{user?.name || 'No definido'}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-500 text-sm">Nombre Nuevo</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleProfileChange}
                      onBlur={(e) => handleBlur(e, 'profile')}
                      placeholder="Ingresa el nuevo nombre"
                      className={`h-11 rounded-xl bg-white ${errors.name && touched.name ? 'border-red-400' : ''}`}
                    />
                    {errors.name && touched.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>
                </div>

                {/* Campo Correo */}
                <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-2">
                    <Label className="text-gray-500 text-sm">Correo Actual</Label>
                    <p className="text-gray-900 py-2">{user?.email || 'No definido'}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-500 text-sm">Correo Nuevo</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleProfileChange}
                      onBlur={(e) => handleBlur(e, 'profile')}
                      placeholder="ejemplo@correo.com"
                      className={`h-11 rounded-xl bg-white ${errors.email && touched.email ? 'border-red-400' : ''}`}
                    />
                    {errors.email && touched.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Botón de acción */}
                <div className="flex justify-end pt-6">
                  <Button
                    type="submit"
                    disabled={!hasProfileChanges}
                    className="px-8 py-2 rounded-full bg-gray-700 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Guardar
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {view === 'changePassword' && (
            // Vista de cambio de contraseña
            <motion.div
              key="changePassword"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-10"
            >
              {/* Barra superior */}
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-3 py-2 -ml-3 text-gray-500 hover:text-gray-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">Regresar</span>
                </button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setView('editProfile')}
                  className="rounded-full text-sm"
                >
                  Editar perfil
                </Button>
              </div>

              {/* Título y descripción */}
              <div className="text-center mb-10">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Cambiar contraseña
                </h3>
                <p className="text-gray-500">
                  Ingresa tu nueva contraseña y confírmala para actualizar tus credenciales.
                </p>
              </div>

              {/* Formulario */}
              <form onSubmit={(e) => { e.preventDefault(); handleSavePassword(); }} className="space-y-8 max-w-md mx-auto">
                {/* Nueva contraseña */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-gray-500 text-sm flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Nueva contraseña
                  </Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    onBlur={(e) => handleBlur(e, 'password')}
                    placeholder="Mínimo 6 caracteres"
                    className={`h-11 rounded-xl bg-white ${errors.newPassword && touched.newPassword ? 'border-red-400' : ''}`}
                  />
                  {errors.newPassword && touched.newPassword && (
                    <p className="text-sm text-red-500">{errors.newPassword}</p>
                  )}
                </div>

                {/* Confirmar contraseña */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-500 text-sm flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Confirmar contraseña
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    onBlur={(e) => handleBlur(e, 'password')}
                    placeholder="Repite tu contraseña"
                    className={`h-11 rounded-xl bg-white ${errors.confirmPassword && touched.confirmPassword ? 'border-red-400' : ''}`}
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Botón de acción */}
                <div className="flex justify-end pt-6">
                  <Button
                    type="submit"
                    disabled={!hasPasswordChanges}
                    className="px-8 py-2 rounded-full bg-gray-700 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Guardar
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
