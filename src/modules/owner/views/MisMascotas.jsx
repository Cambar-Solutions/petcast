import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint, Calendar, ChevronRight, Loader2 } from 'lucide-react';
import { Title, Description, SearchBar } from '@/shared/components';
import { usePetsByOwner } from '@/shared/hooks';
import { useAuth } from '@/shared/context/AuthContext';

export default function MisMascotas() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: mascotas = [], isLoading, error } = usePetsByOwner(user?.id);

  // Formatear edad
  const formatearEdad = (edad) => {
    if (!edad && edad !== 0) return null;
    return edad === 1 ? '1 año' : `${edad} años`;
  };

  // Obtener última ficha médica
  const getUltimaVisita = (fichasMedicas) => {
    if (!fichasMedicas || fichasMedicas.length === 0) return 'Sin visitas';
    // Ordenar por fecha y tomar la más reciente
    const ordenadas = [...fichasMedicas].sort((a, b) =>
      new Date(b.fechaConsulta) - new Date(a.fechaConsulta)
    );
    return new Date(ordenadas[0].fechaConsulta).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Mapear datos del backend
  const mappedMascotas = mascotas.map((m) => ({
    id: m.id,
    nombre: m.nombre,
    especie: m.especie,
    raza: m.raza || 'Sin raza',
    edad: formatearEdad(m.edad),
    ultimaVisita: getUltimaVisita(m.fichasMedicas),
  }));

  const filteredMascotas = mappedMascotas.filter(
    (mascota) =>
      mascota.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mascota.raza.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-petcast-orange" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error al cargar mascotas</p>
        <p className="text-gray-500 text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <Title variant="page-title">Mis Mascotas</Title>
        <Description variant="section-description" mobileText="Tus mascotas">
          Tus mascotas registradas
        </Description>
      </div>

      {/* Buscador */}
      <SearchBar
        placeholder="Buscar mascota..."
        value={searchTerm}
        onChange={setSearchTerm}
        debounceMs={300}
      />

      {/* Grid de mascotas - 3 columnas en desktop, 1 en mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMascotas.map((mascota) => (
          <button
            key={mascota.id}
            onClick={() => navigate(`/owner/mascota/${mascota.id}`)}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:scale-[1.02] transition-all text-left group"
          >
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 bg-petcast-bg-soft rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">
                  {mascota.especie === 'Perro' ? '🐕' : mascota.especie === 'Gato' ? '🐈' : '🐾'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-gray-900 truncate">{mascota.nombre}</h3>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-petcast-orange transition-colors flex-shrink-0" />
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {mascota.raza}{mascota.edad ? ` • ${mascota.edad}` : ''}
                </p>
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>{mascota.ultimaVisita}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {filteredMascotas.length === 0 && (
        <div className="text-center py-12">
          <PawPrint className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchTerm ? 'No se encontraron mascotas' : 'Aun no tienes mascotas registradas'}
          </p>
          {!searchTerm && (
            <p className="text-sm text-gray-400">Contacta a tu veterinario para registrar a tu mascota</p>
          )}
        </div>
      )}
    </div>
  );
}
