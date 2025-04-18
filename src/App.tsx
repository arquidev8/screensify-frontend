import React, { useEffect, ReactNode, FC } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import MainLayout from './components/layout/MainLayout';
import ProjectsPage from './pages/projects/ProjectsPage';
import ScreensPage from './pages/screens/ScreensPage';
import EditorPage from './pages/editor/EditorPage';

// Componente para rutas protegidas
interface ProtectedRouteProps { children: ReactNode }
const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
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
interface AuthRouteProps { children: ReactNode }
const AuthRoute: FC<AuthRouteProps> = ({ children }) => {
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
              <ProjectsPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        {/* Página de proyectos */}
        <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
        {/* Página de pantallas */}
        <Route path="/screens" element={<ProtectedRoute><ScreensPage /></ProtectedRoute>} />
        {/* Editor visual */}
        <Route path="/editor/:screenId" element={
          <ProtectedRoute>
            <MainLayout>
              <EditorPage />
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