import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MonetizationContextType {
  enableAds: boolean;
  setEnableAds: (enable: boolean) => void;
}

const MonetizationContext = createContext<MonetizationContextType | undefined>(undefined);

export const useMonetization = () => {
  const context = useContext(MonetizationContext);
  if (!context) {
    throw new Error('useMonetization must be used within MonetizationProvider');
  }
  return context;
};

interface MonetizationProviderProps {
  children: ReactNode;
}

export const MonetizationProvider: React.FC<MonetizationProviderProps> = ({ children }) => {
  const [enableAds, setEnableAds] = useState(true);
  
  return (
    <MonetizationContext.Provider value={{ enableAds, setEnableAds }}>
      {children}
    </MonetizationContext.Provider>
  );
};

interface MonetizationManagerProps {
  page: string;
}

const MonetizationManager: React.FC<MonetizationManagerProps> = ({ page }) => {
  const { enableAds } = useMonetization();
  
  if (!enableAds) return null;

  return (
    <div className="monetization-manager" data-page={page}>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
          Anúncios {page === 'home' ? 'Página Inicial' : page}
        </h4>
        <div className="text-xs text-gray-500 dark:text-gray-500">
          <p>Gerenciamento de monetização ativo para esta página</p>
        </div>
      </div>
    </div>
  );
};

export default MonetizationManager;
