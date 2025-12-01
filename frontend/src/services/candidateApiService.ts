import axios from 'axios';
import { UpdateCandidateStageRequest, UpdateCandidateStageResponse } from '../types/kanban.types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010';

/**
 * Servicio para actualizar el estado de candidatos
 */
class CandidateApiService {
  /**
   * Actualiza la etapa de entrevista de un candidato
   * PUT /candidates/:id/stage
   */
  async updateCandidateStage(
    candidateId: string | number,
    data: UpdateCandidateStageRequest
  ): Promise<UpdateCandidateStageResponse> {
    try {
      const response = await axios.put<UpdateCandidateStageResponse>(
        `${API_BASE_URL}/candidates/${candidateId}/stage`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error updating candidate stage:', error);
      throw new Error('Failed to update candidate stage');
    }
  }
}

export default new CandidateApiService();
