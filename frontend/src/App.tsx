import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';

// Componentes existentes
import RecruiterDashboard from './components/RecruiterDashboard';
import AddCandidate from './components/AddCandidateForm';
import Positions from './components/Positions';

// Lazy loading de componentes pesados
const PositionKanban = lazy(() => import('./pages/PositionKanban'));

/**
 * Componente principal de la aplicación
 * Maneja el routing y la navegación entre páginas
 */
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Suspense
            fallback={
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '100vh' 
              }}>
                <div>Loading...</div>
              </div>
            }
          >
            <Routes>
              {/* Ruta principal - Dashboard del reclutador */}
              <Route path="/" element={<RecruiterDashboard />} />
              
              {/* Añadir candidato */}
              <Route path="/add-candidate" element={<AddCandidate />} />
              
              {/* Lista de posiciones */}
              <Route path="/positions" element={<Positions />} />
              
              {/* Kanban de candidatos para una posición específica */}
              <Route path="/position/:id" element={<PositionKanban />} />
              
              {/* Ruta 404 - redirige al dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
