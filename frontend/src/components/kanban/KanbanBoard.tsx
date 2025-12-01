import React from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { KanbanColumn as KanbanColumnType } from '../../types/kanban.types';
import KanbanColumn from './KanbanColumn';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import '../../styles/kanban.css';

interface KanbanBoardProps {
  columns: KanbanColumnType[];
  setColumns: React.Dispatch<React.SetStateAction<KanbanColumnType[]>>;
}

/**
 * Componente principal del tablero Kanban
 * Gestiona el contexto de drag & drop y renderiza todas las columnas
 */
const KanbanBoard: React.FC<KanbanBoardProps> = ({ columns, setColumns }) => {
  const { handleDragEnd, dragError } = useDragAndDrop(columns, setColumns);

  // Configurar sensores para drag & drop
  // PointerSensor para mouse y TouchSensor para dispositivos táctiles
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Requiere mover 8px antes de activar el drag
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // Esperar 200ms antes de activar en touch
        tolerance: 5,
      },
    })
  );

  return (
    <>
      {dragError && (
        <div className="kanban-error" role="alert">
          <p>{dragError}</p>
        </div>
      )}
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className="kanban-board">
          {columns.map(column => (
            <KanbanColumn key={column.id} column={column} />
          ))}
        </div>
        
        <DragOverlay>
          {/* Aquí podríamos renderizar una preview del elemento siendo arrastrado */}
          <div className="drag-overlay-placeholder" />
        </DragOverlay>
      </DndContext>
    </>
  );
};

export default KanbanBoard;
