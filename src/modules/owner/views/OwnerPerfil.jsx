import { User, Mail, Phone, MapPin } from 'lucide-react';
import { Button, Title, Description } from '@/shared/components';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useAuth } from '@/shared/context/AuthContext';

export default function OwnerPerfil() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 pb-8">
      <div>
        <Title variant="page-title">Mi Perfil</Title>
        <Description variant="section-description" mobileText="Tu información personal">
          Administra tu informacion personal
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
              Dueno de Mascotas
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
                Correo electronico
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
                Telefono
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
                Direccion
              </Label>
              <Input
                id="address"
                type="text"
                placeholder="Tu direccion"
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
    </div>
  );
}
