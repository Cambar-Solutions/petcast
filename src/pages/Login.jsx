import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
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
      // Redirigir segun el rol
      const redirectPath = getRedirectPath();
      navigate(redirectPath);
    } else {
      setErrors({ general: result.error });
    }

    setIsLoading(false);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!registerData.name) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!registerData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      newErrors.email = 'Email invalido';
    }

    if (!registerData.password) {
      newErrors.password = 'La contrasena es requerida';
    } else if (registerData.password.length < 6) {
      newErrors.password = 'La contrasena debe tener al menos 6 caracteres';
    }

    if (!registerData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contrasena';
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Las contrasenas no coinciden';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    // Por ahora el registro no hace nada real
    setTimeout(() => {
      setIsLoading(false);
      setErrors({ general: 'El registro aun no esta disponible. Usa las credenciales de prueba.' });
    }, 1000);
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

          {/* Credenciales de prueba */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
            <p className="font-medium mb-1">Credenciales de prueba:</p>
            <p>admin@petcast.com / 123456</p>
            <p>vet@petcast.com / 123456</p>
            <p>owner@petcast.com / 123456</p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="login">Ingresa</TabsTrigger>
              <TabsTrigger value="register">Registrate</TabsTrigger>
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
                      className="w-4 h-4 text-petcast-orange border-gray-300 rounded focus:ring-petcast-orange"
                    />
                    <span className="ml-2 text-sm text-petcast-text">
                      Recordarme
                    </span>
                  </label>

                  <a href="#" className="text-sm text-petcast-orange hover:underline">
                    Olvidaste tu contrasena?
                  </a>
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

            {/* Tab de Registro */}
            <TabsContent value="register">
              <form onSubmit={handleRegisterSubmit} className="space-y-5">
                <Input
                  label="Nombre completo"
                  type="text"
                  name="name"
                  value={registerData.name}
                  onChange={handleRegisterChange}
                  placeholder="Juan Perez"
                  error={errors.name}
                  required
                />

                <Input
                  label="Correo electronico"
                  type="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  placeholder="tu@email.com"
                  error={errors.email}
                  required
                />

                <Input
                  label="Contrasena"
                  type="password"
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  placeholder="******"
                  error={errors.password}
                  required
                />

                <Input
                  label="Confirmar contrasena"
                  type="password"
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  placeholder="******"
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
                  {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                </Button>
              </form>
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
