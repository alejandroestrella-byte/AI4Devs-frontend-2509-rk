import axios from 'axios';
import { PositionInterviewFlow, Candidate } from '../types/kanban.types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010';

export interface PositionListItem {
  id: number;
  title: string;
  status: string;
  location: string;
  employmentType: string | null;
  applicationDeadline: Date | null;
  isVisible: boolean;
  company: string;
  companyId: number;
  applicationsCount: number;
}

/**
 * Servicio para interactuar con los endpoints de posiciones
 */
class PositionService {
  /**
   * Obtiene todas las posiciones
   * GET /positions
   */
  async getAllPositions(): Promise<PositionListItem[]> {
    try {
      const response = await axios.get<PositionListItem[]>(
        `${API_BASE_URL}/positions`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching all positions:', error);
      throw new Error('Failed to fetch positions');
    }
  }

  /**
   * Obtiene el flujo de entrevistas para una posición específica
   * GET /positions/:id/interviewFlow
   */
  async getInterviewFlow(positionId: string | number): Promise<PositionInterviewFlow> {
    try {
      const response = await axios.get<PositionInterviewFlow>(
        `${API_BASE_URL}/positions/${positionId}/interviewFlow`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching interview flow:', error);
      throw new Error('Failed to fetch interview flow');
    }
  }

  /**
   * Obtiene todos los candidatos de una posición específica
   * GET /positions/:id/candidates
   */
  async getCandidatesByPosition(positionId: string | number): Promise<Candidate[]> {
    try {
      const response = await axios.get<Candidate[]>(
        `${API_BASE_URL}/positions/${positionId}/candidates`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw new Error('Failed to fetch candidates');
    }
  }
}

export default new PositionService();
