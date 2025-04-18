import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import MainLayout from './components/layout/MainLayout';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, token, fetchUserProfile } = useAuthStore();
  
  useEffect(() => {
    // Si hay token pero no tenemos datos del usuario, intentamos obtenerlos
    if (token && !isAuthenticated) {
      fetchUserProfile();
    }
  }, [token, isAuthenticated, fetchUserProfile]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Componente para rutas de autenticación (redirige si ya está autenticado)
const AuthRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas de autenticación */}
        <Route path="/login" element={
          <AuthRoute>
            <LoginPage />
          </AuthRoute>
        } />
        <Route path="/register" element={
          <AuthRoute>
            <RegisterPage />
          </AuthRoute>
        } />
        
        {/* Rutas protegidas */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MainLayout>
              <div>Dashboard (Próximamente)</div>
            </MainLayout>
          </ProtectedRoute>
        } />
        
        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;