// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout'; 
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Materias from './pages/Materias'; 
import Rendimiento from './pages/Rendimiento';
import RegistroNotas from './pages/RegistroNotas';
import Recomendaciones from './pages/Recomendaciones';
import Configuracion from './pages/Configuracion';

// Componente para proteger rutas
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Login onLoginSuccess={() => window.location.reload()} />;
  }
  
  return children;
}

// Componente de rutas principales
function AppRoutes() {
  const { user } = useAuth();

  // Si no hay usuario, mostrar solo login
  if (!user) {
    return <Login onLoginSuccess={() => window.location.reload()} />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/materias" element={<Materias />} />
        <Route path="/registro" element={<RegistroNotas />} />
        <Route path="/rendimiento" element={<Rendimiento />} />
        <Route path="/recomendaciones" element={<Recomendaciones />} />
        <Route path="/config" element={<Configuracion />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;