import React from 'react';

interface NativeAdProps {
  style: string;
  className?: string;
}

const NativeAd: React.FC<NativeAdProps> = ({ style, className = "" }) => {
  return (
    <div className={`native-ad ${className}`} data-style={style}>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-500 dark:text-gray-400 text-sm">Anúncio {style}</span>
          <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 px-2 py-1 rounded">
            SPONSORED
          </span>
        </div>
        <div className="h-48 flex items-center justify-center">
          <span className="text-gray-400 dark:text-gray-500 text-sm">Conteúdo patrocinado</span>
        </div>
      </div>
    </div>
  );
};

export default NativeAd;
