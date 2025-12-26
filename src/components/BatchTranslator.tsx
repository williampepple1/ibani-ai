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
      .map((t) => `"${t.original_text}","${t.translated_text}"`)
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <h2 className="text-xl font-bold text-slate-900">Batch Translation</h2>
        {translations && (
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-all duration-300"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        )}
      </div>

      <p className="text-slate-500 text-xs font-semibold mb-6">
        Simultaneous neural rendering for text collections
      </p>

      {/* Input Section */}
      <div className="mb-6 group">
        <div className="flex justify-between items-center mb-2 ml-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-focus-within:text-primary-600 transition-colors duration-300">
            Source Collection (One per line)
          </label>
        </div>
        <div className="relative">
          <textarea
            value={inputTexts}
            onChange={(e) => setInputTexts(e.target.value)}
            placeholder="Good morning&#10;Thank you"
            className="input-premium min-h-[160px] resize-none pb-10 font-mono text-[11px] leading-relaxed"
            disabled={loading}
          />
          <div className="absolute bottom-3 right-4 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-white rounded text-[9px] font-bold text-slate-400 border border-slate-100 shadow-sm uppercase tracking-wider">
              {textCount} Items
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={handleTranslate}
          disabled={loading || textCount === 0}
          className="btn-premium flex-1 flex items-center justify-center gap-2 py-3"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
              <span className="tracking-widest uppercase text-xs">Bulk Processing...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="tracking-widest uppercase text-xs">Translate All</span>
            </>
          )}
        </button>
        <button
          onClick={handleClear}
          disabled={loading || !inputTexts}
          className="btn-premium-outline px-4"
          title="Clear"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-in fade-in zoom-in duration-300">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-xs text-red-800 uppercase tracking-tight">Batch Error</p>
            <p className="text-[11px] text-red-600/80 font-bold leading-tight">{error}</p>
          </div>
        </div>
      )}

      {/* Translation Results */}
      {translations && (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="mb-3 flex items-center justify-between ml-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Results ({translations.count})
            </label>
          </div>
          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {translations.translations.map((translation, index) => (
              <div
                key={index}
                className="group relative"
              >
                <div className="relative bg-white border border-slate-100 rounded-xl p-3 shadow-sm transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 premium-gradient text-white rounded-md flex items-center justify-center font-bold text-[10px] shadow-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight line-clamp-1">{translation.original_text}</p>
                      <p className="text-sm text-slate-800 font-bold mt-0.5">{translation.translated_text}</p>
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

