import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onRetry, 
  className = '' 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center mb-4">
          <AlertCircle className="text-red-600 dark:text-red-400 mr-3" size={24} />
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
            Erro ao Carregar
          </h3>
        </div>
        <p className="text-red-700 dark:text-red-300 mb-4">
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center justify-center w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw size={16} className="mr-2" />
            Tentar Novamente
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;