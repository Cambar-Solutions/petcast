import { ShieldX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../shared/components';
import { useAuth } from '../shared/context/AuthContext';

export default function Unauthorized() {
  const navigate = useNavigate();
  const { getRedirectPath, isAuthenticated } = useAuth();

  const handleGoBack = () => {
    if (isAuthenticated) {
      navigate(getRedirectPath());
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldX className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Acceso Denegado</h1>
        <p className="text-gray-600 mb-6 max-w-md">
          No tienes permisos para acceder a esta pagina. Si crees que esto es un error, contacta al administrador.
        </p>
        <Button variant="primary" onClick={handleGoBack}>
          Volver al Inicio
        </Button>
      </div>
    </div>
  );
}
