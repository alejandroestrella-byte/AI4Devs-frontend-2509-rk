import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CandidateWithId } from '../../types/kanban.types';
import '../../styles/kanban.css';

interface CandidateCardProps {
  candidate: CandidateWithId;
}

/**
 * Componente de tarjeta de candidato
 * Representa un candidato individual en el tablero Kanban
 * Implementa drag & drop con @dnd-kit
 */
const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: candidate.id,
    data: {
      candidate,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  /**
   * Renderiza las estrellas basadas en el score promedio
   */
  const renderStars = () => {
    const score = Math.round(candidate.averageScore);
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={`star ${i <= score ? 'filled' : 'empty'}`}
          aria-hidden="true"
        >
          {i <= score ? '★' : '☆'}
        </span>
      );
    }
    
    return <div className="candidate-stars">{stars}</div>;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`candidate-card ${isDragging ? 'dragging' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="candidate-info">
        <h4 className="candidate-name">{candidate.fullName}</h4>
        <div className="candidate-score">
          {renderStars()}
          <span className="score-text" aria-label={`Average score: ${candidate.averageScore}`}>
            {candidate.averageScore > 0 ? candidate.averageScore.toFixed(1) : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
