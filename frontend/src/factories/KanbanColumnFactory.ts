import { KanbanColumn, InterviewStep, CandidateWithId } from '../types/kanban.types';

/**
 * Factory Pattern para crear columnas del Kanban
 * Proporciona una forma consistente de crear columnas basadas en los pasos de entrevista
 */
class KanbanColumnFactory {
  /**
   * Crea una columna del Kanban basada en un paso de entrevista
   */
  createColumn(interviewStep: InterviewStep): KanbanColumn {
    return {
      id: interviewStep.id,
      name: interviewStep.name,
      orderIndex: interviewStep.orderIndex,
      candidates: [],
    };
  }

  /**
   * Crea múltiples columnas a partir de un array de pasos de entrevista
   */
  createColumns(interviewSteps: InterviewStep[]): KanbanColumn[] {
    return interviewSteps
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map(step => this.createColumn(step));
  }

  /**
   * Organiza candidatos en sus columnas correspondientes
   */
  organizeCandidatesIntoColumns(
    columns: KanbanColumn[],
    candidates: CandidateWithId[]
  ): KanbanColumn[] {
    // Crear un mapa de columnas para acceso rápido
    const columnMap = new Map<string, KanbanColumn>();
    
    columns.forEach(column => {
      columnMap.set(column.name, {
        ...column,
        candidates: [],
      });
    });

    // Asignar candidatos a sus columnas correspondientes
    candidates.forEach(candidate => {
      const column = columnMap.get(candidate.currentInterviewStep);
      if (column) {
        column.candidates.push(candidate);
      } else {
        console.warn(
          `No column found for candidate ${candidate.fullName} with step ${candidate.currentInterviewStep}`
        );
      }
    });

    // Convertir el mapa de vuelta a un array y ordenar por orderIndex
    return Array.from(columnMap.values()).sort(
      (a, b) => a.orderIndex - b.orderIndex
    );
  }

  /**
   * Actualiza una columna específica con nuevos candidatos
   */
  updateColumnCandidates(
    columns: KanbanColumn[],
    columnId: number,
    candidates: CandidateWithId[]
  ): KanbanColumn[] {
    return columns.map(column =>
      column.id === columnId
        ? { ...column, candidates }
        : column
    );
  }

  /**
   * Mueve un candidato de una columna a otra
   */
  moveCandidateBetweenColumns(
    columns: KanbanColumn[],
    candidateId: string,
    sourceColumnId: number,
    targetColumnId: number
  ): KanbanColumn[] {
    let candidateToMove: CandidateWithId | null = null;

    // Crear nuevas columnas con el candidato removido de la columna origen
    const updatedColumns = columns.map(column => {
      if (column.id === sourceColumnId) {
        const newCandidates = column.candidates.filter(candidate => {
          if (candidate.id === candidateId) {
            candidateToMove = candidate;
            return false;
          }
          return true;
        });
        return { ...column, candidates: newCandidates };
      }
      return column;
    });

    // Si no se encontró el candidato, retornar las columnas sin cambios
    if (!candidateToMove) {
      console.error(`Candidate ${candidateId} not found in column ${sourceColumnId}`);
      return columns;
    }

    // Agregar el candidato a la columna destino
    return updatedColumns.map(column => {
      if (column.id === targetColumnId && candidateToMove) {
        return {
          ...column,
          candidates: [...column.candidates, candidateToMove],
        };
      }
      return column;
    });
  }
}

export default new KanbanColumnFactory();
