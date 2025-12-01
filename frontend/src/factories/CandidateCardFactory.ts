import DOMPurify from 'dompurify';
import { CandidateWithId, Candidate, InterviewStep } from '../types/kanban.types';

/**
 * Factory Pattern para crear tarjetas de candidatos
 * Proporciona sanitización y validación consistente
 */
class CandidateCardFactory {
  /**
   * Crea un candidato con ID único para el sistema de drag & drop
   * Sanitiza los datos de entrada para prevenir XSS
   */
  createCandidateWithId(
    candidate: Candidate,
    applicationId: number,
    interviewSteps: InterviewStep[]
  ): CandidateWithId {
    // Sanitizar el nombre completo
    const sanitizedName = DOMPurify.sanitize(candidate.fullName.trim());
    
    // Sanitizar el paso de entrevista actual
    const sanitizedStep = DOMPurify.sanitize(candidate.currentInterviewStep.trim());
    
    // Validar y normalizar el score
    const normalizedScore = this.normalizeScore(candidate.averageScore);
    
    // Encontrar el ID del paso de entrevista
    const interviewStep = interviewSteps.find(
      step => step.name === sanitizedStep
    );
    
    if (!interviewStep) {
      console.warn(`Interview step "${sanitizedStep}" not found for candidate "${sanitizedName}"`);
    }
    
    return {
      id: `candidate-${applicationId}-${Date.now()}-${Math.random()}`,
      applicationId,
      fullName: sanitizedName,
      currentInterviewStep: sanitizedStep,
      averageScore: normalizedScore,
      interviewStepId: interviewStep?.id || 0,
    };
  }

  /**
   * Crea múltiples candidatos a partir de un array
   */
  createMultipleCandidates(
    candidates: Candidate[],
    interviewSteps: InterviewStep[]
  ): CandidateWithId[] {
    return candidates.map((candidate) => {
      // Usar el applicationId del API si existe, sino generar uno temporal
      const appId = candidate.applicationId || Math.floor(Math.random() * 1000000);
      return this.createCandidateWithId(candidate, appId, interviewSteps);
    });
  }

  /**
   * Normaliza el score para asegurar que esté en el rango válido
   */
  private normalizeScore(score: number): number {
    if (typeof score !== 'number' || isNaN(score)) {
      return 0;
    }
    return Math.max(0, Math.min(10, score));
  }

  /**
   * Valida los datos del candidato
   */
  validateCandidate(candidate: Candidate): boolean {
    if (!candidate.fullName || candidate.fullName.trim() === '') {
      return false;
    }
    if (!candidate.currentInterviewStep || candidate.currentInterviewStep.trim() === '') {
      return false;
    }
    return true;
  }
}

export default new CandidateCardFactory();
