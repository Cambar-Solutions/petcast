import { useState, useEffect } from 'react';
import { FileText, Stethoscope, Pill, ClipboardList } from 'lucide-react';
import { Modal, Button } from '@/shared/components';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/shared/components/ui/drawer';

export default function FichaMedicaForm({
  isOpen,
  onClose,
  onSubmit,
  ficha = null,
  isMobile = false,
  isLoading = false,
  mascotaNombre = '',
}) {
  const isEditing = !!ficha;

  // Key única para forzar re-render
  const formKey = ficha?.id || 'new';

  const getInitialFormData = (fichaData) => {
    if (!fichaData) {
      return {
        diagnostico: '',
        tratamiento: '',
        observaciones: '',
      };
    }

    return {
      diagnostico: fichaData.diagnostico || '',
      tratamiento: fichaData.tratamiento || '',
      observaciones: fichaData.observaciones || '',
    };
  };

  const [formData, setFormData] = useState(() => getInitialFormData(ficha));

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData(ficha));
    }
  }, [ficha, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Diagnóstico */}
      <div className="space-y-1.5">
        <Label htmlFor="diagnostico" className="text-xs text-petcast-text-light uppercase tracking-wide flex items-center gap-2">
          <Stethoscope className="w-3.5 h-3.5" />
          Diagnostico *
        </Label>
        <Textarea
          id="diagnostico"
          name="diagnostico"
          value={formData.diagnostico}
          onChange={handleChange}
          placeholder="Describe el diagnostico de la consulta..."
          className="rounded-xl min-h-[80px]"
          required
        />
      </div>

      {/* Tratamiento */}
      <div className="space-y-1.5">
        <Label htmlFor="tratamiento" className="text-xs text-petcast-text-light uppercase tracking-wide flex items-center gap-2">
          <Pill className="w-3.5 h-3.5" />
          Tratamiento
        </Label>
        <Textarea
          id="tratamiento"
          name="tratamiento"
          value={formData.tratamiento}
          onChange={handleChange}
          placeholder="Medicamentos, procedimientos, indicaciones..."
          className="rounded-xl min-h-[80px]"
        />
      </div>

      {/* Observaciones */}
      <div className="space-y-1.5">
        <Label htmlFor="observaciones" className="text-xs text-petcast-text-light uppercase tracking-wide flex items-center gap-2">
          <ClipboardList className="w-3.5 h-3.5" />
          Observaciones
        </Label>
        <Textarea
          id="observaciones"
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          placeholder="Notas adicionales, seguimiento, proxima cita..."
          className="rounded-xl min-h-[80px]"
        />
      </div>

      {!isMobile && (
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Ficha'}
          </Button>
        </div>
      )}
    </form>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose} key={formKey}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              {isEditing ? 'Editar Ficha Medica' : 'Nueva Ficha Medica'}
            </DrawerTitle>
            {mascotaNombre && (
              <p className="text-sm text-petcast-text-light">Paciente: {mascotaNombre}</p>
            )}
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {formContent}
          </div>
          <DrawerFooter>
            <Button type="button" variant="secondary" onClick={onClose} className="w-full">
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              onClick={handleSubmit}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Ficha'}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Modal open={isOpen} onClose={onClose} size="md" key={formKey}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-petcast-heading">
            {isEditing ? 'Editar Ficha Medica' : 'Nueva Ficha Medica'}
          </h3>
          {mascotaNombre && (
            <p className="text-sm text-petcast-text-light">Paciente: {mascotaNombre}</p>
          )}
        </div>
      </div>
      {formContent}
    </Modal>
  );
}
