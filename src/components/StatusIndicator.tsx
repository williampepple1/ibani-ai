import React, { useEffect, useState } from 'react';
import { translationApi } from '../services/api';
import type { HealthResponse } from '../types';

const StatusIndicator: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    try {
      const response = await translationApi.checkHealth();
      setHealth(response);
      setError(null);
    } catch (err) {
      setError('API server is offline');
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card animate-fade-in">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-600 border-t-transparent"></div>
          <span className="text-sm text-gray-600">Checking server status...</span>
        </div>
      </div>
    );
  }

  if (error || !health) {
    return (
      <div className="card bg-red-50 border-2 border-red-200 animate-fade-in">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">API Server Offline</p>
            <p className="text-xs text-red-600 mt-1">
              Make sure to start the API server: <code className="bg-red-100 px-2 py-1 rounded">python api_server.py</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-green-50 border-2 border-green-200 animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-green-800">
            API Server Online {health.model_loaded && '• Model Loaded'}
          </p>
          <p className="text-xs text-green-600 mt-1">{health.model_path}</p>
        </div>
      </div>
    </div>
  );
};

export default StatusIndicator;

