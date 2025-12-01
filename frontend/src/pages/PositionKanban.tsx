import React, { Suspense, lazy } from 'react';
import { useParams } from 'react-router-dom';
import { usePositionKanban } from '../hooks/usePositionKanban';
import KanbanHeader from '../components/kanban/KanbanHeader';
import '../styles/kanban.css';

// Lazy loading del componente KanbanBoard
const KanbanBoard = lazy(() => import('../components/kanban/KanbanBoard'));

/**
 * Página principal del Kanban de posiciones
 * Gestiona el estado y renderiza el tablero Kanban para una posición específica
 */
const PositionKanban: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  console.log('PositionKanban - Position ID:', id);
  
  const {
    columns,
    positionName,
    loading,
    error,
    setColumns,
    refetch,
  } = usePositionKanban(id || '');

  console.log('PositionKanban - State:', { loading, error, columnsCount: columns.length, positionName });

  // Loading state
  if (loading) {
    return (
      <div className="kanban-container">
        <div className="kanban-loading">
          <div className="spinner" aria-label="Loading"></div>
          <p>Loading position data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="kanban-container">
        <div className="kanban-error" role="alert">
          <h2>Error Loading Position</h2>
          <p>{error}</p>
          <button onClick={refetch} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!positionName) {
    return (
      <div className="kanban-container">
        <div className="kanban-error" role="alert">
          <h2>Position Not Found</h2>
          <p>The requested position could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="kanban-container">
      <KanbanHeader positionName={positionName} />
      
      <Suspense
        fallback={
          <div className="kanban-loading">
            <div className="spinner" aria-label="Loading board"></div>
            <p>Loading kanban board...</p>
          </div>
        }
      >
        <KanbanBoard columns={columns} setColumns={setColumns} />
      </Suspense>
    </div>
  );
};

export default PositionKanban;
