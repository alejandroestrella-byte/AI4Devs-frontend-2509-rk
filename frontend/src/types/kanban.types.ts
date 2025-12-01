/**
 * Kanban Types
 * Tipos TypeScript para el sistema Kanban de gestión de candidatos
 */

export interface InterviewStep {
  id: number;
  interviewFlowId: number;
  interviewTypeId: number;
  name: string;
  orderIndex: number;
}

export interface InterviewFlow {
  id: number;
  description: string;
  interviewSteps: InterviewStep[];
}

export interface PositionInterviewFlow {
  positionName: string;
  interviewFlow: InterviewFlow;
}

export interface Candidate {
  fullName: string;
  currentInterviewStep: string;
  averageScore: number;
  applicationId?: number; // Optional para compatibilidad con el API
  candidateId?: number; // ID del candidato (opcional, renombrado para evitar conflictos)
}

export interface CandidateWithId extends Candidate {
  id: string; // ID único para drag & drop (string para @dnd-kit)
  applicationId: number; // Requerido en la versión con ID
  interviewStepId: number;
}

export interface KanbanColumn {
  id: number;
  name: string;
  orderIndex: number;
  candidates: CandidateWithId[];
}

export interface UpdateCandidateStageRequest {
  applicationId: number;
  currentInterviewStep: number;
}

export interface UpdateCandidateStageResponse {
  message: string;
  data: {
    id: number;
    positionId: number;
    candidateId: number;
    applicationDate: string;
    currentInterviewStep: number;
    notes: string | null;
    interviews: any[];
  };
}

export interface DragEndEvent {
  active: {
    id: string;
    data: {
      current?: {
        candidate: CandidateWithId;
        columnId: number;
      };
    };
  };
  over: {
    id: string;
    data: {
      current?: {
        columnId: number;
      };
    };
  } | null;
}
