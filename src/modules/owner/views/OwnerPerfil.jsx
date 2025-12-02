import { useState } from 'react';
import { User, Mail, Phone, MapPin, Lock, Eye, EyeOff, Check } from 'lucide-react';
import { Button, Title, Description } from '@/shared/components';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useAuth } from '@/shared/context/AuthContext';
import { useUpdateUser } from '@/shared/hooks';
import toast from 'react-hot-toast';

export default function OwnerPerfil() {
  const { user } = useAuth();
  const updateUser = useUpdateUser();

  const [showPasswords, setShowPasswords] = useState({
    nueva: false,
    confirmar: false,
  });
  const [passwords, setPasswords] = useState({
    nueva: '',
    confirmar: '',
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwords.nueva.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (passwords.nueva !== passwords.confirmar) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    try {
      await updateUser.mutateAsync({
        id: user.id,
        contrasena: passwords.nueva,
      });
      toast.success('Contraseña actualizada correctamente');
      setPasswords({ nueva: '', confirmar: '' });
    } catch (err) {
      toast.error('Error al cambiar la contraseña');
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div>
        <Title variant="page-title">Mi Perfil</Title>
        <Description variant="section-description" mobileText="Tu información personal">
          Administra tu información personal
        </Description>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user?.name || 'Usuario'}</h2>
            <p className="text-gray-500">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
              Dueño de Mascotas
            </span>
          </div>
        </div>

        {/* Formulario */}
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                Nombre completo
              </Label>
              <Input
                id="name"
                type="text"
                defaultValue={user?.name}
                placeholder="Tu nombre"
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                defaultValue={user?.email}
                placeholder="tu@email.com"
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                Teléfono
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+52 123 456 7890"
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                Dirección
              </Label>
              <Input
                id="address"
                type="text"
                placeholder="Tu dirección"
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="primary">
              Guardar Cambios
            </Button>
          </div>
        </form>
      </div>

      {/* Sección Cambiar Contraseña */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <Lock className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-petcast-heading">Cambiar Contraseña</h3>
            <p className="text-sm text-petcast-text-light">Actualiza tu contraseña de acceso</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nueva" className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-400" />
                Nueva contraseña
              </Label>
              <div className="relative">
                <Input
                  id="nueva"
                  name="nueva"
                  type={showPasswords.nueva ? 'text' : 'password'}
                  value={passwords.nueva}
                  onChange={handlePasswordChange}
                  placeholder="Mínimo 6 caracteres"
                  className="rounded-xl pr-10"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(p => ({ ...p, nueva: !p.nueva }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-petcast-orange transition-colors z-10"
                >
                  {showPasswords.nueva ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmar" className="flex items-center gap-2">
                <Check className="w-4 h-4 text-gray-400" />
                Confirmar contraseña
              </Label>
              <div className="relative">
                <Input
                  id="confirmar"
                  name="confirmar"
                  type={showPasswords.confirmar ? 'text' : 'password'}
                  value={passwords.confirmar}
                  onChange={handlePasswordChange}
                  placeholder="Repite la contraseña"
                  className="rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(p => ({ ...p, confirmar: !p.confirmar }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-petcast-orange transition-colors z-10"
                >
                  {showPasswords.confirmar ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {passwords.nueva && passwords.confirmar && passwords.nueva !== passwords.confirmar && (
            <p className="text-sm text-red-500">Las contraseñas no coinciden</p>
          )}

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={!passwords.nueva || !passwords.confirmar || updateUser.isPending}
            >
              {updateUser.isPending ? 'Guardando...' : 'Cambiar Contraseña'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
