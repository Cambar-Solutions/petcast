import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, PawPrint, Calendar, Syringe, FileText, Weight } from 'lucide-react';
import { Button } from '@/shared/components';

export default function FichaMedica() {
  const { codigo } = useParams();
  const navigate = useNavigate();

  // Datos mock de la mascota
  const mascota = {
    id: codigo || '001',
    nombre: 'Max',
    especie: 'Perro',
    raza: 'Labrador',
    edad: '3 anos',
    peso: '28 kg',
    color: 'Dorado',
    dueno: {
      nombre: 'Maria Garcia',
      telefono: '+52 123 456 7890',
      email: 'maria@email.com',
    },
    historial: [
      { fecha: '2024-01-10', tipo: 'Vacunacion', descripcion: 'Vacuna antirabica' },
      { fecha: '2023-12-15', tipo: 'Consulta', descripcion: 'Revision general - Todo bien' },
      { fecha: '2023-10-20', tipo: 'Desparasitacion', descripcion: 'Desparasitante oral' },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-xl"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ficha Medica</h1>
          <p className="text-gray-600">Codigo: {codigo || 'N/A'}</p>
        </div>
      </div>

      {/* Info principal */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
            <span className="text-4xl">🐕</span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{mascota.nombre}</h2>
            <p className="text-gray-500">{mascota.raza} - {mascota.especie}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                {mascota.edad}
              </span>
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm flex items-center gap-1">
                <Weight className="w-3 h-3" /> {mascota.peso}
              </span>
              <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm">
                {mascota.color}
              </span>
            </div>
          </div>
        </div>

        {/* Dueno */}
        <div className="p-4 bg-gray-50 rounded-xl">
          <p className="text-xs text-gray-400 mb-1">Dueno</p>
          <p className="font-medium text-gray-900">{mascota.dueno.nombre}</p>
          <p className="text-sm text-gray-500">{mascota.dueno.telefono} | {mascota.dueno.email}</p>
        </div>
      </div>

      {/* Historial */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Historial Medico</h3>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Agregar Nota
          </Button>
        </div>
        <div className="space-y-3">
          {mascota.historial.map((item, i) => (
            <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                item.tipo === 'Vacunacion' ? 'bg-green-100' :
                item.tipo === 'Consulta' ? 'bg-blue-100' : 'bg-purple-100'
              }`}>
                {item.tipo === 'Vacunacion' ? (
                  <Syringe className="w-5 h-5 text-green-600" />
                ) : item.tipo === 'Consulta' ? (
                  <PawPrint className="w-5 h-5 text-blue-600" />
                ) : (
                  <FileText className="w-5 h-5 text-purple-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">{item.tipo}</span>
                  <span className="text-sm text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {item.fecha}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{item.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
