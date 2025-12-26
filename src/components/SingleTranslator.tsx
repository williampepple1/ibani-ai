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
    <div className="glass-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Single Translation</h2>
          <p className="text-slate-500 font-medium">Translate phrases with deep contextual awareness</p>
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 transition-all duration-300"
        >
          <svg className={`w-4 h-4 transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {showAdvanced ? 'Hide' : 'Show'} Advanced
        </button>
      </div>

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="mb-8 p-6 bg-slate-50/50 rounded-2xl border border-slate-200/50 space-y-6 animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700">Max Length</label>
                <span className="px-2 py-1 bg-white rounded-md text-xs font-bold text-primary-600 shadow-sm border border-slate-100">{maxLength}</span>
              </div>
              <input
                type="range"
                min="64"
                max="512"
                step="8"
                value={maxLength}
                onChange={(e) => setMaxLength(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700">Num Beams</label>
                <span className="px-2 py-1 bg-white rounded-md text-xs font-bold text-primary-600 shadow-sm border border-slate-100">{numBeams}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={numBeams}
                onChange={(e) => setNumBeams(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
            </div>
          </div>
          <p className="text-xs text-slate-400 font-medium italic">
            * Adjusting these settings can balance between translation speed and linguistic depth.
          </p>
        </div>
      )}

      {/* Input Section */}
      <div className="mb-8 group">
        <label className="block text-sm font-bold text-slate-600 mb-3 ml-1 group-focus-within:text-primary-600 transition-colors duration-300">
          Source Text (English)
        </label>
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="input-premium min-h-[160px] resize-none pb-12"
            disabled={loading}
          />
          <div className="absolute bottom-4 right-6 flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400">
              {inputText.length} chars
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-10">
        <button
          onClick={handleTranslate}
          disabled={loading || !inputText.trim()}
          className="btn-premium flex-1 flex items-center justify-center gap-3 py-5"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
              <span className="tracking-wide">Deep Processing...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="tracking-wide">Translate Now</span>
            </>
          )}
        </button>
        <button
          onClick={handleClear}
          disabled={loading || !inputText}
          className="btn-premium-outline px-6"
          title="Clear everything"
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
            <p className="font-bold text-red-800">Operational Hindrance</p>
            <p className="text-sm text-red-600/80 font-medium leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Translation Result */}
      {translation && (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="flex items-center justify-between mb-4 ml-1">
            <label className="text-sm font-bold text-slate-600">
              Ibani Rendering
            </label>
            <button
              onClick={handleCopy}
              className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 rounded-lg transition-colors duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Result
            </button>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-indigo-400 rounded-[22px] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-white border border-slate-100 rounded-[20px] shadow-sm p-8">
              <p className="text-2xl text-slate-800 font-bold leading-relaxed mb-8">
                {translation.translation}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary-400"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mechanism</span>
                  <span className="text-xs font-bold text-slate-600">{translation.model}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Source Confidence</span>
                  <span className="text-xs font-bold text-slate-600">High</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleTranslator;

