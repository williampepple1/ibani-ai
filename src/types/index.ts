export interface TranslationRequest {
  text: string;
  max_length?: number;
  num_beams?: number;
}

export interface BatchTranslationRequest {
  texts: string[];
  max_length?: number;
  num_beams?: number;
}

export interface TranslationResponse {
  source: string;
  translation: string;
  model: string;
}

export interface BatchTranslationResponse {
  translations: TranslationResponse[];
  count: number;
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  model_path: string;
}

export interface TranslationHistoryItem {
  id: string;
  source: string;
  translation: string;
  timestamp: Date;
}

