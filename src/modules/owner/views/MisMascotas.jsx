import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint, Calendar, ChevronRight } from 'lucide-react';
import { Title, Description, SearchBar } from '@/shared/components';

export default function MisMascotas() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const mascotas = [
    { id: 1, nombre: 'Max', especie: 'Perro', raza: 'Labrador', edad: '3 anos', ultimaVisita: '10 Ene 2024' },
    { id: 2, nombre: 'Luna', especie: 'Gato', raza: 'Siames', edad: '2 anos', ultimaVisita: '05 Dic 2023' },
  ];

  const filteredMascotas = mascotas.filter(
    (mascota) =>
      mascota.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mascota.raza.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <div className="space-y-4">
        {filteredMascotas.map((mascota) => (
          <button
            key={mascota.id}
            onClick={() => navigate(`/owner/mascota/${mascota.id}`)}
            className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">
                  {mascota.especie === 'Perro' ? '🐕' : '🐈'}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{mascota.nombre}</h3>
                <p className="text-gray-500">{mascota.raza} - {mascota.edad}</p>
                <div className="flex items-center gap-1 mt-1 text-sm text-gray-400">
                  <Calendar className="w-3 h-3" />
                  Ultima visita: {mascota.ultimaVisita}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
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
