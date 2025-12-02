import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, KeyRound, CheckCircle } from 'lucide-react';
import { Input, Button } from '../shared/components';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/components/ui/tabs';
import { useAuth } from '../shared/context/AuthContext';
import {
  useSolicitarCodigoWhatsApp,
  useVerificarCodigoWhatsApp,
  useResetContrasenaWhatsApp,
} from '@/shared/hooks';

export default function Login() {
  const navigate = useNavigate();
  const { login, getRedirectPath } = useAuth();

  // Hooks de recuperación de contraseña
  const solicitarCodigo = useSolicitarCodigoWhatsApp();
  const verificarCodigo = useVerificarCodigoWhatsApp();
  const resetContrasena = useResetContrasenaWhatsApp();

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [recoveryStep, setRecoveryStep] = useState(1); // 1: phone, 2: code, 3: new password
  const [recoveryData, setRecoveryData] = useState({
    phone: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRecoveryChange = (e) => {
    const { name, value } = e.target;
    setRecoveryData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!loginData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!loginData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (loginData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    const result = await login(loginData.email, loginData.password);

    if (result.success) {
      const redirectPath = getRedirectPath();
      navigate(redirectPath);
    } else {
      setErrors({ general: result.error });
    }

    setIsLoading(false);
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!recoveryData.phone) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (recoveryData.phone.length < 10) {
      newErrors.phone = 'Ingresa un número válido';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await solicitarCodigo.mutateAsync(recoveryData.phone);
      setRecoveryStep(2);
      setErrors({});
    } catch (err) {
      // El hook ya muestra el toast de error
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!recoveryData.code) {
      newErrors.code = 'El código es requerido';
    } else if (recoveryData.code.length !== 6) {
      newErrors.code = 'El código debe tener 6 dígitos';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await verificarCodigo.mutateAsync({
        telefono: recoveryData.phone,
        codigo: recoveryData.code,
      });
      setRecoveryStep(3);
      setErrors({});
    } catch (err) {
      // El hook ya muestra el toast de error
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!recoveryData.newPassword) {
      newErrors.newPassword = 'La contraseña es requerida';
    } else if (recoveryData.newPassword.length < 6) {
      newErrors.newPassword = 'Mínimo 6 caracteres';
    }

    if (!recoveryData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (recoveryData.newPassword !== recoveryData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await resetContrasena.mutateAsync({
        telefono: recoveryData.phone,
        codigo: recoveryData.code,
        nuevaContrasena: recoveryData.newPassword,
      });
      setRecoverySuccess(true);
      // Reset después de 3 segundos
      setTimeout(() => {
        setRecoveryStep(1);
        setRecoveryData({ phone: '', code: '', newPassword: '', confirmPassword: '' });
        setRecoverySuccess(false);
        setActiveTab('login');
      }, 3000);
    } catch (err) {
      // El hook ya muestra el toast de error
    }
  };

  const resetRecovery = (newTab) => {
    if (newTab === 'login') {
      setRecoveryStep(1);
      setRecoveryData({ phone: '', code: '', newPassword: '', confirmPassword: '' });
      setRecoverySuccess(false);
    }
    setErrors({});
    setActiveTab(newTab);
  };

  return (
    <div className="min-h-screen flex">
      {/* Columna Izquierda - Formulario */}
      <div
        className="w-full lg:w-1/2 flex items-center justify-center p-8"
        style={{
          background: 'linear-gradient(to right, #a9daf862, #ffffff)'
        }}
      >
        <div className="w-full max-w-md">
          {/* Logo y titulo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-30 h-30 mb-4">
              <img
                src="/logopestcast.png"
                alt="PetCast Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-petcast-heading mb-2">
              PetCast
            </h1>
            <p className="text-petcast-text">
              Gestión veterinaria profesional
            </p>
          </div>

          {/* Error general */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {errors.general}
            </div>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={resetRecovery} className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="login">Ingresa</TabsTrigger>
              <TabsTrigger value="recovery">Recupera</TabsTrigger>
            </TabsList>

            {/* Tab de Login */}
            <TabsContent value="login">
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <Input
                  label="Correo electrónico"
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  placeholder="tu@email.com"
                  error={errors.email}
                  required
                />

                <Input
                  label="Contraseña"
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="******"
                  error={errors.password}
                  required
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-petcast-heading border-gray-300 rounded focus:ring-petcast-heading"
                    />
                    <span className="ml-2 text-sm text-petcast-text">
                      Recordarme
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setActiveTab('recovery')}
                    className="text-sm text-petcast-heading font-medium hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Iniciando sesión...' : 'Ingresar'}
                </Button>
              </form>
            </TabsContent>

            {/* Tab de Recuperación */}
            <TabsContent value="recovery">
              {recoverySuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-petcast-heading mb-2">
                    Contraseña actualizada
                  </h3>
                  <p className="text-petcast-text-light text-sm">
                    Ya puedes iniciar sesión con tu nueva contraseña
                  </p>
                </div>
              ) : (
                <>
                  {/* Paso 1: Telefono */}
                  {recoveryStep === 1 && (
                    <form onSubmit={handleSendCode} className="space-y-5">
                      <div className="text-center mb-4">
                        <div className="w-12 h-12 bg-petcast-bg-soft rounded-full flex items-center justify-center mx-auto mb-3">
                          <Phone className="w-6 h-6 text-petcast-heading" />
                        </div>
                        <p className="text-sm text-petcast-text-light">
                          Ingresa tu número de teléfono para recibir un código de verificación
                        </p>
                      </div>

                      <Input
                        label="Número de teléfono"
                        type="tel"
                        name="phone"
                        value={recoveryData.phone}
                        onChange={handleRecoveryChange}
                        placeholder="10 dígitos"
                        error={errors.phone}
                        required
                      />

                      <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        size="lg"
                        disabled={solicitarCodigo.isPending}
                        loading={solicitarCodigo.isPending}
                      >
                        {solicitarCodigo.isPending ? 'Enviando...' : 'Enviar código por WhatsApp'}
                      </Button>
                    </form>
                  )}

                  {/* Paso 2: Codigo */}
                  {recoveryStep === 2 && (
                    <form onSubmit={handleVerifyCode} className="space-y-5">
                      <div className="text-center mb-4">
                        <div className="w-12 h-12 bg-petcast-bg-soft rounded-full flex items-center justify-center mx-auto mb-3">
                          <KeyRound className="w-6 h-6 text-petcast-heading" />
                        </div>
                        <p className="text-sm text-petcast-text-light">
                          Ingresa el código de 6 dígitos que enviamos por WhatsApp a
                        </p>
                        <p className="text-sm font-medium text-petcast-heading">
                          {recoveryData.phone}
                        </p>
                      </div>

                      <Input
                        label="Código de verificación"
                        type="text"
                        name="code"
                        value={recoveryData.code}
                        onChange={handleRecoveryChange}
                        placeholder="123456"
                        maxLength={6}
                        error={errors.code}
                        required
                      />

                      <p className="text-xs text-petcast-text-light text-center">
                        El código expira en 10 minutos
                      </p>

                      <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        size="lg"
                        disabled={verificarCodigo.isPending}
                        loading={verificarCodigo.isPending}
                      >
                        {verificarCodigo.isPending ? 'Verificando...' : 'Verificar código'}
                      </Button>

                      <button
                        type="button"
                        onClick={() => setRecoveryStep(1)}
                        className="w-full text-sm text-petcast-text-light hover:text-petcast-heading"
                      >
                        Cambiar número
                      </button>
                    </form>
                  )}

                  {/* Paso 3: Nueva contrasena */}
                  {recoveryStep === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-5">
                      <div className="text-center mb-4">
                        <p className="text-sm text-petcast-text-light">
                          Crea tu nueva contraseña
                        </p>
                      </div>

                      <Input
                        label="Nueva contraseña"
                        type="password"
                        name="newPassword"
                        value={recoveryData.newPassword}
                        onChange={handleRecoveryChange}
                        placeholder="Mínimo 6 caracteres"
                        error={errors.newPassword}
                        required
                      />

                      <Input
                        label="Confirmar contraseña"
                        type="password"
                        name="confirmPassword"
                        value={recoveryData.confirmPassword}
                        onChange={handleRecoveryChange}
                        placeholder="Repite tu contraseña"
                        error={errors.confirmPassword}
                        required
                      />

                      <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        size="lg"
                        disabled={resetContrasena.isPending}
                        loading={resetContrasena.isPending}
                      >
                        {resetContrasena.isPending ? 'Guardando...' : 'Guardar contraseña'}
                      </Button>
                    </form>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Columna Derecha - Imagen */}
      <div
        className="hidden lg:block lg:w-1/2 relative overflow-hidden pt-20"
        style={{
          backgroundColor: '#A9DAF8'
        }}
      >
        <img
          src="/petcast.jpg"
          alt="Mascotas"
          className="absolute inset-0 w-full h-full mt-35 object-contain"
          style={{ imageRendering: 'high-quality' }}
        />
      </div>
    </div>
  );
}
