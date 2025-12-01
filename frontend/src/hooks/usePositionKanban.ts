import { useState, useEffect, useCallback } from 'react';
import { KanbanColumn, CandidateWithId, PositionInterviewFlow } from '../types/kanban.types';
import positionService from '../services/positionService';
import CandidateCardFactory from '../factories/CandidateCardFactory';
import KanbanColumnFactory from '../factories/KanbanColumnFactory';

interface UsePositionKanbanReturn {
  columns: KanbanColumn[];
  positionName: string;
  loading: boolean;
  error: string | null;
  setColumns: React.Dispatch<React.SetStateAction<KanbanColumn[]>>;
  refetch: () => Promise<void>;
}

/**
 * Custom Hook para gestionar la lógica del Kanban de posiciones
 * Maneja la carga de datos, estado y actualización de columnas
 */
export const usePositionKanban = (positionId: string): UsePositionKanbanReturn => {
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [positionName, setPositionName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Función para cargar los datos del Kanban
   */
  const fetchKanbanData = useCallback(async () => {
    console.log('usePositionKanban - fetchKanbanData called with positionId:', positionId);
    
    if (!positionId) {
      console.log('usePositionKanban - Position ID is missing');
      setError('Position ID is required');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('usePositionKanban - Fetching data...');
      
      // Obtener el flujo de entrevistas y los candidatos en paralelo
      const [interviewFlowData, candidatesData] = await Promise.all([
        positionService.getInterviewFlow(positionId),
        positionService.getCandidatesByPosition(positionId),
      ]);

      console.log('usePositionKanban - Data received:', {
        interviewFlowData,
        candidatesData,
      });

      // Establecer el nombre de la posición
      setPositionName(interviewFlowData.positionName);

      // Crear columnas basadas en los pasos de entrevista
      const interviewSteps = interviewFlowData.interviewFlow.interviewSteps;
      const kanbanColumns = KanbanColumnFactory.createColumns(interviewSteps);

      console.log('usePositionKanban - Columns created:', kanbanColumns);

      // Crear candidatos con IDs únicos y validación
      const validCandidates = candidatesData.filter(candidate =>
        CandidateCardFactory.validateCandidate(candidate)
      );

      console.log('usePositionKanban - Valid candidates:', validCandidates.length);

      const candidatesWithIds = CandidateCardFactory.createMultipleCandidates(
        validCandidates,
        interviewSteps
      );

      console.log('usePositionKanban - Candidates with IDs:', candidatesWithIds);

      // Organizar candidatos en sus columnas correspondientes
      const organizedColumns = KanbanColumnFactory.organizeCandidatesIntoColumns(
        kanbanColumns,
        candidatesWithIds
      );

      console.log('usePositionKanban - Organized columns:', organizedColumns);

      setColumns(organizedColumns);
    } catch (err) {
      console.error('usePositionKanban - Error fetching kanban data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load kanban data');
    } finally {
      setLoading(false);
      console.log('usePositionKanban - Loading finished');
    }
  }, [positionId]);

  /**
   * Cargar datos al montar el componente o cuando cambia el positionId
   */
  useEffect(() => {
    fetchKanbanData();
  }, [fetchKanbanData]);

  return {
    columns,
    positionName,
    loading,
    error,
    setColumns,
    refetch: fetchKanbanData,
  };
};
