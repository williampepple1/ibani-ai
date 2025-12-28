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
  original_text: string;
  translated_text: string;
  source_language: string;
  target_language: string;
  success: boolean;
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

// Dictionary types
export interface DictionaryEntry {
  Ibani: string;
  Pos: string;
  Meaning: string;
}

export interface DictionarySearchResponse {
  results: DictionaryEntry[];
  count: number;
}
