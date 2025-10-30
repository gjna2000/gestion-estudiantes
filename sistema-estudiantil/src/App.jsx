

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'; 
import Dashboard from './pages/Dashboard';
import Materias from './pages/Materias'; 
import Rendimiento from './pages/Rendimiento';
import RegistroNotas from './pages/RegistroNotas';
import Recomendaciones from './pages/Recomendaciones';
import Configuracion from './pages/Configuracion';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/materias" element={<Materias />} />
        <Route path="/registro" element={<RegistroNotas />} />
        <Route path="/rendimiento" element={<Rendimiento />} />
        <Route path="/recomendaciones" element={<Recomendaciones />} />
        <Route path="/config" element={<Configuracion />} />
        <Route path="*" element={<Dashboard />} /> 
      </Routes>
    </Layout>
  );
}

export default App;