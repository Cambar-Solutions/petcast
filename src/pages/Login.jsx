import { useState } from 'react';
import { Input, Button } from '../shared/components';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/components/ui/tabs';

export default function Login() {
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

    setTimeout(() => {
      setIsLoading(false);
      console.log('Login exitoso:', loginData);
    }, 1500);
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
      newErrors.email = 'Email inválido';
    }

    if (!registerData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (registerData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!registerData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      console.log('Registro exitoso:', registerData);
    }, 1500);
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
          {/* Logo y título */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-30 h-30 mb-4">
              <img
                src="/logopestcast.png"
                alt="PetCast Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              PetCast
            </h1>
            <p className="text-gray-600">
              Gestión veterinaria profesional
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="login">Ingresa</TabsTrigger>
              <TabsTrigger value="register">Regístrate</TabsTrigger>
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
                  placeholder="••••••••"
                  error={errors.password}
                  required
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Recordarme
                    </span>
                  </label>

                  <a href="#" className="text-sm text-blue-600 hover:underline">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
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
                  placeholder="Juan Pérez"
                  error={errors.name}
                  required
                />

                <Input
                  label="Correo electrónico"
                  type="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  placeholder="tu@email.com"
                  error={errors.email}
                  required
                />

                <Input
                  label="Contraseña"
                  type="password"
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  placeholder="••••••••"
                  error={errors.password}
                  required
                />

                <Input
                  label="Confirmar contraseña"
                  type="password"
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  placeholder="••••••••"
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
