import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/shared/context/AuthContext';
import ProtectedRoute from '@/shared/components/ProtectedRoute';
import PublicRoute from '@/shared/components/PublicRoute';

// Pages (solo paginas publicas)
import Login from '@/pages/Login';
import Unauthorized from '@/pages/Unauthorized';

// Modules
import {
  AdminDashboard,
  Veterinarios,
  Estadisticas,
} from '@/modules/admin';

import {
  VetDashboard,
  Mascotas,
  MascotaDetalle,
  Duenos,
  Citas,
  FichaMedica,
} from '@/modules/vet';

import {
  OwnerDashboard,
  MisMascotas,
  DetalleMascota,
  MisCitas,
} from '@/modules/owner';

// Layout
import MainLayout from '@/layouts/MainLayout';

// Componente de redireccion por defecto
function DefaultRedirect() {
  const { isAuthenticated, getRedirectPath } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={getRedirectPath()} replace />;
  }

  return <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Ruta por defecto */}
          <Route path="/" element={<DefaultRedirect />} />

          {/* Login - Ruta publica */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Rutas de Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <MainLayout>
                  <AdminDashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/veterinarios"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <MainLayout>
                  <Veterinarios />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/estadisticas"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <MainLayout>
                  <Estadisticas />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Rutas de Veterinario */}
          <Route
            path="/vet"
            element={
              <ProtectedRoute allowedRoles={['VET']}>
                <MainLayout>
                  <VetDashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/vet/mascotas"
            element={
              <ProtectedRoute allowedRoles={['VET']}>
                <MainLayout>
                  <Mascotas />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/vet/mascota/:id"
            element={
              <ProtectedRoute allowedRoles={['VET']}>
                <MainLayout>
                  <MascotaDetalle />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/vet/duenos"
            element={
              <ProtectedRoute allowedRoles={['VET']}>
                <MainLayout>
                  <Duenos />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/vet/citas"
            element={
              <ProtectedRoute allowedRoles={['VET']}>
                <MainLayout>
                  <Citas />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/vet/ficha/:codigo"
            element={
              <ProtectedRoute allowedRoles={['VET']}>
                <MainLayout>
                  <FichaMedica />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Rutas de Owner */}
          <Route
            path="/owner"
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <MainLayout>
                  <OwnerDashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/mascotas"
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <MainLayout>
                  <MisMascotas />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/mascota/:id"
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <MainLayout>
                  <DetalleMascota />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/citas"
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <MainLayout>
                  <MisCitas />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Ruta de acceso denegado */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Cualquier otra ruta */}
          <Route path="*" element={<DefaultRedirect />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
