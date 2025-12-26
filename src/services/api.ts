import axios from 'axios';
import type {
  TranslationRequest,
  BatchTranslationRequest,
  TranslationResponse,
  BatchTranslationResponse,
  HealthResponse,
} from '../types';

// Get API base URL from environment variable or use default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export const translationApi = {
  // Health check
  checkHealth: async (): Promise<HealthResponse> => {
    const response = await api.get<HealthResponse>('/api/health');
    return response.data;
  },

  // Single translation
  translate: async (request: TranslationRequest): Promise<TranslationResponse> => {
    const response = await api.post<TranslationResponse>('/api/translate', request);
    return response.data;
  },

  // Batch translation
  batchTranslate: async (request: BatchTranslationRequest): Promise<BatchTranslationResponse> => {
    const response = await api.post<BatchTranslationResponse>('/api/batch-translate', request);
    return response.data;
  },
};

export default api;

