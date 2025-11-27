import { Clock } from 'lucide-react';

export default function ActividadReciente({ actividad = [] }) {
  if (actividad.length === 0) return null;

  return (
    <div className="bg-white rounded-t-2xl shadow-sm border border-gray-100 border-b-0 overflow-hidden flex flex-col relative">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex-shrink-0">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-400" />
          Actividad reciente
        </h3>
      </div>

      {/* Lista de actividad */}
      <div className="px-6 pb-8">
        {actividad.map((item, index) => (
          <ActividadItem
            key={item.id || index}
            texto={item.texto}
            tiempo={item.tiempo}
            isLast={index === actividad.length - 1}
          />
        ))}
      </div>

      {/* Efecto difuminado en el bottom - sombra que se desvanece */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-400/40 via-gray-300/20 to-transparent pointer-events-none" />
    </div>
  );
}

function ActividadItem({ texto, tiempo, isLast }) {
  return (
    <div className={`flex items-center justify-between py-4 ${!isLast ? 'border-b border-gray-100' : ''}`}>
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0" />
        <p className="text-gray-700">{texto}</p>
      </div>
      <span className="text-sm text-gray-400 whitespace-nowrap ml-4">{tiempo}</span>
    </div>
  );
}
