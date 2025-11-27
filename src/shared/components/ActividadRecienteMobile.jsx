import { Clock } from 'lucide-react';

export default function ActividadRecienteMobile({ actividad = [] }) {
  if (actividad.length === 0) return null;

  return (
    <div className="px-4 mt-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Actividad reciente
      </h3>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {actividad.slice(0, 4).map((item, index) => (
          <div
            key={item.id || index}
            className={`flex items-center justify-between px-4 py-3 ${
              index !== Math.min(actividad.length - 1, 3) ? 'border-b border-gray-50' : ''
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0" />
              <p className="text-sm text-gray-700 truncate">{item.texto}</p>
            </div>
            <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{item.tiempo}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
