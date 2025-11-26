import { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from './ui/sheet';
import { Input } from './ui/input';
import { Label } from './ui/label';
import Button from './Button';

export default function ProfileSheet({ isOpen, onClose, user, onLogout }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui iria la logica para guardar los cambios
    console.log('Guardando perfil:', formData);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader className="mb-6">
          <SheetTitle>Mi Perfil</SheetTitle>
          <SheetDescription>
            Actualiza tu informacion personal
          </SheetDescription>
        </SheetHeader>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto">
          {/* Avatar minimalista */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-petcast-bg-soft to-petcast-bg rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl font-semibold text-petcast-heading">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <p className="font-medium text-petcast-heading">{user?.name}</p>
            <p className="text-sm text-petcast-text-light">{user?.email}</p>
          </div>

          {/* Formulario minimalista */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs text-petcast-text-light uppercase tracking-wide">
                Nombre
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tu nombre"
                className="rounded-xl border-petcast-bg-soft focus:border-petcast-heading"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs text-petcast-text-light uppercase tracking-wide">
                Correo
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className="rounded-xl border-petcast-bg-soft focus:border-petcast-heading"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs text-petcast-text-light uppercase tracking-wide">
                Telefono
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+52 123 456 7890"
                className="rounded-xl border-petcast-bg-soft focus:border-petcast-heading"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" className="w-full rounded-xl">
                Guardar
              </Button>
            </div>
          </form>
        </div>

        {/* Logout fijo abajo */}
        <div className="pt-4 mt-auto border-t border-petcast-bg-soft">
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesion
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
