import { User, Mail, Phone, Building } from 'lucide-react';
import { Button } from '@/shared/components';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useAuth } from '@/shared/context/AuthContext';

export default function AdminPerfil() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-600">Administra tu informacion personal</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user?.name || 'Administrador'}</h2>
            <p className="text-gray-500">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
              Administrador
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
              <Label htmlFor="clinic" className="flex items-center gap-2">
                <Building className="w-4 h-4 text-gray-400" />
                Clinica
              </Label>
              <Input
                id="clinic"
                type="text"
                placeholder="Nombre de la clinica"
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
