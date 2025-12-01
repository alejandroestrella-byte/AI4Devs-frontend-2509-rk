import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanColumn as KanbanColumnType } from '../../types/kanban.types';
import CandidateCard from './CandidateCard';
import '../../styles/kanban.css';

interface KanbanColumnProps {
  column: KanbanColumnType;
}

/**
 * Componente de columna del Kanban
 * Representa una fase del proceso de entrevistas
 * Contiene tarjetas de candidatos y actúa como drop zone
 */
const KanbanColumn: React.FC<KanbanColumnProps> = ({ column }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
    data: {
      columnId: column.id,
    },
  });

  const candidateIds = column.candidates.map(c => c.id);

  return (
    <div 
      ref={setNodeRef}
      className={`kanban-column ${isOver ? 'drag-over' : ''}`}
    >
      <div className="column-header">
        <h3 className="column-title">{column.name}</h3>
        <span className="column-count" aria-label={`${column.candidates.length} candidates`}>
          {column.candidates.length}
        </span>
      </div>
      
      <div className="column-content">
        <SortableContext items={candidateIds} strategy={verticalListSortingStrategy}>
          {column.candidates.length === 0 ? (
            <div className="column-empty">
              <p className="empty-message">No candidates</p>
            </div>
          ) : (
            column.candidates.map(candidate => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;
