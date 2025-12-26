import React, { useState } from 'react';
import Header from './components/Header';
import StatusIndicator from './components/StatusIndicator';
import SingleTranslator from './components/SingleTranslator';
import BatchTranslator from './components/BatchTranslator';
import TranslationHistory from './components/TranslationHistory';
import type { TranslationResponse } from './types';

type TabType = 'single' | 'batch' | 'history';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('single');

  const handleTranslationComplete = (result: TranslationResponse) => {
    // Add to history via global function
    if ((window as any).addToTranslationHistory) {
      (window as any).addToTranslationHistory(result.source, result.translation);
    }
  };

  const handleBatchTranslationComplete = (results: TranslationResponse[]) => {
    // Add all to history
    if ((window as any).addToTranslationHistory) {
      results.forEach((result) => {
        (window as any).addToTranslationHistory(result.source, result.translation);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Status Indicator */}
        <div className="mb-8">
          <StatusIndicator />
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-md p-2 inline-flex space-x-2">
            <button
              onClick={() => setActiveTab('single')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'single'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                  />
                </svg>
                <span>Single</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('batch')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'batch'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
                <span>Batch</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'history'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>History</span>
              </div>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'single' && (
            <SingleTranslator onTranslationComplete={handleTranslationComplete} />
          )}
          {activeTab === 'batch' && (
            <BatchTranslator onTranslationComplete={handleBatchTranslationComplete} />
          )}
          {activeTab === 'history' && <TranslationHistory />}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-600">
          <div className="border-t border-gray-300 pt-8">
            <p className="text-sm">
              Ibani Translator • Powered by Marian MT Model
            </p>
            <p className="text-xs mt-2 text-gray-500">
              Make sure the API server is running on{' '}
              <code className="bg-gray-200 px-2 py-1 rounded">localhost:8080</code>
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;

