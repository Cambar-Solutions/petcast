import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Phone, KeyRound, CheckCircle } from 'lucide-react';
import { Input, Button } from '../shared/components';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/components/ui/tabs';
import { useAuth } from '../shared/context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, getRedirectPath } = useAuth();

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
  const [showCredentials, setShowCredentials] = useState(false);
  const [recoverySuccess, setRecoverySuccess] = useState(false);

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
      newErrors.email = 'Email invalido';
    }

    if (!loginData.password) {
      newErrors.password = 'La contrasena es requerida';
    } else if (loginData.password.length < 6) {
      newErrors.password = 'La contrasena debe tener al menos 6 caracteres';
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
      newErrors.phone = 'El telefono es requerido';
    } else if (recoveryData.phone.length < 10) {
      newErrors.phone = 'Ingresa un numero valido';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    // Simular envío de código
    setTimeout(() => {
      setIsLoading(false);
      setRecoveryStep(2);
      setErrors({});
    }, 1500);
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!recoveryData.code) {
      newErrors.code = 'El codigo es requerido';
    } else if (recoveryData.code.length !== 6) {
      newErrors.code = 'El codigo debe tener 6 digitos';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    // Simular verificación (cualquier código de 6 dígitos funciona)
    setTimeout(() => {
      setIsLoading(false);
      setRecoveryStep(3);
      setErrors({});
    }, 1000);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!recoveryData.newPassword) {
      newErrors.newPassword = 'La contrasena es requerida';
    } else if (recoveryData.newPassword.length < 6) {
      newErrors.newPassword = 'Minimo 6 caracteres';
    }

    if (!recoveryData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contrasena';
    } else if (recoveryData.newPassword !== recoveryData.confirmPassword) {
      newErrors.confirmPassword = 'Las contrasenas no coinciden';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    // Simular cambio de contraseña
    setTimeout(() => {
      setIsLoading(false);
      setRecoverySuccess(true);
      // Reset después de 3 segundos
      setTimeout(() => {
        setRecoveryStep(1);
        setRecoveryData({ phone: '', code: '', newPassword: '', confirmPassword: '' });
        setRecoverySuccess(false);
      }, 3000);
    }, 1500);
  };

  const resetRecovery = () => {
    setRecoveryStep(1);
    setRecoveryData({ phone: '', code: '', newPassword: '', confirmPassword: '' });
    setErrors({});
    setRecoverySuccess(false);
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
              Gestion veterinaria profesional
            </p>
          </div>

          {/* Error general */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {errors.general}
            </div>
          )}

          {/* Credenciales de prueba - Desplegable */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setShowCredentials(!showCredentials)}
              className="w-full flex items-center justify-between p-3 bg-petcast-bg-soft/50 border border-petcast-bg-soft rounded-xl text-petcast-text text-sm hover:bg-petcast-bg-soft transition-colors"
            >
              <span className="font-medium">Credenciales de prueba</span>
              {showCredentials ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            {showCredentials && (
              <div className="mt-2 p-3 bg-petcast-bg-soft/30 border border-petcast-bg-soft rounded-xl text-sm text-petcast-text space-y-1">
                <p><span className="font-medium">Admin:</span> admin@petcast.com / 123456</p>
                <p><span className="font-medium">Vet:</span> vet@petcast.com / 123456</p>
                <p><span className="font-medium">Owner:</span> owner@petcast.com / 123456</p>
              </div>
            )}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="login" className="w-full" onValueChange={resetRecovery}>
            <TabsList className="w-full">
              <TabsTrigger value="login">Ingresa</TabsTrigger>
              <TabsTrigger value="recovery">Recupera</TabsTrigger>
            </TabsList>

            {/* Tab de Login */}
            <TabsContent value="login">
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <Input
                  label="Correo electronico"
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  placeholder="tu@email.com"
                  error={errors.email}
                  required
                />

                <Input
                  label="Contrasena"
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
                    onClick={() => {
                      const recoveryTab = document.querySelector('[data-state="inactive"][value="recovery"]');
                      if (recoveryTab) recoveryTab.click();
                    }}
                    className="text-sm text-petcast-heading font-medium hover:underline"
                  >
                    Olvidaste tu contrasena?
                  </button>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Iniciando sesion...' : 'Iniciar Sesion'}
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
                    Contrasena actualizada
                  </h3>
                  <p className="text-petcast-text-light text-sm">
                    Ya puedes iniciar sesion con tu nueva contrasena
                  </p>
                </div>
              ) : (
                <>
                  {/* Indicador de pasos */}
                  <div className="flex items-center justify-center gap-2 mb-6">
                    {[1, 2, 3].map((step) => (
                      <div
                        key={step}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                          recoveryStep >= step
                            ? 'bg-petcast-heading text-white'
                            : 'bg-petcast-bg-soft text-petcast-text-light'
                        }`}
                      >
                        {step}
                      </div>
                    ))}
                  </div>

                  {/* Paso 1: Telefono */}
                  {recoveryStep === 1 && (
                    <form onSubmit={handleSendCode} className="space-y-5">
                      <div className="text-center mb-4">
                        <div className="w-12 h-12 bg-petcast-bg-soft rounded-full flex items-center justify-center mx-auto mb-3">
                          <Phone className="w-6 h-6 text-petcast-heading" />
                        </div>
                        <p className="text-sm text-petcast-text-light">
                          Ingresa tu numero de telefono para recibir un codigo de verificacion
                        </p>
                      </div>

                      <Input
                        label="Numero de telefono"
                        type="tel"
                        name="phone"
                        value={recoveryData.phone}
                        onChange={handleRecoveryChange}
                        placeholder="10 digitos"
                        error={errors.phone}
                        required
                      />

                      <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        size="lg"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Enviando...' : 'Enviar codigo'}
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
                          Ingresa el codigo de 6 digitos que enviamos a
                        </p>
                        <p className="text-sm font-medium text-petcast-heading">
                          {recoveryData.phone}
                        </p>
                      </div>

                      <Input
                        label="Codigo de verificacion"
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
                        (Simulado: cualquier codigo de 6 digitos funciona)
                      </p>

                      <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        size="lg"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Verificando...' : 'Verificar codigo'}
                      </Button>

                      <button
                        type="button"
                        onClick={() => setRecoveryStep(1)}
                        className="w-full text-sm text-petcast-text-light hover:text-petcast-heading"
                      >
                        Cambiar numero
                      </button>
                    </form>
                  )}

                  {/* Paso 3: Nueva contrasena */}
                  {recoveryStep === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-5">
                      <div className="text-center mb-4">
                        <p className="text-sm text-petcast-text-light">
                          Crea tu nueva contrasena
                        </p>
                      </div>

                      <Input
                        label="Nueva contrasena"
                        type="password"
                        name="newPassword"
                        value={recoveryData.newPassword}
                        onChange={handleRecoveryChange}
                        placeholder="Minimo 6 caracteres"
                        error={errors.newPassword}
                        required
                      />

                      <Input
                        label="Confirmar contrasena"
                        type="password"
                        name="confirmPassword"
                        value={recoveryData.confirmPassword}
                        onChange={handleRecoveryChange}
                        placeholder="Repite tu contrasena"
                        error={errors.confirmPassword}
                        required
                      />

                      <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        size="lg"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Guardando...' : 'Guardar contrasena'}
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
