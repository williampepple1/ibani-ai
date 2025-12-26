import { useState } from 'react';
import Header from './components/Header';

import SingleTranslator from './components/SingleTranslator';
import BatchTranslator from './components/BatchTranslator';

import type { TranslationResponse } from './types';

type TabType = 'single' | 'batch';

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

      <main className="container mx-auto px-4 pb-12 relative z-10">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-200/50 backdrop-blur-md p-1 rounded-xl flex gap-1">
            <button
              onClick={() => setActiveTab('single')}
              className={`tab-button ${
                activeTab === 'single' ? 'tab-button-active' : 'tab-button-inactive'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span>Single</span>
            </button>
            <button
              onClick={() => setActiveTab('batch')}
              className={`tab-button ${
                activeTab === 'batch' ? 'tab-button-active' : 'tab-button-inactive'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span>Batch</span>
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
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="max-w-lg mx-auto border-t border-slate-200 pt-8">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
              Ibani Translator &bull; Empowering communication
            </p>

          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
