import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from './ui/sheet';

export default function HelpSheet({ isOpen, onClose }) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left">
        <SheetHeader className="mb-6">
          <SheetTitle>Acerca de PetCast</SheetTitle>
          <SheetDescription>
            Sistema de gestion veterinaria
          </SheetDescription>
        </SheetHeader>

        {/* Logo grande */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/logopestcast.png"
            alt="PetCast Logo"
            className="w-32 h-32 object-contain mb-4"
          />
          <h2 className="text-2xl font-bold text-petcast-heading">PetCast</h2>
          <p className="text-petcast-text-light text-sm">Version 1.0.0</p>
        </div>

        {/* Descripcion */}
        <div className="space-y-4 mb-8">
          <p className="text-petcast-text text-center">
            PetCast es una plataforma integral para la gestion de clinicas veterinarias,
            facilitando el seguimiento de mascotas, citas y expedientes medicos.
          </p>
        </div>

        {/* Creditos */}
        <div className="border-t border-petcast-bg-soft pt-6">
          <h3 className="text-sm font-semibold text-petcast-heading mb-3 text-center">
            Desarrollado por
          </h3>
          <div className="bg-petcast-bg-soft rounded-xl p-4 text-center">
            <p className="text-petcast-text font-medium">
              Ingenieros de Software
            </p>
            <p className="text-petcast-text-light text-sm mt-1">
              Universidad / Empresa
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 left-6 right-6 text-center">
          <p className="text-xs text-petcast-text-light">
            © 2024 PetCast. Todos los derechos reservados.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
