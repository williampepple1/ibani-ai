import React, { useState } from 'react';
import { translationApi } from '../services/api';
import type { DictionaryEntry } from '../types';

const Dictionary: React.FC = () => {
  const [searchWord, setSearchWord] = useState('');
  const [results, setResults] = useState<DictionaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const word = searchWord.trim();
    if (!word) {
      setError('Please enter a word to search');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const data = await translationApi.searchDictionary(word);
      
      if (Array.isArray(data) && data.length > 0) {
        setResults(data);
      } else {
        setError('This word or combination of words is currently not in the Ibani dictionary.');
      }
    } catch (err) {
      setError('This word or combination of words is currently not in the Ibani dictionary.');
      console.error('Dictionary search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card max-w-3xl mx-auto">
      {/* Header Section */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 premium-gradient rounded-lg flex items-center justify-center shadow-md">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Ibani Dictionary</h2>
            <p className="text-xs sm:text-sm text-slate-500">Enter an English word and get its Ibani equivalent, definition, part of speech, associated words and examples.</p>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            placeholder="Enter an English word..."
            className="input-premium flex-1"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="btn-premium px-4 sm:px-6 flex items-center gap-2 justify-center w-full sm:w-auto sm:min-w-[120px]"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Searching...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Search</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-2 text-red-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Results Section */}
      {results.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Search Results ({results.length})
            </h3>
          </div>
          
          <div className="space-y-2 sm:space-y-3 max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-1 sm:pr-2">
            {results.map((entry, index) => (
              <div
                key={index}
                className="p-3 sm:p-4 bg-gradient-to-br from-slate-50 to-white border border-slate-200/60 rounded-lg sm:rounded-xl hover:shadow-md transition-all duration-300 hover:border-primary-300"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base sm:text-lg font-bold text-primary-600">
                          {entry.Ibani}
                        </span>
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] sm:text-xs font-semibold rounded-full">
                          {entry.Pos}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {entry.Meaning}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && results.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-slate-500 text-sm font-medium">
            Enter a word above to search the Ibani dictionary
          </p>
        </div>
      )}
    </div>
  );
};

export default Dictionary;
