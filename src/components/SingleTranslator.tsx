import React, { useState } from 'react';
import { translationApi } from '../services/api';
import type { TranslationResponse } from '../types';

interface SingleTranslatorProps {
  onTranslationComplete?: (result: TranslationResponse) => void;
}

const SingleTranslator: React.FC<SingleTranslatorProps> = ({ onTranslationComplete }) => {
  const [inputText, setInputText] = useState('');
  const [translation, setTranslation] = useState<TranslationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [maxLength, setMaxLength] = useState(128);
  const [numBeams, setNumBeams] = useState(4);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await translationApi.translate({
        text: inputText,
        max_length: maxLength,
        num_beams: numBeams,
      });
      setTranslation(result);
      if (onTranslationComplete) {
        onTranslationComplete(result);
      }
    } catch (err) {
      setError('Translation failed. Make sure the API server is running.');
      console.error('Translation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setTranslation(null);
    setError(null);
  };

  const handleCopy = async () => {
    if (translation?.translation) {
      await navigator.clipboard.writeText(translation.translation);
      // You could add a toast notification here
    }
  };

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Single Translation</h2>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Options
        </button>
      </div>

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Length: {maxLength}
            </label>
            <input
              type="range"
              min="64"
              max="512"
              value={maxLength}
              onChange={(e) => setMaxLength(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Num Beams: {numBeams}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={numBeams}
              onChange={(e) => setNumBeams(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Higher values provide better quality but slower translation
            </p>
          </div>
        </div>
      )}

      {/* Input Section */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          English Text
        </label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter English text to translate..."
          className="textarea-field"
          rows={6}
          disabled={loading}
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">{inputText.length} characters</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 mb-4">
        <button
          onClick={handleTranslate}
          disabled={loading || !inputText.trim()}
          className="btn-primary flex-1 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Translating...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span>Translate</span>
            </>
          )}
        </button>
        <button
          onClick={handleClear}
          disabled={loading}
          className="btn-secondary"
        >
          Clear
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 animate-fade-in">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Translation Result */}
      {translation && (
        <div className="animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Ibani Translation
            </label>
            <button
              onClick={handleCopy}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy</span>
            </button>
          </div>
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 border-2 border-primary-200 rounded-lg p-6">
            <p className="text-lg text-gray-800 leading-relaxed">{translation.translation}</p>
            <div className="mt-4 pt-4 border-t border-primary-200">
              <p className="text-xs text-gray-600">
                <span className="font-medium">Source:</span> {translation.source}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Model: {translation.model}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleTranslator;

