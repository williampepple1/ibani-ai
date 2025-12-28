import { useState } from 'react';
import Header from './components/Header';

import SingleTranslator from './components/SingleTranslator';
import BatchTranslator from './components/BatchTranslator';
import Dictionary from './components/Dictionary';

import type { TranslationResponse } from './types';

type TabType = 'single' | 'batch' | 'dictionary';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('single');

  const handleTranslationComplete = () => {
    // console.log('Translation complete:', result);
  };

  const handleBatchTranslationComplete = (_results: TranslationResponse[]) => {
    // console.log('Batch translation complete:', _results);
  };

  return (
    <div className="min-h-screen bg-mesh selection:bg-primary-200/50">
      <Header />

      <main className="container mx-auto px-3 sm:px-4 md:px-6 pb-8 sm:pb-12 relative z-10">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="bg-slate-200/50 backdrop-blur-md p-1 rounded-xl flex gap-1 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('single')}
              className={`tab-button ${
                activeTab === 'single' ? 'tab-button-active' : 'tab-button-inactive'
              }`}
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span className="whitespace-nowrap">Single</span>
            </button>

            <button
              onClick={() => setActiveTab('batch')}
              className={`tab-button ${
                activeTab === 'batch' ? 'tab-button-active' : 'tab-button-inactive'
              }`}
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span className="whitespace-nowrap">Batch</span>
            </button>
            <button
              onClick={() => setActiveTab('dictionary')}
              className={`tab-button ${
                activeTab === 'dictionary' ? 'tab-button-active' : 'tab-button-inactive'
              }`}
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="whitespace-nowrap">Dictionary</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-3xl mx-auto transition-all duration-500">
          {activeTab === 'single' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <SingleTranslator onTranslationComplete={handleTranslationComplete} />
            </div>
          )}
          {activeTab === 'batch' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <BatchTranslator onTranslationComplete={handleBatchTranslationComplete} />
            </div>
          )}
          {activeTab === 'dictionary' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Dictionary />
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 sm:mt-16 text-center">
          <div className="max-w-lg mx-auto border-t border-slate-200 pt-6 sm:pt-8 px-4">
            <p className="text-slate-400 text-[10px] sm:text-xs font-medium uppercase tracking-widest">
              Ibani Translator &bull; Empowering communication
            </p>

          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
