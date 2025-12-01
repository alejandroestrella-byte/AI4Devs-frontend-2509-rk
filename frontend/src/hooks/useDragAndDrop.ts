import { useState } from 'react';
import { DragEndEvent as DndKitDragEndEvent } from '@dnd-kit/core';
import { KanbanColumn, CandidateWithId } from '../types/kanban.types';
import KanbanColumnFactory from '../factories/KanbanColumnFactory';
import candidateApiService from '../services/candidateApiService';

interface UseDragAndDropReturn {
  handleDragEnd: (event: DndKitDragEndEvent) => Promise<void>;
  isDragging: boolean;
  dragError: string | null;
}

/**
 * Custom Hook para gestionar la lógica de drag & drop
 * Maneja el movimiento de candidatos entre columnas y la actualización en el backend
 */
export const useDragAndDrop = (
  columns: KanbanColumn[],
  setColumns: React.Dispatch<React.SetStateAction<KanbanColumn[]>>
): UseDragAndDropReturn => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragError, setDragError] = useState<string | null>(null);

  /**
   * Maneja el evento de finalización del drag
   */
  const handleDragEnd = async (event: DndKitDragEndEvent) => {
    const { active, over } = event;
    
    setIsDragging(false);
    setDragError(null);

    // Si no hay destino válido, no hacer nada
    if (!over) {
      return;
    }

    // Obtener los IDs de las columnas origen y destino
    const activeId = active.id as string;
    const overId = over.id as string;

    // Si se suelta en la misma posición, no hacer nada
    if (activeId === overId) {
      return;
    }

    // Encontrar el candidato que se está moviendo
    let sourceColumnId: number | null = null;
    let candidate: CandidateWithId | null = null;

    for (const column of columns) {
      const foundCandidate = column.candidates.find(c => c.id === activeId);
      if (foundCandidate) {
        candidate = foundCandidate;
        sourceColumnId = column.id;
        break;
      }
    }

    if (!candidate || sourceColumnId === null) {
      console.error('Candidate not found');
      return;
    }

    // Determinar la columna destino
    let targetColumnId: number | null = null;

    // Si se suelta sobre una columna
    if (overId.startsWith('column-')) {
      targetColumnId = parseInt(overId.replace('column-', ''));
    } else {
      // Si se suelta sobre otro candidato, encontrar su columna
      for (const column of columns) {
        if (column.candidates.some(c => c.id === overId)) {
          targetColumnId = column.id;
          break;
        }
      }
    }

    if (targetColumnId === null || targetColumnId === sourceColumnId) {
      return;
    }

    // Actualizar el estado local inmediatamente (optimistic update)
    const updatedColumns = KanbanColumnFactory.moveCandidateBetweenColumns(
      columns,
      activeId,
      sourceColumnId,
      targetColumnId
    );

    setColumns(updatedColumns);

    // Actualizar en el backend
    try {
      await candidateApiService.updateCandidateStage(candidate.applicationId, {
        applicationId: candidate.applicationId,
        currentInterviewStep: targetColumnId,
      });
    } catch (error) {
      console.error('Error updating candidate stage:', error);
      setDragError('Failed to update candidate stage. Reverting changes...');
      
      // Revertir cambios en caso de error
      setColumns(columns);
      
      // Limpiar el error después de 3 segundos
      setTimeout(() => {
        setDragError(null);
      }, 3000);
    }
  };

  return {
    handleDragEnd,
    isDragging,
    dragError,
  };
};
