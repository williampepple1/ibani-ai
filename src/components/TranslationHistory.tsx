import React, { useState, useEffect } from 'react';
import type { TranslationHistoryItem } from '../types';

const TranslationHistory: React.FC = () => {
  const [history, setHistory] = useState<TranslationHistoryItem[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem('ibani-translation-history');
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      // Convert timestamp strings back to Date objects
      const withDates = parsed.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp),
      }));
      setHistory(withDates);
    }
  }, []);

  const addToHistory = (source: string, translation: string) => {
    const newItem: TranslationHistoryItem = {
      id: Date.now().toString(),
      source,
      translation,
      timestamp: new Date(),
    };

    const updatedHistory = [newItem, ...history].slice(0, 50); // Keep only last 50
    setHistory(updatedHistory);
    localStorage.setItem('ibani-translation-history', JSON.stringify(updatedHistory));
  };

  // Expose addToHistory to parent components
  React.useEffect(() => {
    (window as any).addToTranslationHistory = addToHistory;
  }, [history]);

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all translation history?')) {
      setHistory([]);
      localStorage.removeItem('ibani-translation-history');
    }
  };

  const deleteItem = (id: string) => {
    const updatedHistory = history.filter((item) => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('ibani-translation-history', JSON.stringify(updatedHistory));
  };

  const filteredHistory = history.filter(
    (item) =>
      item.source.toLowerCase().includes(filter.toLowerCase()) ||
      item.translation.toLowerCase().includes(filter.toLowerCase())
  );

  if (history.length === 0) {
    return (
      <div className="card animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Translation History</h2>
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-4 text-gray-600">No translation history yet</p>
          <p className="text-sm text-gray-500">Your translations will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Translation History ({history.length})
        </h2>
        <button
          onClick={clearHistory}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Search Filter */}
      <div className="mb-4">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search history..."
          className="input-field"
        />
      </div>

      {/* History List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredHistory.map((item) => (
          <div
            key={item.id}
            className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">English:</span> {item.source}
                </p>
                <p className="text-base text-gray-800">
                  <span className="text-sm text-gray-600 font-normal">Ibani:</span>{' '}
                  {item.translation}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {item.timestamp.toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => deleteItem(item.id)}
                className="ml-4 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredHistory.length === 0 && filter && (
        <div className="text-center py-8">
          <p className="text-gray-600">No results found for "{filter}"</p>
        </div>
      )}
    </div>
  );
};

export default TranslationHistory;

