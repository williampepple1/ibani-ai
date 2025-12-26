import React, { useState } from 'react';
import { translationApi } from '../services/api';
import type { BatchTranslationResponse, TranslationResponse } from '../types';

interface BatchTranslatorProps {
  onTranslationComplete?: (results: TranslationResponse[]) => void;
}

const BatchTranslator: React.FC<BatchTranslatorProps> = ({ onTranslationComplete }) => {
  const [inputTexts, setInputTexts] = useState<string>('');
  const [translations, setTranslations] = useState<BatchTranslationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = async () => {
    const texts = inputTexts
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (texts.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const result = await translationApi.batchTranslate({ texts });
      setTranslations(result);
      if (onTranslationComplete) {
        onTranslationComplete(result.translations);
      }
    } catch (err) {
      setError('Batch translation failed. Make sure the API server is running.');
      console.error('Batch translation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInputTexts('');
    setTranslations(null);
    setError(null);
  };

  const handleExport = () => {
    if (!translations) return;

    const csvContent = translations.translations
      .map((t) => `"${t.source}","${t.translation}"`)
      .join('\n');

    const blob = new Blob([`"English","Ibani"\n${csvContent}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ibani-translations-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const textCount = inputTexts
    .split('\n')
    .filter((line) => line.trim().length > 0).length;

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Batch Translation</h2>
        {translations && (
          <button
            onClick={handleExport}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export CSV</span>
          </button>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Enter multiple English texts (one per line) to translate them all at once.
      </p>

      {/* Input Section */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          English Texts (one per line)
        </label>
        <textarea
          value={inputTexts}
          onChange={(e) => setInputTexts(e.target.value)}
          placeholder="Good morning&#10;Thank you&#10;How are you"
          className="textarea-field"
          rows={8}
          disabled={loading}
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">{textCount} texts to translate</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 mb-4">
        <button
          onClick={handleTranslate}
          disabled={loading || textCount === 0}
          className="btn-primary flex-1 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Translating {textCount} texts...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span>Translate All</span>
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

      {/* Translation Results */}
      {translations && (
        <div className="animate-slide-up">
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Translations ({translations.count})
            </label>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {translations.translations.map((translation, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">English:</span> {translation.source}
                    </p>
                    <p className="text-base text-gray-800 font-medium">
                      <span className="text-sm text-gray-600 font-normal">Ibani:</span> {translation.translation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchTranslator;

