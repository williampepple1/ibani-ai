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
    <div className="glass-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <h2 className="text-3xl font-bold text-slate-900">Batch Translation</h2>
        {translations && (
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        )}
      </div>

      <p className="text-slate-500 font-medium mb-10">
        Highly efficient simultaneous translation for large datasets.
      </p>

      {/* Input Section */}
      <div className="mb-8 group">
        <div className="flex justify-between items-center mb-3 ml-1">
          <label className="text-sm font-bold text-slate-600 group-focus-within:text-primary-600 transition-colors duration-300">
            Source Collection (One sentence per line)
          </label>
        </div>
        <div className="relative">
          <textarea
            value={inputTexts}
            onChange={(e) => setInputTexts(e.target.value)}
            placeholder="Good morning&#10;Thank you&#10;How are you"
            className="input-premium min-h-[220px] resize-none pb-12 font-mono text-sm leading-relaxed"
            disabled={loading}
          />
          <div className="absolute bottom-4 right-6 flex items-center gap-3">
            <span className="px-3 py-1 bg-white rounded-full text-[10px] font-bold text-slate-400 border border-slate-100 shadow-sm uppercase tracking-wider">
              {textCount} Segments
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-10">
        <button
          onClick={handleTranslate}
          disabled={loading || textCount === 0}
          className="btn-premium flex-1 flex items-center justify-center gap-3 py-5"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
              <span className="tracking-wide">Bulk Processing {textCount} items...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="tracking-wide">Translate Collection</span>
            </>
          )}
        </button>
        <button
          onClick={handleClear}
          disabled={loading || !inputTexts}
          className="btn-premium-outline px-6"
          title="Clear collection"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-8 p-5 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-4 animate-in fade-in zoom-in duration-300">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-red-800">Batch Impediment</p>
            <p className="text-sm text-red-600/80 font-medium leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Translation Results */}
      {translations && (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="mb-4 flex items-center justify-between ml-1">
            <label className="text-sm font-bold text-slate-600">
              Processed Results ({translations.count})
            </label>
          </div>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {translations.translations.map((translation, index) => (
              <div
                key={index}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-400/20 to-indigo-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-white border border-slate-100 rounded-2xl p-5 shadow-sm transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 premium-gradient text-white rounded-lg flex items-center justify-center font-bold text-xs shadow-md">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="mb-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">English</span>
                        <p className="text-slate-500 font-medium line-clamp-2">{translation.source}</p>
                      </div>
                      <div className="pt-3 border-t border-slate-50">
                        <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest block mb-1">Ibani</span>
                        <p className="text-slate-800 font-bold text-lg">{translation.translation}</p>
                      </div>
                    </div>
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

