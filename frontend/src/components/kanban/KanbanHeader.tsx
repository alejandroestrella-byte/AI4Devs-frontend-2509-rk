import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/kanban.css';

interface KanbanHeaderProps {
  positionName: string;
  onBack?: () => void;
}

/**
 * Componente de encabezado del Kanban
 * Muestra el título de la posición y un botón para regresar
 */
const KanbanHeader: React.FC<KanbanHeaderProps> = ({ positionName, onBack }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      // Por defecto, navegar a la lista de posiciones
      navigate('/positions');
    }
  };

  return (
    <div className="kanban-header">
      <button 
        className="kanban-back-button" 
        onClick={handleBack}
        aria-label="Go back to positions"
      >
        <span className="back-arrow">←</span>
      </button>
      <h1 className="kanban-title">{positionName}</h1>
    </div>
  );
};

export default KanbanHeader;
