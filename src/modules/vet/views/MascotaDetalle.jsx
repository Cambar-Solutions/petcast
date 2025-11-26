import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, QrCode, Calendar, FileText } from 'lucide-react';
import { Button } from '@/shared/components';

// Datos de ejemplo - en producción vendrían de una API
const mascotaData = {
  id: 1,
  nombre: 'Solovino',
  tipo: 'Canino',
  edad: '6 años',
  peso: '16kg',
  sexo: 'Macho',
  tamano: 'Chico',
  color: '#8B4513',
  colorNombre: 'Café',
  imagen: null,
  ultimaRevision: {
    fecha: '10 oct 2025',
    tipo: 'Revisión Anual',
    notas: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ornare dignissim sapien. Integer ut augue bibendum, auctor orci faucibus, vestibulum erat. Sed id turpis at lacus condimentum suscipit in id libero. Aliquam vitae cursus mi. Vestibulum tempor velit sit amet faucibus pulvinar. Aenean tincidunt tortor a sem sagittis, et congue nibh tristique.'
  },
  propietario: {
    nombre: 'Jonathan Ocampo Flores',
    telefono: '7771523546',
    correo: 'jonyocampo05@gmail.com',
    direccion: 'Sor Juana Inés de la Cruz, 24'
  }
};

export default function MascotaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  // En producción, aquí cargaríamos los datos de la mascota por ID
  const mascota = mascotaData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl text-petcast-text hover:bg-petcast-bg-soft transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-petcast-heading">Detalle de Mascota</h1>
          <p className="text-petcast-text-light">Información completa del paciente</p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Columna izquierda - Info de mascota */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            {/* Imagen y nombre */}
            <div className="flex flex-col items-center mb-5 pb-5 border-b border-petcast-bg-soft">
              <div className="w-28 h-28 bg-petcast-bg-soft rounded-2xl flex items-center justify-center mb-3 overflow-hidden">
                {mascota.imagen ? (
                  <img src={mascota.imagen} alt={mascota.nombre} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-petcast-text-light">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <h2 className="text-lg font-semibold text-petcast-heading">{mascota.nombre}</h2>
            </div>

            {/* Tipo de animal */}
            <div className="mb-4 pb-4 border-b border-petcast-bg-soft">
              <p className="text-xs text-petcast-text-light uppercase tracking-wide mb-1">Tipo</p>
              <p className="font-medium text-petcast-heading">{mascota.tipo}</p>
            </div>

            {/* Edad y Peso */}
            <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-petcast-bg-soft">
              <div>
                <p className="text-xs text-petcast-text-light uppercase tracking-wide mb-1">Edad</p>
                <p className="font-medium text-petcast-heading">{mascota.edad}</p>
              </div>
              <div>
                <p className="text-xs text-petcast-text-light uppercase tracking-wide mb-1">Peso</p>
                <p className="font-medium text-petcast-heading">{mascota.peso}</p>
              </div>
            </div>

            {/* Sexo y Tamaño */}
            <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-petcast-bg-soft">
              <div>
                <p className="text-xs text-petcast-text-light uppercase tracking-wide mb-1">Sexo</p>
                <p className="font-medium text-petcast-heading">{mascota.sexo}</p>
              </div>
              <div>
                <p className="text-xs text-petcast-text-light uppercase tracking-wide mb-1">Tamaño</p>
                <p className="font-medium text-petcast-heading">{mascota.tamano}</p>
              </div>
            </div>

            {/* Color */}
            <div className="mb-5 pb-5 border-b border-petcast-bg-soft">
              <p className="text-xs text-petcast-text-light uppercase tracking-wide mb-2">Color</p>
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: mascota.color }}
                />
                <span className="font-medium text-petcast-heading">{mascota.colorNombre}</span>
              </div>
            </div>

            {/* Botón QR */}
            <Button variant="outline" className="w-full flex items-center justify-center gap-2 rounded-xl">
              <QrCode className="w-4 h-4" />
              Consultar QR
            </Button>
          </div>
        </div>

        {/* Columna derecha - Notas y Propietario */}
        <div className="flex-1 flex flex-col gap-6">

          {/* Sección de Notas */}
          <div className="flex-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-petcast-text-light">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{mascota.ultimaRevision.fecha}</span>
              </div>
              <span className="text-sm font-medium text-petcast-heading">{mascota.ultimaRevision.tipo}</span>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-petcast-heading mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Notas:
              </h3>
              <p className="text-sm text-petcast-text leading-relaxed">
                {mascota.ultimaRevision.notas}
              </p>
            </div>
          </div>

          {/* Sección de Propietario */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-petcast-heading mb-4">Propietario</h3>

            <div className="space-y-3">
              <div className="flex">
                <span className="w-24 text-sm text-petcast-text-light flex-shrink-0">Nombre:</span>
                <span className="text-sm text-petcast-heading">{mascota.propietario.nombre}</span>
              </div>
              <div className="flex">
                <span className="w-24 text-sm text-petcast-text-light flex-shrink-0">Telefono:</span>
                <span className="text-sm text-petcast-heading">{mascota.propietario.telefono}</span>
              </div>
              <div className="flex">
                <span className="w-24 text-sm text-petcast-text-light flex-shrink-0">Correo:</span>
                <span className="text-sm text-petcast-heading">{mascota.propietario.correo}</span>
              </div>
              <div className="flex">
                <span className="w-24 text-sm text-petcast-text-light flex-shrink-0">Direccion:</span>
                <span className="text-sm text-petcast-heading">{mascota.propietario.direccion}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
