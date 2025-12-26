import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-primary-600 to-primary-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">Ibani Translator</h1>
            <p className="text-primary-100 text-sm">English to Ibani Language Translation</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-xs uppercase tracking-wide">AI-Powered</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

